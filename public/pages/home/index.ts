import { state } from '../../state';

class Home extends HTMLElement {
	connectedCallback(): void {
		this.render();
	}
	render(): void {
		this.classList.add('home__container');
		this.innerHTML = `
			<text-comp class='home__title' use='title'>Mascotas perdidas cerca tuyo</text-comp>
			`;

		const currentUser = state.getUserData();
		if (!currentUser.lat && !currentUser.lng) {
			// Si no hay ubicacion seteada en el state o localStorage, se la pido.
			this.innerHTML = `
			<text-comp class='home__text' use='paragraph'>Para ver las mascotas perdidas cerca tuyo, necesitamos permiso de tu ubicación.</text-comp>
			<button-comp class='btn__location' background='pink'>Dar mi ubicación.</button-comp>
			`;
			const location = this.querySelector('.btn__location');
			location?.addEventListener('click', () => {
				this.getCurrentUbication();
			});
		} else if (currentUser.lat && currentUser.lng) {
			// Muestro los pets que hay cerca
			state.getPetsAroundTo(currentUser.lat, currentUser.lng).then((pets) => {
				if (pets.length > 0) {
					pets.forEach((pet) => {
						console.log(pet);
						this.innerHTML += `
								<pet-card id='${pet.objectID}' name='${pet.petName}' img='${pet.img}'></pet-card>
							`;
					});
				} else {
					this.innerHTML = `
							<text-comp use='paragraph'>No hay mascotas perdidas cerca tuyo.</text-comp>

						`;
				}
			});
		}
	}
	getCurrentUbication(): void {
		navigator.geolocation.getCurrentPosition((position) => {
			const lat: number = position.coords.latitude;
			const lng: number = position.coords.longitude;
			state.setUserData({ lat, lng });
			this.render();
		});
	}
	thereIsLocationHTML() {}
}
customElements.define('home-page', Home);
