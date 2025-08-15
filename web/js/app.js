// Main App Controller
class App {
  constructor() {
    this.currentPage = "products";
    this.pageHistory = ["products"];
  }

  init() {
    this.showPage("products");
    appState.setState({
      currentStep: "products",
      selectedProduct: null,
      selectedExtras: [],
      orderTotal: 0,
    });
  }

  showPage(pageId) {
    const mainContent = document.getElementById("main-content");

    // Clear current content
    mainContent.innerHTML = "";

    // Create and append new page component
    let pageComponent;
    switch (pageId) {
      case "products":
        pageComponent = document.createElement("products-page");
        break;
      case "cart":
        pageComponent = document.createElement("cart-page");
        break;
      case "extras":
        pageComponent = document.createElement("extras-page");
        break;
      case "invoice":
        pageComponent = document.createElement("invoice-page");
        break;
      case "success":
        pageComponent = document.createElement("success-page");
        break;
      default:
        pageComponent = document.createElement("products-page");
    }

    mainContent.appendChild(pageComponent);

    // Update page history
    if (this.currentPage !== pageId) {
      this.pageHistory.push(pageId);
    }
    this.currentPage = pageId;
  }

  goBack() {
    if (this.pageHistory.length > 1) {
      this.pageHistory.pop(); // Remove current page
      const previousPage = this.pageHistory[this.pageHistory.length - 1];

      // Update app state based on previous page
      let step = "products";
      if (previousPage === "cart") step = "cart";
      else if (previousPage === "invoice") step = "invoice";

      appState.setState({ currentStep: step });
      this.showPage(previousPage);
    }
  }

  save() {
    // Save current state to localStorage for persistence
    const stateToSave = {
      selectedProduct: appState.selectedProduct,
      selectedExtras: appState.selectedExtras,
      currentStep: appState.currentStep,
      orderTotal: appState.orderTotal,
    };

    try {
      localStorage.setItem("ezra_funeral_state", JSON.stringify(stateToSave));
      window.showNotification("Progress saved successfully!", "success");
    } catch (error) {
      console.error("Failed to save state:", error);
      window.showNotification("Failed to save progress.", "error");
    }
  }

  loadSavedState() {
    try {
      const savedState = localStorage.getItem("ezra_funeral_state");
      if (savedState) {
        const state = JSON.parse(savedState);
        appState.setState(state);

        // Navigate to the saved step
        if (state.currentStep && state.currentStep !== "products") {
          this.showPage(state.currentStep);
        }
      }
    } catch (error) {
      console.error("Failed to load saved state:", error);
    }
  }
}

// Utility functions
window.showNotification = function (message, type = "info") {
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

  switch (type) {
    case "success":
      notification.style.background = "#10b981";
      break;
    case "error":
      notification.style.background = "#dc2626";
      break;
    case "warning":
      notification.style.background = "#f59e0b";
      break;
    default:
      notification.style.background = "#0086C9";
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
};

// Initialize App
const app = new App();

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  app.loadSavedState(); // Load any saved state first
  app.init();
});

// Keyboard navigation support
document.addEventListener("keydown", function (e) {
  // ESC key to go back
  if (e.key === "Escape") {
    app.goBack();
  }

  // Ctrl+S to save
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    app.save();
  }
});
