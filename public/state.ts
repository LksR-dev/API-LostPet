const API_BASE_URL = 'https://lost-pet-dwfm7.herokuapp.com' || 'http://localhost:3000';

export const state = {
	data: {
		user: {},
		pets: [{}],
	},
	listeners: [],

	initLocalStorage() {
		const dataUser: Storage = JSON.parse(localStorage.getItem('dataUser') as any);

		if (!dataUser || dataUser === null || dataUser === undefined) {
			return;
		} else {
			this.setState(dataUser);
		}
	},

	getState(): void {
		return this.data;
	},

	setState(newState): void {
		this.data = newState;
		for (const cb of this.listeners) {
			cb();
		}
	},

	suscribe(callback: (any) => any): void {
		this.listeners.push(callback);
	},

	setUserDataLocalStorage() {
		const cs = this.getState();
		const dataUser = cs.user;
		if (dataUser) {
			localStorage.setItem('dataUser', JSON.stringify(dataUser));
		}
	},

	setUserEmailName(fullame, email): void {
		const cs = this.getState();
		cs.user.fullName = fullame;
		cs.user.email = email;
		this.setState(cs);
	},

	setToken(token: string) {
		const cs = this.getState().user;
		cs.token = token;
		this.setUserDataLocalStorage();
		this.setState(cs);
	},

	setURI(URI: string): void {
		const cs = this.getState();
		cs.URI = URI;
		this.setState(cs);
	},

	async createUser(password: string, fullname: string, email: string): Promise<object> {
		try {
			this.setUserEmailName(fullname, email);
			const signup: Response = await fetch(`${API_BASE_URL}/auth`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					fullname,
					email,
					password,
				}),
			});
			const res: object = signup.json();
			return res;
		} catch {
			throw `Error at the fetch createUser`;
		}
	},

	async getToken(password: string, email: string): Promise<string> {
		try {
			const signup: Response = await fetch(`${API_BASE_URL}/auth/token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});
			const token: string = await signup.json();
			this.setToken(token);
			return token;
		} catch {
			throw `Error at the fetch getToken`;
		}
	},

	async updateDataUser(fullname?, email?, password?) {
		await fetch(`${API_BASE_URL}/me`, {
			method: 'PUT',
			headers: {},
		});
	},
};
