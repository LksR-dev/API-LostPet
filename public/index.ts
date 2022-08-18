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
	console.log(getUser);
	//Update User
	const updateUser = await state.updateDataUser({ password: `ternero39` });
	console.log(updateUser);
})();
