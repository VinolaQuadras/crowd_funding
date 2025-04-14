import { createReducer } from "@reduxjs/toolkit";
import {AuthState} from "../../Models/Auth.types";
import { loginSuccess, logout, setUserProfile } from "../Actions/AuthActions"

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  userId: localStorage.getItem("userId") || null,
  role: localStorage.getItem("role") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  firstName: localStorage.getItem("firstName") || null,
  lastName: localStorage.getItem("lastName") || null,
  profileImage: localStorage.getItem("profileImage") || null,
  email: localStorage.getItem("email") || null,
  phoneNumber: localStorage.getItem("phoneNumber") || null,
};
const AuthReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginSuccess, (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("role", action.payload.role);
    })
    .addCase(setUserProfile, (state, action) => {
      Object.assign(state, action.payload);
      if (action.payload.firstName) localStorage.setItem("firstName", action.payload.firstName);
      if (action.payload.lastName) localStorage.setItem("lastName", action.payload.lastName);
      if (action.payload.profileImage) localStorage.setItem("profileImage", action.payload.profileImage);
      if (action.payload.email) localStorage.setItem("email", action.payload.email);
      if (action.payload.phoneNumber) localStorage.setItem("phoneNumber", action.payload.phoneNumber);
    })
    .addCase(logout, (state) => {
      state.token = null;
      state.userId = null;
      state.role = null;
      state.isAuthenticated = false;
      state.firstName = null;
      state.lastName = null;
      state.profileImage = null;
      state.email = null;
      state.phoneNumber = null;

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("profileImage");
      localStorage.removeItem("email");
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("password");

      localStorage.clear();
    });
});

export default AuthReducer;