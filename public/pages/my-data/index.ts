import { Router } from '@vaadin/router';
import { state } from '../../state';

class MyData extends HTMLElement {
	name: string;

	connectedCallback() {
		this.render();
	}

	addListeners() {
		const btn = this.querySelector('.btn__save-data');
		const nameEl = this.querySelector('.name') as any;
		const passwordEl = this.querySelector('.password') as any;
		const passwordRepEl = this.querySelector('.password__repeat') as any;

		btn?.addEventListener('click', async () => {
			const userData = state.getUserData();
			const redirect = state.getState().redirect;
			const name = nameEl?.querySelector('.input-el').value;
			const password = passwordEl?.querySelector('.input-el').value;
			const passwordRep = passwordRepEl?.querySelector('.input-el').value;
			const passwordConfirm = password === passwordRep;

			await this.createUser(
				userData.token,
				password,
				passwordConfirm,
				name,
				userData.email,
				redirect,
			);

			await this.updateUser(userData.token, password, passwordConfirm, name, redirect);

			// //Si las contraseñas coinciden y tenemos un token, vamos a actualizar la data.
			// if (userData.token && password) {
			// 	if (password === passwordRep) {
			// 		state.updateDataUser({ fullName: name, password });
			// 		redirect === '/my-data' ? Router.go('/') : Router.go(redirect);
			// 	} else {
			// 		alert('Las contraseñas no coinciden.')
			// 	}
			// } else if (userData.token) {
			// 	state.updateDataUser({ fullName: name });
			// 	redirect === '/my-data' ? Router.go('/') : Router.go(redirect);
			// }

			// //Si las contraseñas coinciden y no tenemos un token, vamos a crear el usuario.
			// if (!userData.token && password) {
			// 	state.createUser(name, password);
			// 	state.getToken(password, userData.email);
			// 	redirect === '/my-data' ? Router.go('/') : Router.go(redirect);
			// } else {
			// 	alert('Debes colocar una contraseña.');
			// }
		});
	}

	async createUser(
		token: string,
		password: string,
		passwordConfirm: boolean,
		name: string,
		email: string,
		redirect: string,
	) {
		if (!token) {
			if (name && password) {
				if (passwordConfirm) {
					await state.createUser(name, password);
					await state.getToken(password, email);
					redirect === '/my-data' ? Router.go('/') : Router.go(redirect);
				} else {
					alert('Las contraseñas no coinciden');
				}
			} else {
				alert('Debe completar todos los campos.');
			}
		}
	}

	async updateUser(
		token: string,
		password: string,
		passwordConfirm: boolean,
		name: string,
		redirect: string,
	) {
		if (token && password) {
			if (passwordConfirm) {
				await state.updateDataUser({ fullName: name, password });
			} else {
				alert('Las contraseñas no coinciden.');
			}
		}
		if (token && name && !password) {
			await state.updateDataUser({ fullName: name });
			const user = (await state.getUser()) as any;
			state.setUserData({ fullName: user.fullname });
			redirect === '/my-data' ? Router.go('/') : Router.go(redirect);
		}
	}
	render() {
		const fullName = state.getUserData().fullName;
		if (fullName) {
			this.name = fullName;
		} else {
			this.name = '';
		}

		this.classList.add('my__data-container');
		this.innerHTML = `
      <text-comp use='title'>Mis datos</text-comp>
			<input-comp class='name' name='nombre' type='text' value='${this.name}' placeholder='Messi' labelText='Nombre'></input-comp>
			
      <input-comp class='password' name='password' type='password' placeholder='··············' labelText='Contraseña'></input-comp>
			<input-comp class='password__repeat' name='password' type='password' placeholder='··············' labelText='Repetir contraseña'></input-comp>

      <button-comp class='btn__save-data' background='pink'>Guardar</button-comp>
    `;
		this.addListeners();
	}
}
customElements.define('my-data', MyData);
