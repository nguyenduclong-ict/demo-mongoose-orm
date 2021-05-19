import { createRouterApi } from "@/helpers/gateway";
import { FetchUser, isAuthenticated } from "@/middlewares/auth";
import {
  getAccountInfo,
  login,
  register,
  loginWithFacebook,
  updateProfile,
  logout,
  initApplication,
  getUserPermissions,
  changePassword,
  isInitedApplication,
} from "./auth.controller";

export default createRouterApi({
  path: "/auth",
  routes: {
    "GET /me": [isAuthenticated, getAccountInfo],
    "POST /login": login,
    "POST /register": register,
    "POST /login-facebook": loginWithFacebook,
    "POST /me": [isAuthenticated, updateProfile],
    "POST /change-password": [isAuthenticated, changePassword],
    "POST /init": initApplication,
    "GET /inited": isInitedApplication,
    "POST /logout": [isAuthenticated, logout],
    "GET /permissions": [FetchUser, getUserPermissions],
  },
});
