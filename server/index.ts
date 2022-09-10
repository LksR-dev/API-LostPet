//Libs, dependencies
import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import 'dotenv/config';

//Controllers
import {
	createUser,
	getUser,
	getAllUser,
	getPets,
	updateUser,
	getEmail,
} from './controllers/user-controller';
import { registerPet, getPetById, updatePet, deletePet } from './controllers/pet-controller';
import { authUser, getToken, updateUserPassword } from './controllers/auth-controller';
import { uploadCloudinaryImg } from './controllers/cloudinary-controller';
import {
	registerPetAlgolia,
	searchPets,
	updatePetAlgolia,
	deletePetAlgolia,
} from './controllers/algolia-controller';
import { authMiddleware } from './controllers/middleware';
import { report } from './controllers/report-controller';
import { sendEmail } from './lib/sendgrid';
import { Auth, Pet, User } from './models';

//Init server and server cfg
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.get('/env', (req, res) => {
	res.json({
		environment: process.env.NODE_ENV,
	});
});

app.get(`/users`, async (req, res) => {
	const users = await getAllUser();
	res.status(400).json(users);
});

//Signup
app.post(`/auth`, async (req, res): Promise<void> => {
	const { fullName, email, password } = req.body;

	try {
		const userData: User = await createUser(fullName, email);
		const userId: number = userData.get('id') as any;
		const authCreated: Auth = await authUser(email, password, userId);

		res.status(200).json(authCreated);
	} catch (err) {
		res.status(400).json({ message: `Missing data in the body` });
	}
});

//Signin
app.post(`/auth/token`, async (req, res): Promise<void> => {
	const { email, password } = req.body;

	try {
		const token = await getToken(email, password);
		res.status(200).json(token);
	} catch {
		res.status(400).json({ error: 'Missing data in the body' });
	}
});

app.post(`/auth/email`, async (req, res): Promise<void> => {
	const { email } = req.body;
	try {
		const user = await getEmail(email);
		res.status(200).json(user);
	} catch {
		res.status(400).json({ message: 'Problems with the email at endpoint auth email.' });
	}
});

app.get(`/me`, authMiddleware, async (req, res): Promise<void> => {
	const userId = req._user.id;
	try {
		const user: User = await getUser(userId);
		res.status(200).json(user);
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
		res.status(200).json({ updatedUser, updatePassword });
	} else if (password) {
		const updatePassword: string = await updateUserPassword(userId, password);
		res.status(200).json(updatePassword);
	} else if (fullname) {
		const updatedUser: string = await updateUser(fullname, userId);
		res.status(200).json(updatedUser);
	} else {
		res.status(400).json({ message: `Missing data in the body` });
	}
});

//Find pets around to lat & lng
app.get(`/pets-around`, async (req, res): Promise<void> => {
	const { lat, lng } = req.query;

	if (lat && lng) {
		const hits: object = await searchPets(lat, lng);
		res.status(200).json(hits);
	} else {
		res.status(400).json({ message: `Missing data in the body` });
	}
});

app.post(`/user/register-pet`, authMiddleware, async (req, res): Promise<void> => {
	const { petname, img, lat, lng, ubication } = req.body;

	if (req._user.id && req.body) {
		//Cloudinary section
		const image = await uploadCloudinaryImg(img);
		//Pet Controller
		const pet: Pet = await registerPet(petname, lat, lng, req._user.id, image.url, ubication);
		//Algolia section
		const algoliaRes: object = await registerPetAlgolia(pet, image.url, ubication);

		res.status(200).json({ pet, algoliaRes });
	} else {
		res.status(400).json({ message: `Error userId and/or to need data in req.body` });
	}
});

app.get(`/me/pets`, authMiddleware, async (req, res): Promise<void> => {
	const myPets = await getPets(req._user.id);
	res.json(myPets);
});

app.get(`/pet/:id`, authMiddleware, async (req, res): Promise<void> => {
	try {
		const myPets = await getPetById(req.params.id);
		res.status(200).json(myPets);
	} catch {
		throw res.status(400).json({ message: `The petId is not correct. (getPetById)` });
	}
});

//Update data pet
app.patch(`/me/pet/:id`, authMiddleware, async (req, res): Promise<void> => {
	const { petname, lat, lng, img, founded, ubication } = req.body;
	const petId = req.params['id'];
	const userId = req._user.id;
	try {
		//Cloudinary section
		const image = await uploadCloudinaryImg(img);
		//DB SECTION
		const pet = await updatePet(petId, userId, lat, lng, petname, image.url, founded, ubication);
		//Algolia SECTION
		const algoliaPet = await updatePetAlgolia(petId, lat, lng, petname, ubication, image.url);

		res.status(200).json({
			messageDB: `Total update pets: ${pet}`,
			messageAlgolia: `Update pet objectID: ${algoliaPet.objectID}`,
		});
	} catch {
		res.status(400).json({ mesasge: `Missing data in the body.` });
	}
});

app.delete(`/me/pet/:id`, authMiddleware, async (req, res): Promise<void> => {
	const petId = req.params.id;
	const userId = req._user.id;

	try {
		const petDeleted = await deletePet(petId, userId);
		await deletePetAlgolia(petId);
		res.status(200).json({
			message: `The pet has been deleted correctly: ${petDeleted}`,
			messageAlgolia: `The pet has been deleted correctly`,
		});
	} catch {
		res.status(400).json({ message: `Missing data in the body` });
	}
});

app.post(`/report-pet`, authMiddleware, async (req, res): Promise<void> => {
	const { fullName, phone_number, data, petId } = req.body;
	const userId = req._user.id;

	try {
		const [reported, pet] = await report(userId, petId, phone_number, data, fullName);

		const sentEmail = await sendEmail(
			pet.user.getDataValue('email'),
			pet.getDataValue('name'),
			pet.user.getDataValue('fullname'),
			reported.getDataValue('phone_number'),
			reported.getDataValue('report_data'),
		);

		res.status(200).json({ reported, sentEmail });
	} catch {
		res.status(400).json({ message: `Missing data in the body.` });
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
