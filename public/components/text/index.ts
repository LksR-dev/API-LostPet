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
          color: #00000;
          line-height: 36px;
          text-align: center;          
          cursor: pointer;
        }
      `;
		}
		if (use === 'paragraph') {
			style.innerHTML = `
        .text {
          font-size: 18px;
          font-weight: 400;
          color: #00000;
          line-height: 24px;
          text-align: center;          
        }
      `;
		}
		this.shadow.appendChild(divEl);
		this.shadow.appendChild(style);
	}
}
customElements.define('text-comp', TextComp);
