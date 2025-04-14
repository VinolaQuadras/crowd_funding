import { createSlice } from "@reduxjs/toolkit";
import { getStartups, updateStartupStatus } from "../Actions/StartupAction";


export interface Startup {
  startupId: string;
  userId: string;
  name: string;
  description: string;
  bannerPath: string;
  pitchDeckPath: string;
  logoPath: string;
  businessDocPath: string;
  termsDocPath: string;
  pricePerShare: number;
  status: string;
  industryType: string;
  totalFundingGoal: number;
  equityOffered: number;
  preMoneyValuation: number;
  minInvestment: number;
  maxInvestment: number;
  totalInvestment: number;
  fundingDeadline: string;
  createdAt: string;
}

interface StartupState {
  startups: Startup[];
  loading: boolean;
  error: string | null;
}

const initialState: StartupState = {
  startups: [],
  loading: false,
  error: null,
};

const startupSlice = createSlice({
  name: "startups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStartups.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStartups.fulfilled, (state, action) => {
        console.log("Storing fetched startups in Redux:", action.payload);
        state.startups = action.payload;
        state.loading = false;
      })
      .addCase(getStartups.rejected, (state, action) => {
        console.error("Redux rejected startup fetch:", action.payload);
        state.loading = false;
        state.error = action.error.message || "Failed to fetch startups";
      })
      .addCase(updateStartupStatus.fulfilled, (state, action) => {
        const startup = state.startups.find((s) => s.startupId === action.payload.startupId);
        if (startup) {
          startup.status = action.payload.status;
        }
      });
  },
});

export default startupSlice.reducer;
