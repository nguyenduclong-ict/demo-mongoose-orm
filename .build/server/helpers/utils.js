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
exports.dayjs = exports.delay = exports.nonAccentVietnamese = exports.checkFileExists = exports.renameFile = exports.compareObjectId = exports.comparePassword = exports.hashPasssword = exports.createToken = exports.resolveToken = exports.getBearerToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dayjs_1.default.extend(customParseFormat_1.default);
const getBearerToken = (str) => {
    if (!str || !str.startsWith("Bearer "))
        return null;
    return str.slice(7).trim();
};
exports.getBearerToken = getBearerToken;
const resolveToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
exports.resolveToken = resolveToken;
const createToken = (data) => {
    return jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET, { expiresIn: "60d" });
};
exports.createToken = createToken;
const hashPasssword = (password) => __awaiter(void 0, void 0, void 0, function* () { return bcrypt_1.default.hash(password, yield bcrypt_1.default.genSalt()); });
exports.hashPasssword = hashPasssword;
const comparePassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () { return bcrypt_1.default.compare(password, hash); });
exports.comparePassword = comparePassword;
const compareObjectId = (a, b) => String(a) === String(b);
exports.compareObjectId = compareObjectId;
const renameFile = (filePath, rename) => {
    const dir = path_1.default.dirname(filePath);
    const ext = path_1.default.extname(filePath);
    const oldName = path_1.default.basename(filePath, ext);
    const newName = rename(oldName);
    return path_1.default.resolve(dir, newName + ext);
};
exports.renameFile = renameFile;
function checkFileExists(filepath) {
    return new Promise((resolve, reject) => {
        fs_1.default.access(filepath, fs_1.default.constants.F_OK, (error) => {
            resolve(!error);
        });
    });
}
exports.checkFileExists = checkFileExists;
function nonAccentVietnamese(str) {
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
exports.nonAccentVietnamese = nonAccentVietnamese;
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.delay = delay;
exports.dayjs = dayjs_1.default;
String.prototype.format = function (data) {
    let text = this;
    Object.keys(data).forEach((key) => {
        text = text.replace(new RegExp("{" + key + "}", "g"), data[key]);
    });
    return text;
};
//# sourceMappingURL=utils.js.map