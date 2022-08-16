//Libs, dependencies
import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';

//Controllers
import { createUser, getUser, getPets, updateUser } from './controllers/user-controller';
import { registerPet, updatePet, deletePet } from './controllers/pet-controller';
import { authUser, getToken, updateUserPassword } from './controllers/auth-controller';
import { uploadCloudinaryImg } from './controllers/cloudinary-controller';
import {
	registerPetAlgolia,
	searchPets,
	updatePetAlgolia,
	deletePetAlgolia,
} from './controllers/algolia-controller';
import { authMiddleware } from './controllers/middleware';
import { Auth, Pet, User } from './models';

//Init server and server cfg
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.use(
	express.json({
		limit: '100mb',
	}),
);

app.get('/env', (req, res) => {
	res.json({
		environment: process.env.NODE_ENV,
	});
});

//Signup
app.post(`/auth`, async (req, res): Promise<void> => {
	const { fullname, email, password } = req.body;

	try {
		const userData: User = await createUser(fullname, email);
		const userId: number = userData.get('id') as any;
		const authCreated: Auth = await authUser(email, password, userId);

		res.json(authCreated);
	} catch (err) {
		res.status(400).json({ message: `Missing data in the body` });
	}
});

//Signin
app.post(`/auth/token`, async (req, res): Promise<void> => {
	const { email, password } = req.body;

	try {
		const token = await getToken(email, password);
		res.json(token);
	} catch {
		res.status(400).json({ error: 'Missing data in the body' });
	}
});

app.get(`/me`, authMiddleware, async (req, res): Promise<User> => {
	const userId = req._user.id;
	try {
		const user = await getUser(userId);
		return user;
	} catch {
		res.status(400).json({ error: 'Problems with the userId for getUser' });
	}
});

//Update user
app.put(`/me`, authMiddleware, async (req, res): Promise<void> => {
	const { fullname, password } = req.body;
	const userId = req._user.id;

	if (fullname && password) {
		const updatedUser: string = await updateUser(fullname, userId);
		const updatePassword: string = await updateUserPassword(userId, password);
		res.status(400).json({ updatedUser, updatePassword });
	} else if (password) {
		const updatePassword: string = await updateUserPassword(userId, password);
		res.status(400).json(updatePassword);
	} else if (fullname) {
		const updatedUser: string = await updateUser(fullname, userId);
		res.status(400).json(updatedUser);
	} else {
		res.status(400).json({ message: `Missing data in the body` });
	}
});

//Find pets around to lat & lng
app.get(`/pets-around`, async (req, res) => {
	const { lat, lng } = req.query;

	if (lat && lng) {
		const hits = await searchPets(lat, lng);
		res.json(hits);
	} else {
		res.status(400).json({ message: `Missing data in the body` });
	}
});

app.post(`/user/register-pet`, authMiddleware, async (req, res): Promise<void> => {
	const { petname, img, lat, lng } = req.body;
	if (req._user.id && req.body) {
		//Cloudinary section
		// const image = await uploadCloudinaryImg(img);
		//Pet Controller
		const pet: Pet = await registerPet(petname, img, lat, lng, req._user.id);
		//Algolia section
		const algoliaRes: object = await registerPetAlgolia(pet);

		res.json({ pet, algoliaRes });
	} else {
		res.status(400).json({ message: `Error userId and/or to need data in req.body` });
	}
});

app.get(`/me/pets`, authMiddleware, async (req, res): Promise<void> => {
	const myPets = await getPets(req._user.id);
	res.json({ myPets });
});

//Update data pet
app.put(`/me/pet/:id`, authMiddleware, async (req, res): Promise<void> => {
	const { petname, lat, lng, img, founded } = req.body;
	const petId = req.params['id'];
	const userId = req._user.id;

	if (founded || petname || (lat && lng) || img) {
		//Cloudinary section
		// const image = await uploadCloudinaryImg(img);
		//DB SECTION
		const pet = await updatePet(petId, userId, lat, lng, petname, img, founded);
		//Algolia SECTION
		const algoliaPet = await updatePetAlgolia(petId, lat, lng, petname);

		res.json({
			messageDB: `Total update pets: ${pet}`,
			messageAlgolia: `Update pet objectID: ${algoliaPet.objectID}`,
		});
	} else {
		res.status(400).json({ mesasge: `Missing data in the body.` });
	}
});

app.delete(`/me/pet/:id`, authMiddleware, async (req, res) => {
	const petId = req.params.id;
	const userId = req._user.id;

	try {
		const petDeleted = await deletePet(petId, userId);
		const petDeletedAlgolia = await deletePetAlgolia(petId);

		res.json({
			message: `The pet has been deleted correctly: ${petDeleted}`,
			messageAlgolia: `${petDeletedAlgolia}`,
		});
	} catch {
		res.status(400).json({ message: `Missing data in the body` });
	}
});

const route = path.resolve(__dirname, '../dist');
app.use(express.static(route));
app.get(`*`, (req, res) => {
	res.sendFile(route, +`/index.html`);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
