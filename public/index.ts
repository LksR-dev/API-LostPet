import { isSwitchStatement } from 'typescript';
import { state } from './state';

(async function () {
	// state.initLocalStorage();

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
	const updateUser = await state.updateDataUser({ fullName: `luks666` });
	console.log(`Im the updateUser`, updateUser);
	//Get Pets
	const pets = await state.getPetsAroundTo('-26.7586707', '-65.2697487');
	console.log(`Im the getpets`, pets);
	//ADD Pet
	// const newPet = await state.addPet('puflito', 'puflito.jpg', '-26.7586707', '-65.2697487');
	// console.log(`Im the newPet`, newPet);
})();
