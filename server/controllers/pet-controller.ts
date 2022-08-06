import { Pet } from '../models';

async function registerPet(
	petname: string,
	img: string,
	lat: string,
	lng: string,
	userId: number,
): Promise<Pet> {
	if (petname && img && lat && lng && userId) {
		const pet: Pet = await Pet.create({
			name: petname,
			img,
			last_lat: lat,
			last_lng: lng,
			userId,
		});
		return pet;
	} else {
		throw `Error to create or find a pet`;
	}
}

async function updatePet(
	petId: number,
	userId: number,
	lat: number,
	lng: number,
	petName: string,
	img: string,
	founded: boolean,
): Promise<any> {
	if (!founded) {
		const pet = await Pet.update(
			{ last_lat: lat, last_lng: lng, name: petName, img },
			{
				where: { id: petId, userId: userId },
			},
		);
		return pet;
	}

	if (founded) {
		const pet = await Pet.update(
			{ founded },
			{
				where: { id: petId, userId: userId },
			},
		);
		return `The pet state has been updated correctly`;
	}
}

async function deletePet(petId: number, userId: number): Promise<number> {
	if (petId && userId) {
		const pet: number = await Pet.destroy({ where: { id: petId, userId } });
		return pet;
	} else {
		throw `petId or userId incorrect`;
	}
}

export { registerPet, updatePet, deletePet };
