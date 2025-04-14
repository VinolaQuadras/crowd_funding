import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStartups, updateStartupStatusService } from "../../Apis/StartupApi";


export const getStartups = createAsyncThunk("startups/getStartups", async (_, { rejectWithValue }) => {
  try {
    console.log("Calling API to fetch startups...");
    const response = await fetchStartups();
    console.log("Fetched Startups:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching startups:", error);
    return rejectWithValue(error.message || "Failed to fetch startups");
  }
});

export const updateStartupStatus = createAsyncThunk(
  "startups/updateStartupStatus",
  async ({ startupId, status }: { startupId: string; status: string }, { getState }) => {
    const token = (getState() as any).auth.token;
    return await updateStartupStatusService(startupId, status, token);
  }
);
