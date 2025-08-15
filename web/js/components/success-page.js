// Success Page Component
class SuccessPage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  goToHome() {
    // Reset app state
    appState.setState({
      currentStep: "products",
      selectedProduct: null,
      selectedExtras: [],
      orderTotal: 0,
    });
    app.showPage("products");
  }

  render() {
    this.innerHTML = `
            <div style="
                background: white; min-height: calc(100vh - 60px); display: flex; 
                align-items: center; justify-content: center; padding: 48px 24px;
            ">
                <div style="text-align: center; max-width: 500px; margin: 0 auto;">
                    <div style="
                        width: 60px; height: 60px; background: #dcfce7; border-radius: 50%; 
                        display: flex; align-items: center; justify-content: center; 
                        margin: 0 auto 20px; position: relative;
                    ">
                        <span style="color: #16a34a; font-size: 36px; font-weight: bold;">✓</span>
                    </div>
                    
                    <h1 style="font-size: 30px; font-weight: 700; color: #101828; margin-bottom: 10px;">
                        Order Completed
                    </h1>
                    
                    <p style="color: #475467; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                        Your order for the <span style="font-weight: 600; color: #111827;">
                            ${
                              appState.selectedProduct
                                ? appState.selectedProduct.productGroupName
                                : "Selected Package"
                            }
                        </span> has been submitted successfully.
                    </p>
                    
                    <button class="btn-primary" style="
                        padding: 14px 32px; font-size: 16px; font-weight: 600; 
                        min-width: 300px;
                    " onclick="document.querySelector('success-page').goToHome()">
                        Back to Home
                    </button>
                </div>
            </div>
        `;
  }
}

customElements.define("success-page", SuccessPage);
