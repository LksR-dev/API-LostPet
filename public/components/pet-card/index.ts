import { Router } from '@vaadin/router';
import { state } from '../../state';

const pencil = require(`../../assets/pencil.svg`);

class PetCard extends HTMLElement {
	shadow: ShadowRoot;

	connectedCallback() {
		this.render();
	}
	render(): void {
		this.shadow = this.attachShadow({ mode: 'open' });
		const petId = this.getAttribute('id');
		const img = this.getAttribute('img');
		const petName = this.getAttribute('name');
		const lat = this.getAttribute('lat');
		const lng = this.getAttribute('lng');
		const ubication = this.getAttribute('ubication');
		const style = document.createElement('style');

		style.innerHTML = `
      .card__container {
        height: 300px;
        width: 335px;
        border: 1px solid #000;
        margin: 20px 0px;
      }
			.card__container-top {
        height: 180px;
        widht: 100%;
      }
			.card__img {
				width: 100%;
				height: 100%;
			}
      .card__container-bot {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 87px;
				gap: 50px;
      }
			.edit__icon {
				cursor: pointer;
			}
			.text__ubication {
				margin-top: 10px;
			}
    `;

		this.shadow.innerHTML = `
      <div class='card__container' petId='${petId}'>

        <div class='card__container-top'>
          <img class='card__img' src='${img}'>
        </div>

        <div class='card__container-bot'>
					<div class='text__container'>	
          	<text-comp use='title' class='petname'>${petName?.toUpperCase()}</text-comp>
						<div class='text__ubication'>
          		<text-comp use='paragraph' class='petname'>Ubicación: ${ubication?.toUpperCase()}</text-comp>
						</div>
					</div>
          ${this.reportOrEdit()}
        </div>
      </div>
    `;
		const edit = this.shadow.querySelector('.edit__icon');
		const report = this.shadow.querySelector('.report');
		const userToken = state.getUserData().token;

		edit?.addEventListener('click', () => {
			if (userToken) {
				state.setEditStatus(true);
				state.setReportPet({ id: petId });
				Router.go('/edit-pet');
			} else {
				state.setEditStatus(true);
				state.setReportPet({ id: petId });
				state.setRedirectURL('/report');
				Router.go('/verify-email');
			}
		});

		report?.addEventListener('click', () => {
			if (userToken) {
				state.setReportPet({ id: petId, name: petName });
				Router.go('/report-info');
			} else {
				state.setReportPet({ id: petId, name: petName });
				state.setRedirectURL('/report-info');
				Router.go('/verify-email');
			}
		});
		this.shadow.append(style);
	}
	reportOrEdit() {
		const path = window.location.pathname;
		if (path === '/') {
			return (this.innerHTML = `
        <text-comp class='report' use='report'>REPORTAR MASCOTA</text-comp>
      `);
		}
		if (path === '/my-pets') {
			return (this.innerHTML = `
        <img class='edit__icon' src='${pencil}' alt='Edit'>
      `);
		}
	}
}
customElements.define('pet-card', PetCard);
