import { indexPet } from '../lib/algolia';

const bodyToIndex = (body, id?: number) => {
	const resp = {} as any;

	if (id) {
		resp.objectID = id;
	}

	if (body.img) {
		resp.img = body.img;
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

async function registerPetAlgolia(petData, img: string, ubication: string): Promise<object> {
	const petId = petData.get('id') as any;
	const petName = petData.get('name') as any;
	const petLat = petData.get('last_lat') as any;
	const petLng = petData.get('last_lng') as any;

	if (petId && petName && petLat && petLng) {
		try {
			const algoliaRes = await indexPet.saveObject({
				objectID: petId,
				petName,
				img,
				ubication,
				_geoloc: {
					lat: petLat,
					lng: petLng,
				},
			});
			return algoliaRes;
		} catch (err) {
			console.log(`soy el catch de registerPetAlgolia `, err);
		}
	}
}

async function searchPets(lat: string, lng: string): Promise<object> {
	try {
		const { hits } = await indexPet.search('', {
			aroundLatLng: [lat, lng].join(','),
			aroundRadius: 1000,
		});
		return hits;
	} catch (err) {
		console.log(`soy el catch de searchPets in algolia`, err);
	}
}

async function updatePetAlgolia(
	id: number,
	lat: number,
	lng: number,
	petName: string,
	ubication: string,
	img: string,
): Promise<any> {
	try {
		const indexItemPet = bodyToIndex({ lat, lng, petName, ubication, img }, id);
		const pet = await indexPet.partialUpdateObject(indexItemPet);
		return pet;
	} catch (err) {
		console.log(`soy el catch de updatePetAlgolia`, err);
	}
}

async function deletePetAlgolia(petId: any) {
	try {
		const deletePet = await indexPet.deleteObject(petId);
		return `Pet has been deleted, petId in algolia: ${deletePet}`;
	} catch (err) {
		console.log(`soy el catch de deletePetAlgolia`, err);
	}
}

export { registerPetAlgolia, searchPets, updatePetAlgolia, deletePetAlgolia };
