import { state } from '../../state';

class Home extends HTMLElement {
	connectedCallback() {
		state.suscribe(() => {
			const currentUser = state.getUserData();
			if (currentUser.lat && currentUser.lng) {
				this.render();
			}
		});
		this.render();
	}
	render(): void {}
}
customElements.define('home-page', Home);
