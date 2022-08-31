class TextComp extends HTMLElement {
	shadow: ShadowRoot;
	constructor() {
		super();
		this.render();
	}
	render() {
		this.shadow = this.attachShadow({ mode: 'open' });
		const style = document.createElement('style');
		const divEl = document.createElement('div') as any;
		const use: string = this.getAttribute('use') || 'default';
		divEl.classList.add('text');

		divEl.innerHTML = this.textContent;

		style.innerHTML = `
			color: #00000;
			text-align: center;          
		`;

		if (use === 'link') {
			style.innerHTML = `
        .text {
          font-size: 24px;
          font-weight: 700;
          line-height: 36px;
          cursor: pointer;
        }
      `;
		}
		if (use === 'paragraph') {
			style.innerHTML = `
        .text {
          font-size: 18px;
          font-weight: 400;
          line-height: 24px;
					margin: 20px 0px;
        }
      `;
		}
		if (use === 'title') {
			style.innerHTML = `
        .text {
          font-size: 24px;
          font-weight: 700;
          line-height: 24px;
        }
      `;
		}
		this.shadow.appendChild(divEl);
		this.shadow.appendChild(style);
	}
}
customElements.define('text-comp', TextComp);
