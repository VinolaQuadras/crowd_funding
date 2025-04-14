import { createAction } from "@reduxjs/toolkit";
import { LoginPayload, UserProfile } from "../../Models/Auth.types"

export const loginSuccess = createAction<LoginPayload>("auth/loginSuccess");

export const setUserProfile = createAction <Partial<UserProfile>>("auth/setUserProfile");

export const logout = createAction("auth/logout");