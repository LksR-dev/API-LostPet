import { isSwitchStatement } from 'typescript';
import { state } from './state';

(async function () {
	state.initLocalStorage();
	//Create user
	const createUser = await state.createUser('lukitas', 'lukitas@gmail.com', 'ternero39');
	console.log(`Im the createUser response`, createUser);
	//Get Token
	const userToken = await state.getToken('ternero39', 'lukitas@gmail.com');
	console.log(`Im the userToken response`, userToken);
	//Get User
	const getUser = await state.getUser();
	console.log(`Im the getUser`, getUser);
	//Update User
	// const updateUser = await state.updateDataUser({ fullName: `luks666` });
	// console.log(`Im the updateUser`, updateUser);
	//Get Pets AroundTo
	const pets = await state.getPetsAroundTo('-26.7586707', '-65.2697487');
	console.log(`Im the getpets around to`, pets);
	//ADD Pet
	// const newPet = await state.addPet('kira', 'kira.jpg', '-26.7586707', '-65.2697487');
	// console.log(`Im the newPet`, newPet);
	//Get My Pets
	const myPets: object = await state.getMyPets();
	console.log(`Im the getmypets`, myPets);
	// Update Pet
	const updatePet = await state.updatePet(7, 'pepita', '33', '44', 'pepita.jpg', false);
	console.log(updatePet);

	const myPets2: object = await state.getMyPets();
	console.log(`Im the getmypets`, myPets2);
})();
