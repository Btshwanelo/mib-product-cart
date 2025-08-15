// API Configuration
const API_CONFIG = {
  baseUrl:
    "https://fff.sandbox.api.ezra360.com/api/v1.0/entities/ExecuteRequest",
  apiKey: "TPiNa.aoAj0IkST3vQlyM9BRPiKphXmXSIxinKB8mPXSbnx5U",
  headers: {
    "api-key": "TPiNa.aoAj0IkST3vQlyM9BRPiKphXmXSIxinKB8mPXSbnx5U",
    "Content-Type": "application/json",
  },
};

// API Service
class ApiService {
  static async request(
    entityName,
    requestName,
    inputParamters = {},
    recordId = null
  ) {
    const body = {
      entityName,
      requestName,
      ...(recordId && { RecordId: recordId }),
      ...(Object.keys(inputParamters).length > 0 && { inputParamters }),
    };

    try {
      const response = await fetch(API_CONFIG.baseUrl, {
        method: "POST",
        headers: API_CONFIG.headers,
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!result.isSuccess && result.clientMessage) {
        window.showNotification(result.clientMessage, "error");
      }

      return result;
    } catch (error) {
      console.error("API Error:", error);
      window.showNotification(
        "Network error. Please check your connection.",
        "error"
      );
      throw error;
    }
  }

  static async getProducts() {
    return this.request("ProductGroup", "ProductGroupListingExecuteRequest");
  }

  static async getExtras() {
    return this.request("Product", "GetExtraProducts");
  }

  static async submitOrder(productData) {
    return this.request(
      "Burial",
      "FecthingProductData",
      { ProductData: productData },
      "41822ddd-155b-4470-9aed-dddf5219c6d5"
    );
  }
}
