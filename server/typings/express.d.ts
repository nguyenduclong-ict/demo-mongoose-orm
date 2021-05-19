import { Permission } from "@/entities/account/Permission";
import { User } from "@/entities/account/User";
declare global {
  namespace Express {
    export interface Request {
      meta?: {
        user?: User & { id?: any; _id?: any };
        authenticated?: boolean;
        permissions?: Permission[];
        [x: string]: any;
      };
    }
  }
}
