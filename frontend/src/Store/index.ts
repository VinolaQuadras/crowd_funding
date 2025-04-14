import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./Reducers/AuthReducer";
import { AuthState } from "../Models/Auth.types";
import PaymentReducer from "./Reducers/PaymentReducer";
import StartupReducer from "./Reducers/StartupReducer";



const preloadedState: { auth: AuthState } = {
  auth: {
    token: localStorage.getItem("token") ?? null,
    userId: localStorage.getItem("userId") ?? null,
    role: localStorage.getItem("role") ?? null,
    isAuthenticated: !!localStorage.getItem("token"),
    firstName: localStorage.getItem("firstName") ?? null,
    lastName: localStorage.getItem("lastName") ?? null,
    profileImage: localStorage.getItem("profileImage") ?? null,
    email: localStorage.getItem("email") ?? null,
    phoneNumber: localStorage.getItem("phoneNumber") ?? null,
  },
};

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    startups: StartupReducer,
    payment: PaymentReducer,
    
  },
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
