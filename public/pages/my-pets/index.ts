import { state } from '../../state';

class MyPets extends HTMLElement {
	connectedCallback(): void {
		this.render();
	}
	render(): void {
		this.classList.add('home__container');
		this.innerHTML = `
			<text-comp class='home__title' use='title'>Mis mascotas reportadas</text-comp>
			`;

		const currentUser = state.getUserData();
		state.getMyPets().then((pets) => {
			if (pets.length > 0) {
				pets.forEach((pet) => {
					this.innerHTML += `
						<pet-card id='${pet.id}' ubication='${pet.ubication}' lat='${pet.last_lat}' lng='${pet.last_lng}' name='${pet.name}' img='${pet.img}'></pet-card>
					`;
				});
			} else {
				this.innerHTML = `
					<text-comp use='title'>No tienes mascotas reportadas</text-comp>
				`;
			}
		});
	}
}
customElements.define('my-pets', MyPets);
