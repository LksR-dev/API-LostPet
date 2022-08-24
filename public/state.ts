const API_BASE_URL = 'http://localhost:3000';

export const state = {
	data: {
		user: {},
		pets: [],
	},
	listeners: [],

	initLocalStorage() {
		const dataUser: Storage = JSON.parse(localStorage.getItem('dataUser') as any);

		if (!dataUser || dataUser === null || dataUser === undefined) {
			return;
		} else {
			this.setUserData(dataUser);
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

	addPetState(newPet) {
		const cs = this.getState();
		cs.pets.push(newPet);
		this.setState(cs);
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

	async getUser(): Promise<Response> {
		const userData = this.getUserData();
		const token: string = userData.token;

		try {
			const resp = await fetch(`${API_BASE_URL}/me`, {
				method: 'GET',
				headers: { Authorization: `bearer ${token}` },
			});
			const user: Response = await resp.json();
			return user;
		} catch {
			throw `Error to getUser.`;
		}
	},

	async updateDataUser(data: object): Promise<Response> {
		const cs = this.getUserData();
		const token: string = cs.token;
		const userData = data as any;
		const fullname = userData.fullName;
		const password = userData.password;

		try {
			const resp: Response = await fetch(`${API_BASE_URL}/me`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${token}`,
				},
				body: JSON.stringify({
					fullname,
					password,
				}),
			});
			const updateUser: Response = await resp.json();
			return updateUser;
		} catch {
			throw `Error at the fetch to updateUser`;
		}
	},

	async getPetsAroundTo(lat: string, lng: string): Promise<Object> {
		try {
			this.setUserData({ lat, lng });
			const resp: Response = await fetch(`${API_BASE_URL}/pets-around?lat=${lat}&lng=${lng}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const hits: object = await resp.json();
			return hits;
		} catch {
			throw `Error to getPets fetch.`;
		}
	},

	async addPet(petname: string, img: string, lat: string, lng: string): Promise<object> {
		const userData = this.getUserData();
		try {
			const resp: Response = await fetch(`${API_BASE_URL}/user/register-pet`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${userData.token}`,
				},
				body: JSON.stringify({ petname, img, lat, lng }),
			});
			const pet: object = await resp.json();
			this.addPetState(pet);
			return pet;
		} catch {
			throw `Error to addPet fetch.`;
		}
	},

	async getMyPets(): Promise<object> {
		try {
			const userData = this.getUserData();
			const resp: Response = await fetch(`${API_BASE_URL}/me/pets`, {
				headers: { Authorization: `bearer ${userData.token}` },
			});
			const myPets: Object = await resp.json();
			return myPets;
		} catch {
			throw `Error to get myPets fetch.`;
		}
	},

	async updatePet(
		petId?: number,
		petname?: string,
		lat?: string,
		lng?: string,
		img?: string,
		founded?: boolean,
	): Promise<object> {
		const userData = this.getUserData();
		const token: string = userData.token;
		try {
			const resp: Response = await fetch(`${API_BASE_URL}/me/pet/${petId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${token}`,
				},
				body: JSON.stringify({ petname, img, lat, lng }),
			});
			const data: object = await resp.json();
			return data;
		} catch {
			throw `Error at updatePet fetch.`;
		}
	},
};
