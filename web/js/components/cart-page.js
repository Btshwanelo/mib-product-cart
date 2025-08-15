// Cart Page Component
class CartPage extends HTMLElement {
  connectedCallback() {
    this.render();
    appState.subscribe(() => this.render());
  }

  goToExtras() {
    app.showPage("extras");
  }

  proceedToCheckout() {
    appState.setState({ currentStep: "invoice" });
    app.showPage("invoice");
  }

  render() {
    const product = appState.selectedProduct;
    if (!product) {
      this.innerHTML = '<div class="main-content">No product selected</div>';
      return;
    }

    appState.calculateTotal();

    this.innerHTML = `
            <div class="main-content">
                <div style="display: grid; grid-template-columns: 1fr 400px; gap: 48px;">
                    <div>
                        <div style="text-align: center; margin-bottom: 32px;">
                            ${
                              product.url
                                ? `
                                <img src="${product.url}" alt="${product.productGroupName}" 
                                     style="max-width: 600px; width: 100%; height: 400px; object-fit: cover; border-radius: 8px;">
                            `
                                : `
                                <div style="
                                    width: 100%; max-width: 600px; height: 400px; background: #f4f4f4; 
                                    border-radius: 8px; display: flex; align-items: center; 
                                    justify-content: center; font-size: 72px; margin: 0 auto;
                                ">📦</div>
                            `
                            }
                        </div>
                        
                        <div style="color: #6b7280; font-size: 16px; line-height: 1.6; max-width: 600px;">
                            ${
                              product.benefits
                                ? `
                                <h4 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 16px;">Benefits</h4>
                                <p>${product.benefits}</p>
                            `
                                : "Premium funeral package with comprehensive services."
                            }
                        </div>
                    </div>
                    
                    <div style="background: #f9fafb; border-radius: 12px; padding: 24px; height: fit-content;">
                        <div style="font-size: 16px; color: #6b7280; margin-bottom: 8px;">Order Details</div>
                        <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px;">
                            ${product.productGroupName}
                        </h2>
                        <div style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 24px;">
                            R${product.price.toLocaleString()}
                        </div>
                        
                        ${
                          appState.selectedExtras.length > 0
                            ? `
                            <div style="margin-bottom: 16px;">
                                <h4 style="font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 8px;">Extras</h4>
                                ${appState.selectedExtras
                                  .map(
                                    (extra) => `
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                        <span style="font-size: 12px; color: #6b7280;">${
                                          extra.name
                                        } (x${extra.quantity})</span>
                                        <span style="font-size: 12px; color: #111827;">R${(
                                          extra.costPrice * extra.quantity
                                        ).toLocaleString()}</span>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                        `
                            : ""
                        }
                        
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-bottom: 24px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-size: 16px; color: #111827; font-weight: 600;">Order Total</span>
                                <span style="font-size: 18px; font-weight: 700; color: #111827;">
                                    R${appState.orderTotal.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        
                        <button class="btn-secondary" style="width: 100%; margin-bottom: 12px;"
                                onclick="document.querySelector('cart-page').goToExtras()">
                            Customize
                        </button>
                        <button class="btn-primary" style="width: 100%;"
                                onclick="document.querySelector('cart-page').proceedToCheckout()">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        `;
  }
}

customElements.define("cart-page", CartPage);
