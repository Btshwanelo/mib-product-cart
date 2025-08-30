// Progress Steps Component
class ProgressSteps extends HTMLElement {
  constructor() {
    super();
    this.steps = [
      { id: "products", label: "Choose Package", icon: "📦" },
      { id: "cart", label: "Cart & Customization", icon: "🛒" },
      { id: "invoice", label: "Invoice", icon: "📄" },
    ];
  }

  connectedCallback() {
    this.render();
    appState.subscribe(() => this.render());
    console.log("ProgressSteps component connected",appState);
  }
  render() {
    this.innerHTML = `
            <div class="app-container">
                <div style="
                    background: white; padding: 24px; border-bottom: 1px solid #e5e7eb; 
                    border-radius: 16px;
                ">
                    <div style="
                        display: flex; justify-content: center; align-items: center; 
                        max-width: 600px; margin: 0 auto;
                    ">
                        ${this.steps
                          .map(
                            (step, index) => `
                            <div style="
                                display: flex; flex-direction: column; align-items: center; 
                                text-align: center; flex: 1; position: relative;
                                ${
                                  index < this.steps.length - 1
                                    ? `
                                    ::after {
                                        content: ''; position: absolute; top: 24px; right: -50%; 
                                        width: 100%; height: 2px; background: #e5e7eb; z-index: 1;
                                    }
                                `
                                    : ""
                                }
                            ">
                                <div style="
                                    width: 48px; height: 48px; border-radius: 12px; 
                                    background: ${
                                      appState.currentStep === step.id
                                        ? "#1e9cfa"
                                        : "#fff"
                                    }; 
                                    color: ${
                                      appState.currentStep === step.id
                                        ? "white"
                                        : "#9ca3af"
                                    };
                                    display: flex; align-items: center; justify-content: center; 
                                    margin-bottom: 12px; position: relative; z-index: 2; 
                                    font-size: 20px; border: 1px solid #e4e7ec;
                                ">${step.icon}</div>
                                <div style="
                                    font-size: 14px; font-weight: 500;
                                    color: ${
                                      appState.currentStep === step.id
                                        ? "#344054"
                                        : "#6b7280"
                                    };
                                ">${step.label}</div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        `;
  }
}

customElements.define("progress-steps", ProgressSteps);
