import { Router } from '@vaadin/router';
import { state } from '../../state';

class VerifyEmail extends HTMLElement {
	connectedCallback() {
		this.render();
	}
	addListeners() {
		const emailEl = this.querySelector('.input__label') as any;
		const btn = this.querySelector('.btn__verify-email');

		btn?.addEventListener('click', async () => {
			const email = emailEl?.querySelector('.input-el').value;
			if (email) {
				const authEmail = await state.authEmail(email);
				if (authEmail) {
					this.render();
					this.innerHTML = `
						<input-comp class='input__label' name='password' type='password' placeholder='··············' labelText='Contraseña'></input-comp>
						<button-comp class='btn__verify-password' background='pink'>Ingresar</button-comp>
						`;
					const passwordEl = this.querySelector('.input__label') as any;
					const btn = this.querySelector('.btn__verify-password');
					const redirectURL = state.getState().redirect;

					btn?.addEventListener('click', async () => {
						const password = passwordEl?.querySelector('.input-el').value;
						const auth = await state.getToken(password, email);
						if (auth) {
							Router.go(redirectURL);
						}
					});
				} else {
					Router.go('/my-data');
				}
			}
		});
	}
	render() {
		this.classList.add('verify__container');
		this.innerHTML = `
      <text-comp use='title'>Ingresar</text-comp>
      <input-comp class='input__label' name='email' type='text' placeholder='email@email.com' labelText='Email'></input-comp>

			<button-comp class='btn__verify-email' background='pink'>Siguiente</button-comp>
    `;

		this.addListeners();
	}
}

customElements.define('verify-email', VerifyEmail);
