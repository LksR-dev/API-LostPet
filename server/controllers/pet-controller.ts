import { Pet } from '../models';

async function registerPet(
	petname: string,
	lat: string,
	lng: string,
	userId: number,
	img: string,
	ubication: string,
): Promise<Pet> {
	if (petname && lat && lng && userId) {
		try {
			const pet: Pet = await Pet.create({
				name: petname,
				last_lat: lat,
				last_lng: lng,
				userId,
				img,
				ubication,
			});
			return pet;
		} catch (err) {
			console.log(`soy el catch de registerPet`, err);
		}
	}
}

async function getPetById(id): Promise<Pet> {
	try {
		const pet: Pet = await Pet.findByPk(id);
		return pet;
	} catch (err) {
		console.log(`soy el catch de getPetById`, err);
	}
}

async function updatePet(
	petId: number,
	userId: number,
	lat: string,
	lng: string,
	petName: string,
	img: string,
	founded: boolean,
	ubication: string,
): Promise<any> {
	try {
		if (!founded) {
			const pet = await Pet.update(
				{ last_lat: lat, last_lng: lng, name: petName, img, ubication },
				{
					where: { id: petId, userId: userId },
				},
			);
			return pet;
		} else if (founded) {
			await Pet.update(
				{ founded },
				{
					where: { id: petId, userId: userId },
				},
			);
			return `The pet state has been updated correctly`;
		}
	} catch (err) {
		console.log(`soy el catch de updatePet`, err);
	}
}

async function deletePet(petId: number, userId: number): Promise<number> {
	if (petId && userId) {
		try {
			const pet: number = await Pet.destroy({ where: { id: petId, userId } });
			return pet;
		} catch (err) {
			console.log(`soy el catch de deletePet`, err);
		}
	}
}

export { registerPet, updatePet, deletePet, getPetById };
