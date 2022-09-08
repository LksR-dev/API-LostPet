import { state } from '../../state';
import { Router } from '@vaadin/router';
import { initMapMapbox, initSearchFormMapbox } from '../../lib/mapbox';
import { dropzoneUpload } from '../../lib/dropzone';
import * as mapboxgl from 'mapbox-gl';

class EditPet extends HTMLElement {
	petName: string;
	petId: number;
	img: string;
	ubication: string;
	lat;
	lng;
	founded: boolean;
	connectedCallback(): void {
		state.getPetById().then((res) => {
			const pet = res as any;
			this.petName = pet.name;
			this.petId = pet.petId;
			this.img = pet.img;
			this.ubication = pet.ubication;
			this.lat = pet.last_lat;
			this.lng = pet.last_lng;
			this.founded = pet.founded;

			state.setReportPet({
				name: this.petName,
				lat: this.lat,
				lng: this.lng,
				img: this.img,
				id: this.petId,
				founded: this.founded,
				ubication: this.ubication,
			});

			this.render();
		});
	}
	addListeners() {
		//State section
		const cs = state.getState();
		const reportPet = state.getReportPet();
		const redirect = cs.redirect;
		const last_lat = this.lat;
		const last_lng = this.lng;

		//Element section
		const petNameEl = this.querySelector('.petName') as any;
		const dropzoneImg: any = this.querySelector('.dropzone__img');
		const dropzoneBtn: any = this.querySelector('.dropzone__btn');
		const mapboxContainer = this.querySelector('.mapbox__map-container');
		const updateBtnEl = this.querySelector('.btn__update');
		const foundedBtnEl = this.querySelector('.btn__founded');
		const unpublishEl = this.querySelector('.unpublish');

		this.dropzone(dropzoneImg, dropzoneBtn);
		this.mapbox(mapboxContainer, last_lat, last_lng);

		//EventListener section
		updateBtnEl?.addEventListener('click', () => {
			const petName = petNameEl?.querySelector('.input-el').value;
			if (petName) {
				state.setReportPet({ name: petName });
			}
			state.updatePet().then((res) => {
				alert('Tu mascota ha sido actualizada correctamente.');
				redirect != '/' ? Router.go(redirect) : Router.go('/my-pets');
			});
		});

		foundedBtnEl?.addEventListener('click', () => {
			state.setReportPet({ founded: true });
			state.updatePet().then(() => {
				state.deletePet();
				alert('La mascota se ha repotado como encontrada, se despublicará.');
				Router.go('/my-pets');
			});
		});

		unpublishEl?.addEventListener('click', () => {
			state.deletePet().then((res) => {
				alert('La mascota se despublicará.');
				Router.go('/my-pets');
			});
		});
	}

	dropzone(dropzoneImg, dropzoneBtn) {
		let petImage;
		const dropzone = dropzoneUpload(dropzoneImg, dropzoneBtn);
		dropzone.then((dropzone) => {
			dropzone.on('thumbnail', function (file) {
				// usando este evento pueden acceder al dataURL directamente
				dropzoneImg.src = file.dataURL;
				petImage = file.dataURL;
				state.setReportPet({ img: petImage });
			});
		});
	}

	mapbox(mapboxContainer, last_lat, last_lng) {
		const mapboxInputEl = this.querySelector('.mapbox__input-ubication') as any;
		const mapboxBtnEl = this.querySelector('.mapbox__btn-ubication');

		// Ubicación con la que se reportó la mascota
		let currentLat = last_lat;
		let currentLng = last_lng;

		initMapMapbox(mapboxContainer, currentLat, currentLng).then((map) => {
			const markerMap = new mapboxgl.Marker({ draggable: true });
			markerMap.setLngLat([currentLng, currentLat]).addTo(map);

			const { lat, lng } = markerMap.getLngLat();

			mapboxBtnEl?.addEventListener('click', () => {
				const ubicationInput = mapboxInputEl.querySelector('.input-el').value;
				state.setReportPet({ ubication: ubicationInput });

				if (!ubicationInput) {
					alert('Ingrese una ubicación válida.');
				} else {
					initSearchFormMapbox(ubicationInput, (resp) => {
						const firstResp = resp[0];
						const [lng, lat] = firstResp.geometry.coordinates;

						markerMap.setLngLat([lng, lat]).addTo(map);
						map.setCenter([lng, lat]);
						map.setZoom(14);
						state.setReportPet({ lng, lat });
					});
				}
			});
			markerMap.on('dragend', () => {
				const { lng, lat } = markerMap.getLngLat();
				state.setReportPet({ lng, lat });
			});
		});
	}

	render(): void {
		this.classList.add('report__container');
		this.innerHTML = `
			<text-comp use='title'>Editar mascota perdida</text-comp>
      <input-comp class='petName' value='${this.petName}' name='nombre' type='text' placeholder='salchipapa' labelText='Nombre'></input-comp>
      
      <div class='dropzone__img-container'>
        <img class='dropzone__img' src='${this.img}' crossorigin='anonymous'>
      </div>
      <button-comp class='dropzone__btn' background='green'>agregar/modificar foto</button-comp>
      
      <div class='mapbox__map-container'></div>
      <input-comp class='mapbox__input-ubication' value='${this.ubication}' name='ubication' type='text' placeholder='Obelisco' labelText='Ubicacion'></input-comp>
      <button-comp class='mapbox__btn-ubication' background='pink'>Buscar</button-comp>
      
			<text-comp class='help__mapbox-text' use='paragraph'>Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad. Luego, de ser necesario, arrastra el marker para mayor exactitud.</text-comp>
      
			<button-comp class='btn__update' background='pink'>Guardar</button-comp>
      <button-comp	button-comp class='btn__founded' background='green'>Reportar como encontrado</button-comp>

			<text-comp class='unpublish' use='unpublish'>Despublicar</text-comp>
      `;

		this.addListeners();
	}
}
customElements.define('edit-pet', EditPet);
