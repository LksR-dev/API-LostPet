import { Router } from '@vaadin/router';
import { state } from '../../state';
const logo = require('../../assets/logo.svg');

class Header extends HTMLElement {
	connectedCallback() {
		const currentUser = state.getUserData();
		state.suscribe(() => {
			if (currentUser.token) {
				this.render();
			}
		});
		this.render();
	}
	render() {
		const currentUser = state.getUserData();
		const session = () => {
			if (currentUser.email) {
				return (this.innerHTML = `
          <div class='menu__session-container'>
            <text-comp>${currentUser.email}</text-comp>
            <text-comp class='close__session' use='link'>Cerrar sesión</text-comp>
            </div>
            `);
			} else {
				return `<div></div>`;
			}
		};

		this.innerHTML = `
      <header class='header'>
      <img class='logo' src='${logo}'>
          
        <div class="btn">
        <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
      </header>

      <div class='menu'>
        <div class='menu__text-container'>
          <text-comp class='my__data' use='link'>Mis datos</text-comp>
          <text-comp class='my__pets' use='link'>Mis mascotas reportadas</text-comp>
          <text-comp class='report' use='link'>Reportar mascota</text-comp>
        </div>

        ${session()}
      </div>
    `;

		//Menu
		const btnHamburguer = this.querySelector('.btn');
		const menuToggle = this.querySelector('.menu');
		btnHamburguer?.addEventListener('click', () => {
			menuToggle?.classList.toggle('active');
		});

		//Redirect
		const homeLogo = this.querySelector('.logo');
		const myData = this.querySelector('.my__data');
		const myPets = this.querySelector('.my__pets');
		const report = this.querySelector('.report');
		const closeSession = this.querySelector('.close__session');

		homeLogo?.addEventListener('click', () => {
			menuToggle?.classList.remove('active');
			Router.go('/');
		});

		myData?.addEventListener('click', () => {
			menuToggle?.classList.remove('active');
			if (currentUser.token) {
				Router.go('/my-data');
			} else {
				state.setRedirectURL('/my-data');
				Router.go('/verify-email');
			}
		});
		myPets?.addEventListener('click', () => {
			menuToggle?.classList.remove('active');
			if (currentUser.token) {
				Router.go('/my-pets');
			} else {
				state.setRedirectURL('/my-pets');
				Router.go('/verify-email');
			}
		});
		report?.addEventListener('click', () => {
			menuToggle?.classList.remove('active');
			state.setEditStatus(false);
			if (currentUser.token) {
				Router.go('/report');
			} else {
				state.setRedirectURL('/report');
				Router.go('/verify-email');
			}
		});
		closeSession?.addEventListener('click', () => {
			menuToggle?.classList.remove('active');
			state.clearLocalStorage();
			state.setState({ user: {} });
			Router.go('/');
		});
	}
}
customElements.define('header-comp', Header);
