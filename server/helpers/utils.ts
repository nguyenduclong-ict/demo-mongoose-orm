import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dj from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import path from "path";
import fs from "fs";
dj.extend(customParseFormat);

export const getBearerToken = (str: string) => {
  if (!str || !str.startsWith("Bearer ")) return null;
  return str.slice(7).trim();
};

export const resolveToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const createToken = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "60d" });
};

export const hashPasssword = async (password: string) =>
  bcrypt.hash(password, await bcrypt.genSalt());

export const comparePassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const compareObjectId = (a: any, b: any) => String(a) === String(b);

export const renameFile = (
  filePath: string,
  rename: (name: string) => string
) => {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const oldName = path.basename(filePath, ext);
  const newName = rename(oldName);
  return path.resolve(dir, newName + ext);
};

export function checkFileExists(filepath: string) {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.constants.F_OK, (error) => {
      resolve(!error);
    });
  });
}

export function nonAccentVietnamese(str: string) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
}

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const dayjs = dj;

String.prototype.format = function (data: any) {
  let text = this;
  Object.keys(data).forEach((key) => {
    text = text.replace(new RegExp("{" + key + "}", "g"), data[key]);
  });
  return text;
};
