// App Footer Component
class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <div class="app-container">
                <div style="
                    background: white; padding: 16px 24px; border-top: 1px solid #e5e7eb; 
                    display: flex; justify-content: space-between; align-items: center; 
                    border-radius: 16px;
                ">
                    <button style="
                        background: none; border: none; color: #6b7280; font-size: 14px; 
                        cursor: pointer; display: flex; align-items: center; gap: 8px; 
                        padding: 8px 16px;
                    " onclick="app.goBack()">
                        ← Back
                    </button>
                    <button class="btn-secondary" onclick="app.save()">
                        Save
                    </button>
                </div>
            </div>
        `;
  }
}

customElements.define("app-footer", AppFooter);
