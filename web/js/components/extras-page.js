// Extras Page Component
class ExtrasPage extends HTMLElement {
  constructor() {
    super();
    this.extras = [];
    this.loading = false;
  }

  async connectedCallback() {
    await this.loadExtras();
    this.render();
  }

  async loadExtras() {
    this.loading = true;
    this.render();

    try {
      const response = await ApiService.getExtras();
      if (response.isSuccess) {
        this.extras = response.outputParameters.ProductData || [];
        // Initialize quantities for selected extras
        this.extras.forEach((extra) => {
          const existing = appState.selectedExtras.find(
            (e) => e.name === extra.name
          );
          extra.quantity = existing ? existing.quantity : 0;
          extra.selected = existing ? true : false;
        });
      }
    } catch (error) {
      console.error("Failed to load extras:", error);
    } finally {
      this.loading = false;
      this.render();
    }
  }

  toggleExtra(extraName) {
    const extra = this.extras.find((e) => e.name === extraName);
    if (!extra) return;

    extra.selected = !extra.selected;
    if (extra.selected && extra.quantity === 0) {
      extra.quantity = 1;
    } else if (!extra.selected) {
      extra.quantity = 0;
    }
    this.updateSelectedExtras();
    this.render();
  }

  updateQuantity(extraName, change) {
    const extra = this.extras.find((e) => e.name === extraName);
    if (!extra) return;

    const newQuantity = Math.max(0, extra.quantity + change);
    extra.quantity = newQuantity;
    extra.selected = newQuantity > 0;
    this.updateSelectedExtras();
    this.render();
  }

  updateSelectedExtras() {
    const selectedExtras = this.extras.filter(
      (extra) => extra.selected && extra.quantity > 0
    );
    appState.setState({ selectedExtras });
  }

  done() {
    appState.setState({ currentStep: "cart" });
    app.showPage("cart");
  }

  render() {
    if (this.loading) {
      this.innerHTML = `
                <div class="main-content">
                    <div style="text-align: center; padding: 48px;">
                        <div class="loading-spinner"></div>
                        <div>Loading extras...</div>
                    </div>
                </div>
            `;
      return;
    }

    appState.calculateTotal();

    this.innerHTML = `
            <div class="main-content">
                <div style="display: grid; grid-template-columns: 1fr 484px; gap: 48px;">
                    <div>
                        <h1 style="font-size: 30px; font-weight: 700; color: #1a1a1a; margin-bottom: 30px;">
                            Extras you may want
                        </h1>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                            ${this.extras
                              .map(
                                (extra) => `
                                <div style="
                                    display: flex; align-items: flex-start; justify-content: space-between; 
                                    padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; 
                                    cursor: pointer; transition: all 0.2s ease; width: 250px;
                                    ${
                                      extra.selected
                                        ? "border-color: #1e9cfa; background: #f0f9ff;"
                                        : ""
                                    }
                                " class="upgrade-option">
                                    
                                    <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%;">
                                        <div style="
                                            width: 18px; height: 18px; border: 2px solid #d1d5db; 
                                            border-radius: 40px; cursor: pointer; position: relative;
                                            align-self: flex-start;
                                            ${
                                              extra.selected
                                                ? "background: #1e9cfa; border-color: #1e9cfa;"
                                                : ""
                                            }
                                        " onclick="document.querySelector('extras-page').toggleExtra('${
                                          extra.name
                                        }')">
                                            ${
                                              extra.selected
                                                ? '<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 12px; font-weight: bold;">✓</span>'
                                                : ""
                                            }
                                        </div>
                                        
                                        ${
                                          extra.url
                                            ? `
                                            <img src="${extra.url}" alt="${extra.name}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;">
                                        `
                                            : `
                                            <div style="width: 100px; height: 60px; background: #f4f4f4; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📦</div>
                                        `
                                        }
                                        
                                        <div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%;">
                                            <div style="font-size: 20px; font-weight: 600; color: #1A1A1A; margin-bottom: 10px;">
                                                ${extra.name}
                                            </div>
                                            <div style="font-size: 18px; color: #1A1A1A;">
                                                R${extra.costPrice.toLocaleString()}
                                            </div>
                                        </div>
                                        
                                        <div style="display: flex; width: 50%; height: 30px;">
                                            <button style="
                                                display: flex; padding: 3px 7px; justify-content: center; 
                                                align-items: center; cursor: pointer; flex: 1; 
                                                border-radius: 10px 0px 0px 10px; border: 1px solid #e4e7ec; 
                                                background: #fff; font-weight: bold;
                                            " onclick="document.querySelector('extras-page').updateQuantity('${
                                              extra.name
                                            }', -1)">-</button>
                                            
                                            <div style="
                                                border-top: 1px solid #e4e7ec; border-bottom: 1px solid #e4e7ec; 
                                                background: white; width: 32px; height: 30px; display: flex; 
                                                justify-content: center; align-items: center;
                                            ">${extra.quantity || 0}</div>
                                            
                                            <button style="
                                                display: flex; padding: 3px 7px; justify-content: center; 
                                                align-items: center; cursor: pointer; flex: 1; 
                                                border-radius: 0px 10px 10px 0px; border: 1px solid #e4e7ec; 
                                                background: #fff; font-weight: bold;
                                            " onclick="document.querySelector('extras-page').updateQuantity('${
                                              extra.name
                                            }', 1)">+</button>
                                        </div>
                                    </div>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                    
                    <div style="
                        background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; 
                        padding: 60px 60px 30px 60px; height: fit-content;
                    ">
                        <div style="display: flex; flex-direction: column; gap: 24px;">
                            <h1 style="font-size: 16px; font-weight: 600; color: #101828; border-top: 1px solid #E4E7EC; padding-top: 10px;">
                                Order Summary
                            </h1>
                            <h2 style="font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 3px;">
                                ${
                                  appState.selectedProduct
                                    ? appState.selectedProduct.productGroupName
                                    : "No Product Selected"
                                }
                            </h2>
                            <div style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 3px;">
                                R${
                                  appState.selectedProduct
                                    ? appState.selectedProduct.price.toLocaleString()
                                    : "0"
                                }
                            </div>
                            
                            <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-bottom: 10px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                    <span style="font-size: 16px; color: #111827; font-weight: 600;">Order Total</span>
                                    <span style="font-size: 18px; font-weight: 700; color: #111827;">
                                        R${appState.orderTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            
                            <button class="btn-primary" style="
                                padding: 10px; font-size: 14px; font-weight: 1000; 
                                width: 100%; height: 60px; border-radius: 8px;
                            " onclick="document.querySelector('extras-page').done()">
                                DONE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }
}

customElements.define("extras-page", ExtrasPage);
