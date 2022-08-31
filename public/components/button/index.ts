class Button extends HTMLElement {
	shadow: ShadowRoot;
	connectedCallback() {
		this.shadow = this.attachShadow({ mode: 'open' });
		this.render();
	}

	render(): void {
		this.shadow.innerHTML = `
      <button class="button-comp">${this.textContent}</button>
      `;

		const style = document.createElement('style');

		style.textContent = `
      .button-comp {
        border-radius: 4px;
        width: 335px;
        height: 50px;
        cursor: pointer;
        border: none;
        font-family: Poppins;
        font-weight: bold;
        font-size: 16px;
        color: #000000;
      }`;

		const background = this.getAttribute('background');

		if (background === 'pink') {
			style.textContent += `
        .button-comp {
          background: #FF9DF5;
        }`;
		} else if (background === 'green') {
			style.textContent += `
        .button-comp {
          background: #97EA9F;
        }`;
		} else if (background === 'gray') {
			style.textContent += `
        .button-comp {
          background: #CDCDCD;
        }`;
		}

		this.shadow.appendChild(style);
	}
}
customElements.define('button-comp', Button);
