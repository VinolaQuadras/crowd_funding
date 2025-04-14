import axios from "axios";
import { AppDispatch } from "../Store/index";
import { setUserProfile } from "../Store/Actions/AuthActions"
import { AUTH_API_URL ,API_BASEBACKEND_URL} from "../config/apiConfig";

export const login = async (email: string, password: string) => {
  return await axios.post(`${AUTH_API_URL}/login`, { email, password });
};

export const forgotPassword = async (email: string) => {
  return await axios.post(`${AUTH_API_URL}/forgot-password`, { email });
};

export const resetPassword = async (token: string, newPassword: string, confirmPassword: string) => {
  return await axios.post(`${AUTH_API_URL}/reset-password`, { token, newPassword, confirmPassword });
};

export const signup = async (data: FormData) => {
  return await axios.post(`${AUTH_API_URL}/register`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const fetchUserProfile = async (token: string, dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`${AUTH_API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let { firstName, lastName, profileImage, email, phoneNumber, userId } = response.data;

    if (profileImage && !profileImage.startsWith("http")) {
      profileImage = `${API_BASEBACKEND_URL}${profileImage}`;
    }

    dispatch(setUserProfile({ firstName, lastName, profileImage, email, phoneNumber, userId }));
  } catch (error) {
    console.error("Failed to fetch user profile", error);
  }
};
