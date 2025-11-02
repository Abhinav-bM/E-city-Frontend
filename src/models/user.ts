import { SLICE_STATUS } from "@/utils/constants";

export declare namespace User {
  export interface Root {}

  export interface UserState {
    user: LoginUserData | null;
    isAuthenticated: boolean;
    status: SLICE_STATUS;
  }

  export interface LoginUserData {
    email: string;
    first_name: string;
    last_name: string;
    access: string;
    refresh: string;
    user_id: number;
    phone_number: string;
  }
}
