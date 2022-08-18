import { isSwitchStatement } from 'typescript';
import { state } from './state';

(async function () {
	// state.initLocalStorage();
	const createUser = await state.createUser('lukitas', 'lukitas@gmail.com', 'ternero39');
	console.log(`Im the createUser response`, createUser);
	const userToken = await state.getToken('ternero39', 'lukitas@gmail.com');
	console.log(`Im the userToken response`, userToken);
	// const updateUser = await state.updateDataUser({ password: `ternero39` });
	// console.log(updateUser);
	state.getUser();
})();
