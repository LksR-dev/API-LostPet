import { state } from './state';

(async function () {
	// state.initLocalStorage();
	const createUser = await state.createUser('cabraloca44', 'lukitas', 'lukitas@gmail.com');
	console.log(createUser);
	const userToken = await state.getToken('cabraloca44', 'lukitas@gmail.com');
	console.log(userToken);
})();
