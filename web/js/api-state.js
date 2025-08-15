// Application State Management
class AppState {
  constructor() {
    this.currentStep = "products";
    this.selectedProduct = null;
    this.selectedExtras = [];
    this.orderTotal = 0;
    this.listeners = [];
  }

  setState(newState) {
    Object.assign(this, newState);
    this.calculateTotal();
    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this));
  }

  calculateTotal() {
    const productPrice = this.selectedProduct ? this.selectedProduct.price : 0;
    const extrasPrice = this.selectedExtras.reduce((sum, extra) => {
      return sum + extra.costPrice * (extra.quantity || 1);
    }, 0);
    this.orderTotal = productPrice + extrasPrice;
  }
}

// Global app state
const appState = new AppState();
