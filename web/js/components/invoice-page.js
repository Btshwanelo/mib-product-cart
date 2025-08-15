// Invoice Page Component
class InvoicePage extends HTMLElement {
  constructor() {
    super();
    this.submitting = false;
  }

  connectedCallback() {
    this.render();
    appState.subscribe(() => this.render());
  }

  async completeOrder() {
    if (this.submitting || !appState.selectedProduct) return;

    this.submitting = true;
    this.render();

    try {
      // Prepare order data
      const productData = {
        ProductGroupData: [
          {
            productGroupId: appState.selectedProduct.productGroupId,
            productGroupName: appState.selectedProduct.productGroupName,
            price: appState.selectedProduct.price,
          },
        ],
        ProductData: appState.selectedExtras.map((extra) => ({
          name: extra.name,
          costPrice: extra.costPrice,
          Quantity: extra.quantity,
        })),
        BenefitData: appState.selectedProduct.benefits
          ? appState.selectedProduct.benefits.split(", ").map((benefit) => ({
              BenefitName: benefit.trim(),
            }))
          : [],
      };

      const response = await ApiService.submitOrder(productData);

      if (response.isSuccess) {
        window.showNotification("Order submitted successfully!", "success");
        app.showPage("success");
      } else {
        window.showNotification(
          "Failed to submit order. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Failed to submit order:", error);
      window.showNotification(
        "Failed to submit order. Please try again.",
        "error"
      );
    } finally {
      this.submitting = false;
      this.render();
    }
  }

  render() {
    if (!appState.selectedProduct) {
      this.innerHTML = '<div class="main-content">No product selected</div>';
      return;
    }

    appState.calculateTotal();

    this.innerHTML = `
            <div style="max-width: 1280px; margin: 0 auto; padding: 32px 24px; background: white;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="font-size: 32px; font-weight: 700; color: #111827; margin-bottom: 8px;">
                        Invoice
                    </h1>
                </div>

                <div style="border-radius: 12px; padding: 32px; max-width: 600px; margin: 0 auto;">
                    <div style="margin-bottom: 32px;">
                        <div style="font-size: 16px; color: #6b7280; font-weight: 500; margin-bottom: 16px;">
                            Order Summary
                        </div>
                        <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px;">
                            ${appState.selectedProduct.productGroupName}
                        </h2>
                        <div style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 24px;">
                            R${appState.selectedProduct.price.toLocaleString()}
                        </div>
                    </div>

                    ${
                      appState.selectedExtras.length > 0
                        ? `
                        <div style="margin-bottom: 32px;">
                            <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 16px;">
                                Extras
                            </h3>
                            <ul style="list-style: none; padding: 0;">
                                ${appState.selectedExtras
                                  .map(
                                    (extra) => `
                                    <li style="
                                        display: flex; justify-content: space-between; align-items: center; 
                                        padding: 8px 0; border-bottom: 1px solid #f3f4f6;
                                    ">
                                        <span style="font-size: 14px; color: #374151;">
                                            ${extra.name} (Qty: ${
                                      extra.quantity
                                    })
                                        </span>
                                        <span style="font-size: 14px; font-weight: 600; color: #111827;">
                                            R${(
                                              extra.costPrice * extra.quantity
                                            ).toLocaleString()}
                                        </span>
                                    </li>
                                `
                                  )
                                  .join("")}
                            </ul>
                        </div>
                    `
                        : ""
                    }

                    <div style="border-top: 2px solid #e5e7eb; padding-top: 16px; margin-bottom: 32px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                            <span style="font-size: 18px; font-weight: 600; color: #111827;">Order Total</span>
                            <span style="font-size: 24px; font-weight: 700; color: #111827;">
                                R${appState.orderTotal.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: right; margin-bottom: 32px;">
                        <button class="btn-primary" style="
                            padding: 12px 32px; font-size: 16px; font-weight: 600;
                            ${
                              this.submitting
                                ? "opacity: 0.6; pointer-events: none;"
                                : ""
                            }
                        " onclick="document.querySelector('invoice-page').completeOrder()">
                            ${
                              this.submitting
                                ? "Processing..."
                                : "Complete Order"
                            }
                        </button>
                    </div>

                    ${
                      appState.selectedProduct.benefits
                        ? `
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
                            <h4 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 16px;">
                                Benefits
                            </h4>
                            <ul style="list-style: none; padding: 0;">
                                ${appState.selectedProduct.benefits
                                  .split(", ")
                                  .map(
                                    (benefit) => `
                                    <li style="
                                        display: flex; justify-content: space-between; align-items: center; 
                                        padding: 8px 0;
                                    ">
                                        <span style="font-size: 14px; color: #374151;">${benefit.trim()}</span>
                                        <span style="font-size: 14px; color: #6b7280;">Included</span>
                                    </li>
                                `
                                  )
                                  .join("")}
                            </ul>
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>
        `;
  }
}

customElements.define("invoice-page", InvoicePage);
