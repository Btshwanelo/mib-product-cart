// Products Page Component
class ProductsPage extends HTMLElement {
  constructor() {
    super();
    this.products = [];
    this.loading = false;
  }

  async connectedCallback() {
    await this.loadProducts();
    this.render();
  }

  async loadProducts() {
    this.loading = true;
    this.render();

    try {
      const response = await ApiService.getProducts();
      if (response.isSuccess) {
        this.products = response.outputParameters.ProductGroupData || [];
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      this.loading = false;
      this.render();
    }
  }

  selectProduct(product) {
    appState.setState({
      selectedProduct: product,
      currentStep: "cart",
    });
    app.showPage("cart");
  }

  render() {
    this.innerHTML = `
            <div class="main-content">
                <h1 style="font-size: 30px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">
                    Choose your package
                </h1>
                <p style="font-size: 18px; color: #1a1a1a; margin-bottom: 48px;">
                    Select your package from the list below.
                </p>
                
                ${
                  this.loading
                    ? `
                    <div style="text-align: center; padding: 48px;">
                        <div class="loading-spinner"></div>
                        <div>Loading products...</div>
                    </div>
                `
                    : `
                    <div style="
                        display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                        gap: 24px;
                    ">
                        ${this.products
                          .map(
                            (product) => `
                            <div style="
                                background: white; border: 1px solid #e4e7ec; border-radius: 12px; 
                                padding: 24px; text-align: center; transition: all 0.2s ease; 
                                cursor: pointer;
                            " class="package-card" onmouseover="this.style.borderColor='#1e9cfa'; this.style.boxShadow='0 4px 12px rgba(30, 156, 250, 0.15)'"
                               onmouseout="this.style.borderColor='#e4e7ec'; this.style.boxShadow='none'">
                                
                                ${
                                  product.url
                                    ? `
                                    <div style="margin: 0 auto 24px; background: #f4f4f4; border-radius: 8px; overflow: hidden;">
                                        <img src="${product.url}" alt="${product.productGroupName}" 
                                             style="width: 100%; height: 200px; object-fit: cover;">
                                    </div>
                                `
                                    : `
                                    <div style="
                                        width: 200px; height: 120px; margin: 0 auto 24px; 
                                        background: #f4f4f4; border-radius: 8px; display: flex; 
                                        align-items: center; justify-content: center; font-size: 48px;
                                    ">📦</div>
                                `
                                }
                                
                                <h3 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 8px;">
                                    ${product.productGroupName}
                                </h3>
                                <p style="font-size: 18px; color: #6b7280; margin-bottom: 20px;">
                                    R${product.price.toLocaleString()}
                                </p>
                                
                                <button class="btn-primary" style="width: 100%; margin-bottom: 12px;"
                                        onclick="this.closest('products-page').selectProduct(${JSON.stringify(
                                          product
                                        ).replace(/"/g, "&quot;")})">
                                    Proceed to cart
                                </button>
                                
                                ${
                                  product.benefits
                                    ? `
                                    <div style="margin-top: 16px; text-align: left;">
                                        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">Benefits:</h4>
                                        <p style="font-size: 12px; color: #6b7280;">${product.benefits}</p>
                                    </div>
                                `
                                    : ""
                                }
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                `
                }
            </div>
        `;
  }
}

customElements.define("products-page", ProductsPage);
