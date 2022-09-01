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

		if (use === 'link') {
			style.innerHTML = `
        .text {
          font-size: 24px;
          font-weight: 700;
          line-height: 36px;
          cursor: pointer;
					color: #00000;
					text-align: center;
        }
      `;
		}
		if (use === 'paragraph') {
			style.innerHTML = `
        .text {
          font-size: 18px;
          font-weight: 400;
          line-height: 24px;
					color: #00000;
					text-align: center;      

        }
      `;
		}
		if (use === 'title') {
			style.innerHTML = `
        .text {
          font-size: 24px;
          font-weight: 700;
          line-height: 24px;
					color: #00000;
					text-align: center;      

        }
      `;
		}
		if (use === 'report') {
			style.innerHTML = `
        .text {
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
					color: #3E91DD;
					text-align: center;
        }
      `;
		}
		this.shadow.appendChild(divEl);
		this.shadow.appendChild(style);
	}
}
customElements.define('text-comp', TextComp);
