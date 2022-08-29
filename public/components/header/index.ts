import { Router } from '@vaadin/router';
import { state } from '../../state';
const logo = require('../../assets/logo.svg');

class Header extends HTMLElement {
	connectedCallback() {
		this.render();
	}
	render() {
		const currentUser = state.getUserData();
		const session = () => {
			if (currentUser.email) {
				this.innerHTML = `
          <div class='menu__session-container'>
            <text-comp use='link'>prueba</text-comp>
            <text-comp use='link'>cerrar sesion</text-comp>
            </div>
            `;
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
          <text-comp class='my__reports' use='link'>Mis mascotas reportadas</text-comp>
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
		const myReports = this.querySelector('.my__reports');
		const report = this.querySelector('.reports');

		homeLogo?.addEventListener('click', () => {
			menuToggle?.classList.remove('active');
			Router.go('/home');
		});

		myData?.addEventListener('click', () => {
			menuToggle?.classList.remove('active');
			if (currentUser.token) {
				Router.go('/my-data');
			} else {
				Router.go('/auth-email');
			}
		});
		myReports?.addEventListener('click', () => {
			menuToggle?.classList.remove('active');
			if (currentUser.token) {
				Router.go('/my-reports');
			} else {
				Router.go('/auth-email');
			}
		});
		report?.addEventListener('click', () => {
			menuToggle?.classList.remove('active');
			if (currentUser.token) {
				Router.go('/report');
			} else {
				Router.go('/auth-email');
			}
		});
	}
}
customElements.define('header-comp', Header);
