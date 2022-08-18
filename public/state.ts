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

		userData
			? localStorage.setItem('dataUser', JSON.stringify(userData))
			: console.error(`Missing userData in setUserDataLocalStorage`);
	},

	setUserData(userData): void {
		const cs = this.getState();

		if (userData.fullName) {
			cs.user.fullName = userData.fullName;
			this.setState(cs);
			this.setUserDataLocalStorage();
		}
		if (userData.email) {
			cs.user.email = userData.email;
			this.setState(cs);
			this.setUserDataLocalStorage();
		}
		if (userData.token) {
			cs.user.token = userData.token;
			this.setState(cs);
			this.setUserDataLocalStorage();
		}
		if (userData.lat && userData.lng) {
			cs.user.lat = userData.lat;
			cs.user.lng = userData.lng;
			this.setState(cs);
			this.setUserDataLocalStorage();
		}
	},

	setURI(URI: string): void {
		const cs = this.getState();
		cs.URI = URI;
		this.setState(cs);
	},

	async createUser(fullName: string, email: string, password: string): Promise<object> {
		try {
			this.setUserData({ fullName, email });
			const signup: Response = await fetch(`${API_BASE_URL}/auth`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					fullName,
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
			this.setUserData({ token });
			return token;
		} catch {
			throw `Error at the fetch getToken`;
		}
	},

	async getUser() {
		const userData = this.getUserData();
		const token: string = userData.token;

		const resp = await fetch(`${API_BASE_URL}/me`, {
			method: 'GET',
			headers: { Authorization: `bearer ${token}` },
		});
		const user = await resp.json();
		console.log(user);
	},

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
