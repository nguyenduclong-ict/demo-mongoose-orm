"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInitedApplication = exports.getUserPermissions = exports.logout = exports.initApplication = exports.changePassword = exports.register = exports.updateProfile = exports.loginWithFacebook = exports.login = exports.getAccountInfo = void 0;
const config_1 = require("@/config");
const entities_1 = require("@/entities");
const helpers_1 = require("@/helpers");
const error_1 = require("@/helpers/error");
const axios_1 = __importDefault(require("axios"));
const mongoose_orm_1 = require("mongoose-orm");
const getAccountInfo = (req, res, next) => {
    return res.json(req.meta.user);
};
exports.getAccountInfo = getAccountInfo;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield entities_1.userRepository.findOne({
            query: { $or: [{ username }, { phone: username }, { email: username }] },
        });
        if (!user)
            return next(error_1.createError(401, "User not found"));
        if (user.blocked)
            return next(error_1.createError(401, "User is blocked"));
        if (!helpers_1.Utils.comparePassword(password, user.password)) {
            return next(error_1.createError(401, "Password not match"));
        }
        const token = helpers_1.Utils.createToken({ id: user.id });
        return res.json({ token });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const loginWithFacebook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const endpoint = "https://graph.facebook.com/v7.0/me";
        const response = yield axios_1.default.get(endpoint, {
            params: {
                fields: "id,name,picture{url}",
                access_token: req.body.token,
            },
        });
        const { id, name, picture } = response.data;
        let user = yield entities_1.userRepository.findOne({
            query: {
                facebookId: id,
            },
        });
        const CustomerRole = yield entities_1.roleRepository.findOne({
            query: {
                code: config_1.C.ROLES.CUSTOMER,
            },
        });
        if (!user) {
            // create user if not exist
            user = yield entities_1.userRepository.create({
                data: {
                    phone: "",
                    email: "",
                    username: "FB" + id,
                    facebookId: id,
                    password: yield helpers_1.Utils.hashPasssword(req.body.password),
                    blocked: false,
                    roles: [CustomerRole.id],
                    profile: {
                        name: name,
                        avatar: picture,
                        gender: null,
                    },
                },
            });
        }
        const token = helpers_1.Utils.createToken({ id: user.id });
        return res.json({ token });
    }
    catch (error) {
        console.error("loginWithFacebook error", error);
        next(error_1.createError(401, "Có lỗi xảy ra"));
    }
});
exports.loginWithFacebook = loginWithFacebook;
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.meta.user;
        const { phone, email, username, facebookId, profile, addresses } = req.body;
        if (username !== user.username) {
            return next(error_1.createError(403, "Bạn không có quyền cập nhật thông tin của người khác"));
        }
        if (phone &&
            (yield entities_1.userRepository.findOne({
                query: {
                    id: { $ne: user.id },
                    phone,
                },
            }))) {
            return next(error_1.createError(403, "Số điện thoại đã có người sử dụng"));
        }
        if (email &&
            (yield entities_1.userRepository.findOne({
                query: {
                    id: { $ne: user.id },
                    email,
                },
            }))) {
            return next(error_1.createError(403, "Email đã có người sử dụng"));
        }
        yield entities_1.userRepository.updateOne({
            query: {
                id: user.id,
            },
            data: {
                phone,
                email,
                profile,
            },
        });
        const response = yield entities_1.userRepository.fetchUser(user.id);
        res.json(response);
    }
    catch (error) {
        console.error("updateProfile", error);
        next(error);
    }
});
exports.updateProfile = updateProfile;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const method = req.query.method || "username";
        if (method === "username") {
            if (yield entities_1.userRepository.findOne({
                query: {
                    $or: [
                        { username: req.body.username },
                        { phone: req.body.username },
                    ],
                },
            })) {
                return next(error_1.createError(400, "Tài khoản đã tồn tại!"));
            }
            const CustomerRole = yield entities_1.roleRepository.findOne({
                query: {
                    code: config_1.C.ROLES.CUSTOMER,
                },
            });
            const data = {
                username: req.body.username || req.body.phone || req.body.email,
                phone: req.body.phone,
                email: req.body.email,
                password: yield helpers_1.Utils.hashPasssword(req.body.password),
                blocked: false,
                roles: [CustomerRole.id],
                profile: {
                    name: (_a = req.body.profile) === null || _a === void 0 ? void 0 : _a.name,
                    avatar: (_b = req.body.profile) === null || _b === void 0 ? void 0 : _b.avatar,
                    gender: ((_c = req.body.profile) === null || _c === void 0 ? void 0 : _c.gender) || "male",
                },
            };
            if (!data.username) {
                return next(error_1.createError(401, "Tên tài khoản là bắt buộc"));
            }
            if (data.username &&
                (yield entities_1.userRepository.findOne({ query: { username: data.username } }))) {
                return next(error_1.createError(422, "Tài khoản đã tồn tại"));
            }
            const user = yield entities_1.userRepository.create({
                data,
                populates: ["roles"],
            });
            const token = yield helpers_1.Utils.createToken({ id: user.id });
            return res.json({
                token,
                user,
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, password } = req.body;
        console.log(oldPassword, password);
        if (!(yield helpers_1.Utils.comparePassword(oldPassword, req.meta.user.password))) {
            return next(error_1.createError(401, "Mật khẩu cũ không chính xác!", null, "OLD_PASSWORD_NOT_MATCH"));
        }
        yield entities_1.userRepository.updateOne({
            query: {
                id: mongoose_orm_1.getObjectId(req.meta.user),
            },
            data: {
                password: yield helpers_1.Utils.hashPasssword(password),
            },
        });
        res.json({ success: true, message: "Đổi mật khẩu thành công" });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.changePassword = changePassword;
const initApplication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    try {
        // init application
        const isInited = yield entities_1.configRepository.findOne({
            query: { key: "inited_app" },
        });
        if (isInited === null || isInited === void 0 ? void 0 : isInited.value) {
            return next(config_1.E.Error(500, "App Already Inited Before"));
        }
        // init roles
        const roles = yield entities_1.roleRepository.createMany({
            data: [
                {
                    name: "Admin",
                    code: config_1.C.ROLES.ADMIN,
                },
                {
                    name: "Nhân viên",
                    code: config_1.C.ROLES.STAFF,
                },
                {
                    name: "Khách hàng",
                    code: config_1.C.ROLES.CUSTOMER,
                },
            ],
        });
        // Create admin user
        const userData = req.body.admin;
        const data = {
            username: userData.username,
            password: yield helpers_1.Utils.hashPasssword(userData.password),
            blocked: false,
            isAdmin: true,
            profile: {
                name: (_d = userData.profile) === null || _d === void 0 ? void 0 : _d.name,
                avatar: (_e = userData.profile) === null || _e === void 0 ? void 0 : _e.avatar,
                gender: ((_f = userData.profile) === null || _f === void 0 ? void 0 : _f.gender) || "male",
            },
        };
        const adminUser = yield entities_1.userRepository.create({
            data,
            populates: ["roles"],
        });
        const token = helpers_1.Utils.createToken({ id: adminUser.id });
        // save state inited
        if (isInited) {
            isInited.value = true;
            yield entities_1.configRepository.updateOne({
                query: {
                    id: isInited.id,
                },
                data: {
                    value: true,
                },
            });
        }
        else {
            yield entities_1.configRepository.create({
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
    }
    catch (error) {
        next(error);
    }
});
exports.initApplication = initApplication;
const logout = (req, res, next) => {
    res.json(true);
};
exports.logout = logout;
const getUserPermissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = yield entities_1.userRepository.getUserPermissions(req.meta.user);
    res.json(permissions);
});
exports.getUserPermissions = getUserPermissions;
const isInitedApplication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const isInited = yield entities_1.configRepository.findOne({
        query: { key: "inited_app" },
    });
    res.json(!!isInited);
});
exports.isInitedApplication = isInitedApplication;
//# sourceMappingURL=auth.controller.js.map