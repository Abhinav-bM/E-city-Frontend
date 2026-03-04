import { SLICE_STATUS } from "@/utils/constants";

export declare namespace User {
  export interface Root {}

  export interface UserState {
    user: LoginUserData | null;
    isAuthenticated: boolean;
    authCheckComplete: boolean;
    status: SLICE_STATUS;
  }

  export interface LoginUserData {
    userId: string;
    phone: string;
    name?: string;
    email?: string;
  }
}
