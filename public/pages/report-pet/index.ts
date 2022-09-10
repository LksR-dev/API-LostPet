import { state } from '../../state';
import { Router } from '@vaadin/router';
import { initMapMapbox, initSearchFormMapbox } from '../../lib/mapbox';
import { dropzoneUpload } from '../../lib/dropzone';
import * as mapboxgl from 'mapbox-gl';
let defaultReportImg = require('../../assets/default-report.svg');

class ReportPet extends HTMLElement {
	connectedCallback(): void {
		this.render();
	}
	addListeners() {
		//State section
		const cs = state.getState();
		const redirect = cs.redirect;
		const reportPet = state.getReportPet();
		const userData = state.getUserData();
		const userLng = userData.lng;
		const userLat = userData.lat;

		//Element section
		const petNameEl = this.querySelector('.petName') as any;
		const dropzoneImg: any = this.querySelector('.dropzone__img');
		const dropzoneBtn: any = this.querySelector('.dropzone__btn');
		const mapboxContainer = this.querySelector('.mapbox__map-container');
		const mapboxUbicationEl = this.querySelector('.mapbox__input-ubication') as any;
		const btnSaveEl = this.querySelector('.btn__save-data');
		const btnCancelEl = this.querySelector('.btn__cancel');

		this.dropzone(dropzoneImg, dropzoneBtn);
		this.mapbox(userLat, userLng, mapboxContainer);

		//EventListener section
		btnSaveEl?.addEventListener('click', () => {
			const mapboxUbication = mapboxUbicationEl?.querySelector('.input-el').value;
			const petName = petNameEl?.querySelector('.input-el').value;
			if (petName) {
				state.setReportPet({ name: petName, ubication: mapboxUbication });
			}
			if (
				reportPet.petName &&
				reportPet.img &&
				reportPet.lat &&
				reportPet.lng &&
				reportPet.ubication
			) {
				state.addPet().then((resp) => {
					if (resp) {
						alert('Tu mascota ha sido reportada correctamente.');
						redirect !== '/' ? Router.go(redirect) : Router.go('/my-pets');
					} else {
						alert(
							'Hubo un problema para reportar la mascota, es posible que la imagen sea demasiado grande.',
						);
					}
				});
			} else {
				alert('Debe completar todos los campos.');
			}
		});

		btnCancelEl?.addEventListener('click', () => {
			Router.go('/');
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

	mapbox(userLat, userLng, mapboxContainer) {
		const mapboxInputEl = this.querySelector('.mapbox__input-ubication') as any;
		const mapboxBtnEl = this.querySelector('.mapbox__btn-ubication');

		// Ubicacion por defecto: Buenos Aires, Argentina.
		let defaultLat = -34.6037388;
		let defaultLng = -58.3857976;
		let currentLat, currentLng;

		if (userLat && userLng) {
			currentLat = userLat;
			currentLng = userLng;
		} else {
			currentLat = defaultLat;
			currentLng = defaultLng;
		}

		initMapMapbox(mapboxContainer, currentLat, currentLng).then((map) => {
			const markerMap = new mapboxgl.Marker({ draggable: true });
			markerMap.setLngLat([currentLng, currentLat]).addTo(map);

			const { lat, lng } = markerMap.getLngLat();

			mapboxBtnEl?.addEventListener('click', () => {
				const ubicationInput = mapboxInputEl.querySelector('.input-el').value;

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
			<text-comp use='title'>Reportar mascota perdida</text-comp>
      <input-comp class='petName' value='' name='nombre' type='text' placeholder='salchipapa' labelText='Nombre'></input-comp>
      
      <div class='dropzone__img-container'>
        <img class='dropzone__img' src='${defaultReportImg}' crossorigin='anonymous'>
      </div>
      <button-comp class='dropzone__btn' background='green'>agregar/modificar foto</button-comp>
      
      <div class='mapbox__map-container'></div>
      <input-comp class='mapbox__input-ubication' name='ubication' type='text' placeholder='Obelisco' labelText='Ubicacion'></input-comp>
      <button-comp class='mapbox__btn-ubication' background='pink'>Buscar</button-comp>
      
			<text-comp class='help__mapbox-text' use='paragraph'>Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad. Luego, de ser necesario, arrastra el marker para mayor exactitud.</text-comp>

			<button-comp class='btn__save-data' background='pink'>Reportar como perdido</button-comp>
      <button-comp	button-comp class='btn__cancel' background='gray'>Cancelar</button-comp>
      `;

		this.addListeners();
	}
}
customElements.define('report-pet', ReportPet);
