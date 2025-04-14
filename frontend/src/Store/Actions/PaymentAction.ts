import { createAsyncThunk } from "@reduxjs/toolkit";
import PaymentService from "../../Apis/PaymentApi";


export const fetchUserPayments = createAsyncThunk(
  "payments/fetchUserPayments",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { userId: string } };
      if (!auth.userId) {
        return rejectWithValue("User not authenticated");
      }
      return await PaymentService.getUserPayments(auth.userId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payments");
    }
  }
);

export const fetchPaymentDetails = createAsyncThunk(
  "payments/fetchPaymentDetails",
  async (paymentId: number, { rejectWithValue }) => {
    try {
      return await PaymentService.getPaymentDetails(paymentId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payment details");
    }
  }
);

export const fetchStartupPayments = createAsyncThunk(
  "payments/fetchStartupPayments",
  async (startupId: string, { rejectWithValue }) => {
    try {
      return await PaymentService.getStartupPayments(startupId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch startup payments");
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  "payments/createPaymentIntent",
  async ({ userId, startupId, amount }: { userId: string; startupId: string; amount: number }) => {
    return await PaymentService.createPaymentIntent(userId, startupId, amount);
  }
);
