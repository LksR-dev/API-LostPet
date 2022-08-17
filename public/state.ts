const API_BASE_URL = 'http://localhost:3000';

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

	getUserData() {
		return this.getState().user;
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
		const userData = this.getUserData();
		console.log(userData);

		if (userData) {
			localStorage.setItem('dataUser', JSON.stringify(userData));
		}
	},

	setUserData(userData): void {
		const user = this.getUserData();

		if (userData.fullName || userData.email || userData.token) {
			user.fullName = userData.fullname;
			user.email = userData.email;
			user.token = userData.token;
			this.setState(user);
			this.setUserDataLocalStorage();
		}
	},

	setURI(URI: string): void {
		const cs = this.getState();
		cs.URI = URI;
		this.setState(cs);
	},

	// async createUser(password: string, fullname: string, email: string): Promise<object> {
	// 	try {
	// 		this.setUserEmailName({fullname, email});
	// 		const signup: Response = await fetch(`${API_BASE_URL}/auth`, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 			body: JSON.stringify({
	// 				fullname,
	// 				email,
	// 				password,
	// 			}),
	// 		});
	// 		const res: object = signup.json();
	// 		return res;
	// 	} catch {
	// 		throw `Error at the fetch createUser`;
	// 	}
	// },

	// async getToken(password: string, email: string): Promise<string> {
	// 	try {
	// 		const signup: Response = await fetch(`${API_BASE_URL}/auth/token`, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 			body: JSON.stringify({
	// 				email,
	// 				password,
	// 			}),
	// 		});
	// 		const token: string = await signup.json();
	// 		this.setToken(token);
	// 		return token;
	// 	} catch {
	// 		throw `Error at the fetch getToken`;
	// 	}
	// },

	// async getUser() {
	// 	const cs = this.getState();
	// 	const token: string = cs.token;
	// 	const resp = await fetch(`${API_BASE_URL}/me`, {
	// 		headers: { Authorization: `bearer ${token}` },
	// 	});
	// 	const user = await resp.json();
	// 	console.log(user);
	// },

	// async updateDataUser(data: object): Promise<Response> {
	// 	const cs = this.getState();
	// 	const token: string = cs.token;
	// 	const userData = data as any;
	// 	const fullname = userData.fullname;
	// 	const password = userData.password;

	// 	try {
	// 		const resp = await fetch(`${API_BASE_URL}/me`, {
	// 			method: 'PUT',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				Authorization: `bearer ${token}`,
	// 			},
	// 			body: JSON.stringify({
	// 				fullname,
	// 				password,
	// 			}),
	// 		});
	// 		const updateUser: Response = await resp.json();
	// 		return updateUser;
	// 	} catch {
	// 		throw `Error at the fetch to updateUser`;
	// 	}
	// },
};
