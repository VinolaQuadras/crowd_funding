import axios from "axios";
import {STARTUP_API_URL} from "../config/apiConfig"


export const fetchStartups = async () => {
  return await axios.get(STARTUP_API_URL);
};

export const registerStartup = async (formData: FormData, token: string) => {
  try {
    const response = await axios.post(`${STARTUP_API_URL}/register`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Something went wrong while registering the startup.";
  }
};

export const updateStartupStatusService = async (startupId: string, status: string, token: string) => {
  await axios.put(
    `${STARTUP_API_URL}/${startupId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return { startupId, status };
};
