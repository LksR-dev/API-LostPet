//Components
import './components/header';
import './components/text';
import './components/input';
import './components/button';
import './components/pet-card';
//Pages
import './pages/home';
import './pages/auth-email';
import './pages/my-data';
import './pages/my-pets';
import './pages/report-pet';
import './pages/update-pet';

import { initRouter } from './router';
import { state } from './state';

(async function () {
	state.initLocalStorage();
	const root = document.querySelector('.root');
	initRouter(root);
	// // If the email exists, the route is this
	// const emailValidation = await state.authEmail('lukitas@gmail.com');
	// console.log(`Im the email validation`, emailValidation);

	// //Get Token
	// const userToken = await state.getToken('lucas123', 'lukitas@gmail.com');
	// console.log(`Im the userToken response`, userToken);

	// //Get User
	// const getUser = await state.getUser();
	// console.log(`Im the getUser`, getUser);

	// //Update User
	// const updateUser = await state.updateDataUser({ fullName: `luks666`, password: `lucas123` });
	// console.log(`Im the updateUser`, updateUser);

	// //Get Pets AroundTo
	// const pets = await state.getPetsAroundTo('-26.7586707', '-65.2697487');
	// console.log(`Im the getpets around to`, pets);

	// //ADD Pet
	// // const newPet = await state.addPet('chicharrron', 'chicharrron.jpg', '-26.7586707', '-65.2697487');
	// // console.log(`Im the newPet`, newPet);

	// //Get My Pets
	// const myPets: object = await state.getMyPets();
	// console.log(`Im the getmypets`, myPets);

	// // Update Pet
	// const updatePet = await state.updatePet({ petId: 9, petname: 'pedrita', img: 'pedrita.png' });
	// console.log(updatePet);

	// const myPetsAgain: object = await state.getMyPets();
	// console.log(`Im the getmypetsagain`, myPetsAgain);
	/*------------------------------------------------------------
	--------------------------------------------------------------
	--------------------------------------------------------------
	--------------------------------------------------------------
	--------------------------------------------------------------
	
	*/

	// // If the email doesn't exists, the route is this
	// const emailValidationUser2 = await state.authEmail('chipotle34@gmail.com');
	// console.log(`Im the email validation`, emailValidationUser2);

	// // Create user
	// if (!emailValidationUser2) {
	// 	const createUser = await state.createUser('chipotle', 'pepitas333');
	// 	console.log(`Im the createUser response`, createUser);
	// }

	// //Get Token
	// const userToken2 = await state.getToken('pepitas333', 'chipotle34@gmail.com');
	// console.log(`Im the userToken response`, userToken2);

	// //Get User
	// const getUser2 = await state.getUser();
	// console.log(`Im the getUser`, getUser2);

	// //Update User
	// // const updateUser = await state.updateDataUser({ password: `chipotle333` });
	// // console.log(`Im the updateUser`, updateUser);

	// // Get Pets AroundTo
	// const pets = await state.getPetsAroundTo(-26.7586707, -65.2697487);
	// console.log(`Im the getpets around to`, pets);

	// //ADD Pet
	// // const newPet = await state.addPet('nuez', 'nuez.jpg', '-26.7586707', '-65.2697487');
	// // console.log(`Im the newPet`, newPet);

	// //Get My Pets
	// const myPets: object = await state.getMyPets();
	// console.log(`Im the getmypets`, myPets);

	// const report = await state.reportPet(`lucas`, 3815119091, `vi a macricio por ahi`, 4);
	// console.log(`Im the report pet`, report);

	// Update Pet
	// const updatePet = await state.updatePet({ petId: 19, petname: 'almendra', img: 'almendra.pngj' });
	// console.log(updatePet);

	// Delete Pet
	// const deletePet = await state.deletePet(10);
	// console.log(deletePet);
})();
