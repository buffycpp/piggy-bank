import axios from "axios";

// See backend/Controllers/PiggyBankController.cs or {host}/swagger/index.html for routes documentation
export default class APIConsumer {
  static BACKEND_URL = 'https://localhost:7191';

  static async getAccountData() {
    return await axios.get(`${this.BACKEND_URL}/account-data`);
  }

  static async getAccountHistory() {
    return await axios.get(`${this.BACKEND_URL}/account-history`);
  }

  static async deposit(amount) {
    return await axios.post(`${this.BACKEND_URL}/deposit`, null, {
      params: {
        amount
      }
    });
  }

  static async withdraw(amount) {
    return await axios.post(`${this.BACKEND_URL}/withdraw`, null, {
      params: {
        amount
      }
    });
  }

  static async updateSavingsGoal(amount) {
    return await axios.post(`${this.BACKEND_URL}/update-savings-goal`, null, {
      params: {
        amount
      }
    });
  }
}