// Application State Management
class AppState {
  constructor() {
    this.state = {
      currentStep: "products",
      selectedProduct: null,
      selectedExtras: [],
      orderTotal: 0,
      cartItems: [],
      customerInfo: null,
      invoiceData: null
    };
    this.subscribers = [];
  }

  // Get current state
  getState() {
    return { ...this.state };
  }

  // Set state with partial updates
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifySubscribers();
  }

  // Subscribe to state changes
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Notify all subscribers
  notifySubscribers() {
    this.subscribers.forEach(callback => callback());
  }

  // Helper methods for specific state updates
  setCurrentStep(step) {
    this.setState({ currentStep: step });
  }

  setSelectedProduct(product) {
    this.setState({ selectedProduct: product });
  }

  addExtra(extra) {
    const selectedExtras = [...this.state.selectedExtras, extra];
    this.setState({ selectedExtras });
  }

  removeExtra(extraId) {
    const selectedExtras = this.state.selectedExtras.filter(extra => extra.id !== extraId);
    this.setState({ selectedExtras });
  }

  updateOrderTotal(total) {
    this.setState({ orderTotal: total });
  }

  addToCart(item) {
    const cartItems = [...this.state.cartItems, item];
    this.setState({ cartItems });
  }

  removeFromCart(itemId) {
    const cartItems = this.state.cartItems.filter(item => item.id !== itemId);
    this.setState({ cartItems });
  }

  setCustomerInfo(info) {
    this.setState({ customerInfo: info });
  }

  setInvoiceData(data) {
    this.setState({ invoiceData: data });
  }

  // Clear all state
  clearState() {
    this.state = {
      currentStep: "products",
      selectedProduct: null,
      selectedExtras: [],
      orderTotal: 0,
      cartItems: [],
      customerInfo: null,
      invoiceData: null
    };
    this.notifySubscribers();
  }
}

// Create global appState instance
const appState = new AppState();

