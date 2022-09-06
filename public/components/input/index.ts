class InputComp extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		this.render();
	}
	render() {
		const input = document.createElement('input') as any;
		const type = this.getAttribute('type');
		const placeholder = this.getAttribute('placeholder');
		const name = this.getAttribute('name');
		const labelText = this.getAttribute('labelText') || ``;
		const value = this.getAttribute('value') || ``;

		this.innerHTML = `
			<label name='${name}' type='${type}'>
				<p class='label__text'>${labelText}:</p>
				<input class='input-el' name='${name}' type='${type}' value='${value}' placeholder='${placeholder}' required>
			</label>
		`;

		input.textContent = this.textContent;
	}
}
customElements.define('input-comp', InputComp);
