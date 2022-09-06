import { indexPet } from '../lib/algolia';

const bodyToIndex = (body, id?: number) => {
	const resp = {} as any;

	if (id) {
		resp.objectID = id;
	}

	if (body.petName) {
		resp.petName = body.petName;
	}
	if (body.lat && body.lng) {
		resp._geoloc = {
			lat: body.lat,
			lng: body.lng,
		};
	}

	return resp;
};

async function registerPetAlgolia(petData, img): Promise<object> {
	const petId = petData.get('id') as any;
	const petName = petData.get('name') as any;
	const petLat = petData.get('last_lat') as any;
	const petLng = petData.get('last_lng') as any;

	if (petId && petName && petLat && petLng) {
		const algoliaRes = await indexPet.saveObject({
			objectID: petId,
			petName,
			img,
			_geoloc: {
				lat: petLat,
				lng: petLng,
			},
		});
		return algoliaRes;
	} else {
		throw `Error to saveObject in algolia`;
	}
}

async function searchPets(lat: string, lng: string): Promise<object> {
	try {
		const { hits } = await indexPet.search('', {
			aroundLatLng: [lat, lng].join(','),
			aroundRadius: 1000,
		});
		return hits;
	} catch {
		throw `Problems with search pets`;
	}
}

async function updatePetAlgolia(
	id: number,
	lat: number,
	lng: number,
	petName: string,
): Promise<any> {
	try {
		const indexItemPet = bodyToIndex({ lat, lng, petName }, id);
		const pet = await indexPet.partialUpdateObject(indexItemPet);
		return pet;
	} catch {
		return `problems to updatepet algolia`;
	}
}

async function deletePetAlgolia(petId: any) {
	try {
		const deletePet = await indexPet.deleteObject(petId);
		return `Pet has been deleted, petId in algolia: ${deletePet}`;
	} catch {
		throw `Error at delete pet`;
	}
}

export { registerPetAlgolia, searchPets, updatePetAlgolia, deletePetAlgolia };
