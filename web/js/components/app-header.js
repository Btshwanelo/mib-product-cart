// App Header Component
class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1e9cfa 0%, #0ea5e9 100%);
                color: white;
                padding: 12px 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            ">
                <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 16px;">
                    <span>Ezra</span>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="
                        width: 32px; height: 32px; background: white; border-radius: 50%; 
                        color: black; display: flex; align-items: center; justify-content: center; 
                        font-weight: 600; font-size: 14px; cursor: pointer;
                    ">MM</div>
                </div>
            </div>
        `;
  }
}

customElements.define("app-header", AppHeader);
