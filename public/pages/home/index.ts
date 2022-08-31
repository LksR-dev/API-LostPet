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
	render(): void {
		this.classList.add('home__container');
		this.innerHTML = `
			<text-comp class='home__title' use='title'>Mascotas perdidas cerca tuyo</text-comp>
			<text-comp class='home__text' use='paragraph'>Para ver las mascotas perdidas cerca tuyo, necesitamos permiso de tu ubicación.</text-comp>

			<button-comp background='pink'>Dar mi ubicación.</button-comp>
			`;
	}
}
customElements.define('home-page', Home);
