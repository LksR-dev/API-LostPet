import { state } from './state';

(async function () {
	state.setUserEmailName({ fullname: `lucass`, email: `lucass@gmail.com`, token: `e34kos` });

	// const userData = state.getUserData();
	// // state.initLocalStorage();
	// const createUser = await state.createUser('ternero39', 'lukitas', 'lukitas@gmail.com');
	// console.log(createUser);
	// const userToken = await state.getToken('ternero39', 'lukitas@gmail.com');
	// console.log(userToken);
	// const updateUser = await state.updateDataUser({ password: `ternero39` });
	// console.log(updateUser);
	// state.getUser();
})();
