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
		const style = document.createElement('style');

		style.innerHTML = `
      .card__container {
        height: 234px;
        width: 335px;
        border: 1px solid #000;
        margin: 20px 0px;
      }
      .card__container-top {
        height: 147px;
        widht: 100%;
      }
      .card__container-bot {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 87px;
      }
      .petname {
        widht: 50%;
      }
    `;

		this.shadow.innerHTML = `
      <div class='card__container' id='${petId}'>

        <div class='card__container-top'>
          <img class='card__img' src='${img}'>
        </div>

        <div class='card__container-bot'>
          <text-comp use='title' class='petname'>${petName?.toUpperCase()}</text-comp>
          ${this.reportOrEdit()}
        </div>
      </div>
    `;

		const report = this.shadow.querySelector('.report');
		const edit = this.querySelector('.edit__icon');

		report?.addEventListener('click', (e) => {
			e.preventDefault();
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
			this.innerHTML = `
        <img class='edit__icon' src='${pencil}' alt='Edit'>
      `;
		}
	}
}
customElements.define('pet-card', PetCard);
