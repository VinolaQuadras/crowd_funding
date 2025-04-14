import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPaymentDetails, fetchStartupPayments, fetchUserPayments } from "../Actions/PaymentAction";


interface Payment {
  id: number;
  userId: string;
  startupId: string;
  startupName: string;
  amount: number;
  paymentStatus: string;
  stripePaymentIntentId: string;
  sharesAllocated: number | null;
  createdAt: string;
  updatedAt: string;
}

interface PaymentState {
  payments: Payment[];
  payment: Payment | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  payment: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    clearPaymentData: (state) => {
      state.payments = [];
      state.payment = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPayments.fulfilled, (state, action: PayloadAction<Payment[]>) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchUserPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchPaymentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentDetails.fulfilled, (state, action: PayloadAction<Payment>) => {
        state.loading = false;
        state.payment = action.payload;
      })
      .addCase(fetchPaymentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchStartupPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStartupPayments.fulfilled, (state, action: PayloadAction<Payment[]>) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchStartupPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentError, clearPaymentData } = paymentSlice.actions;
export default paymentSlice.reducer;
