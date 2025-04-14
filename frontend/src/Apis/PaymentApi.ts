import axios from "axios";
import { PAYMENT_API_URL } from "../config/apiConfig";

class PaymentService {
  async getUserPayments(userId: string) {
    const response = await axios.get(`${PAYMENT_API_URL}/user/${userId}`);
    return response.data;
  }

  async getPaymentDetails(paymentId: number) {
    const response = await axios.get(`${PAYMENT_API_URL}/${paymentId}`);
    return response.data;
  }

  async getStartupPayments(startupId: string) {
    const response = await axios.get(`${PAYMENT_API_URL}/startup/${startupId}`);
    return response.data;
  }

  async createPaymentIntent(userId: string, startupId: string, amount: number) {
    const response = await axios.post(`${PAYMENT_API_URL}/create-intent`, {
      userId,
      startupId,
      amount,
    });
    return response.data;
  }
}

export default new PaymentService();
