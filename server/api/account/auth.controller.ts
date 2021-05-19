import { C, E } from "@/config";
import { configRepository, roleRepository, userRepository } from "@/entities";
import { User } from "@/entities/account/User";
import { Utils } from "@/helpers";
import { createError } from "@/helpers/error";
import axios from "axios";
import { RequestHandler } from "express";
import { getObjectId } from "mongoose-orm";

export const getAccountInfo: RequestHandler = (req, res, next) => {
  return res.json(req.meta.user);
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userRepository.findOne({
      query: { $or: [{ username }, { phone: username }, { email: username }] },
    });

    if (!user) return next(createError(401, "User not found"));
    if (user.blocked) return next(createError(401, "User is blocked"));
    if (!Utils.comparePassword(password, user.password)) {
      return next(createError(401, "Password not match"));
    }
    const token = Utils.createToken({ id: user.id });
    return res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const loginWithFacebook: RequestHandler = async (req, res, next) => {
  try {
    const endpoint = "https://graph.facebook.com/v7.0/me";
    const response = await axios.get(endpoint, {
      params: {
        fields: "id,name,picture{url}",
        access_token: req.body.token,
      },
    });
    const { id, name, picture } = response.data;
    let user = await userRepository.findOne({
      query: {
        facebookId: id,
      },
    });

    const CustomerRole = await roleRepository.findOne({
      query: {
        code: C.ROLES.CUSTOMER,
      },
    });

    if (!user) {
      // create user if not exist
      user = await userRepository.create({
        data: {
          phone: "",
          email: "",
          username: "FB" + id,
          facebookId: id,
          password: await Utils.hashPasssword(req.body.password),
          blocked: false,
          roles: [CustomerRole.id],
          profile: {
            name: name,
            avatar: picture,
            gender: null,
          },
        } as User,
      });
    }
    const token = Utils.createToken({ id: user.id });
    return res.json({ token });
  } catch (error) {
    console.error("loginWithFacebook error", error);
    next(createError(401, "Có lỗi xảy ra"));
  }
};

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const user = req.meta.user;
    const { phone, email, username, facebookId, profile, addresses } = req.body;
    if (username !== user.username) {
      return next(
        createError(403, "Bạn không có quyền cập nhật thông tin của người khác")
      );
    }
    if (
      phone &&
      (await userRepository.findOne({
        query: {
          id: { $ne: user.id },
          phone,
        },
      }))
    ) {
      return next(createError(403, "Số điện thoại đã có người sử dụng"));
    }

    if (
      email &&
      (await userRepository.findOne({
        query: {
          id: { $ne: user.id },
          email,
        },
      }))
    ) {
      return next(createError(403, "Email đã có người sử dụng"));
    }

    await userRepository.updateOne({
      query: {
        id: user.id,
      },
      data: {
        phone,
        email,
        profile,
      },
    });
    const response = await userRepository.fetchUser(user.id);
    res.json(response);
  } catch (error) {
    console.error("updateProfile", error);
    next(error);
  }
};

export const register: RequestHandler = async (req, res, next) => {
  try {
    const method = req.query.method || "username";

    if (method === "username") {
      if (
        await userRepository.findOne({
          query: {
            $or: [
              { username: req.body.username },
              { phone: req.body.username },
            ],
          },
        })
      ) {
        return next(createError(400, "Tài khoản đã tồn tại!"));
      }

      const CustomerRole = await roleRepository.findOne({
        query: {
          code: C.ROLES.CUSTOMER,
        },
      });

      const data = {
        username: req.body.username || req.body.phone || req.body.email,
        phone: req.body.phone,
        email: req.body.email,
        password: await Utils.hashPasssword(req.body.password),
        blocked: false,
        roles: [CustomerRole.id],
        profile: {
          name: req.body.profile?.name,
          avatar: req.body.profile?.avatar,
          gender: req.body.profile?.gender || "male",
        },
      } as User;

      if (!data.username) {
        return next(createError(401, "Tên tài khoản là bắt buộc"));
      }

      if (
        data.username &&
        (await userRepository.findOne({ query: { username: data.username } }))
      ) {
        return next(createError(422, "Tài khoản đã tồn tại"));
      }

      const user = await userRepository.create({
        data,
        populates: ["roles"],
      });

      const token = await Utils.createToken({ id: user.id });

      return res.json({
        token,
        user,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const { oldPassword, password } = req.body;
    console.log(oldPassword, password);
    if (!(await Utils.comparePassword(oldPassword, req.meta.user.password))) {
      return next(
        createError(
          401,
          "Mật khẩu cũ không chính xác!",
          null,
          "OLD_PASSWORD_NOT_MATCH"
        )
      );
    }

    await userRepository.updateOne({
      query: {
        id: getObjectId(req.meta.user),
      },
      data: {
        password: await Utils.hashPasssword(password),
      },
    });

    res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const initApplication: RequestHandler = async (req, res, next) => {
  try {
    // init application
    const isInited = await configRepository.findOne({
      query: { key: "inited_app" },
    });

    if (isInited?.value) {
      return next(E.Error(500, "App Already Inited Before"));
    }

    // init roles
    const roles = await roleRepository.createMany({
      data: [
        {
          name: "Admin",
          code: C.ROLES.ADMIN,
        },
        {
          name: "Nhân viên",
          code: C.ROLES.STAFF,
        },
        {
          name: "Khách hàng",
          code: C.ROLES.CUSTOMER,
        },
      ],
    });

    // Create admin user
    const userData = req.body.admin as User;
    const data = {
      username: userData.username,
      password: await Utils.hashPasssword(userData.password),
      blocked: false,
      isAdmin: true,
      profile: {
        name: userData.profile?.name,
        avatar: userData.profile?.avatar,
        gender: userData.profile?.gender || "male",
      },
    } as User;
    const adminUser = await userRepository.create({
      data,
      populates: ["roles"],
    });
    const token = Utils.createToken({ id: adminUser.id });

    // save state inited
    if (isInited) {
      isInited.value = true;
      await configRepository.updateOne({
        query: {
          id: isInited.id,
        },
        data: {
          value: true,
        },
      });
    } else {
      await configRepository.create({
        data: { key: "inited_app", value: true },
      });
    }

    console.log({
      message: "Inited App success",
      token,
      adminUser,
    });

    return res.json({
      message: "Inited App success",
      token,
      adminUser,
    });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  res.json(true);
};

export const getUserPermissions: RequestHandler = async (req, res, next) => {
  const permissions = await userRepository.getUserPermissions(req.meta.user);
  res.json(permissions);
};

export const isInitedApplication: RequestHandler = async (req, res, next) => {
  const isInited = await configRepository.findOne({
    query: { key: "inited_app" },
  });
  res.json(!!isInited);
};
