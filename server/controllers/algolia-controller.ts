import { indexPet } from '../lib/algolia';

const bodyToIndex = (body, id?: number) => {
	const resp = {} as any;

	if (body.petName) {
		resp.petName = body.petName;
	}
	if (body.lat && body.lng) {
		resp._geoloc = {
			lat: body.lat,
			lng: body.lng,
		};
	}
	if (id) {
		resp.objectID = id;
	}

	return resp;
};

async function registerPetAlgolia(petData): Promise<object> {
	const petId = petData.get('id') as any;
	const petName = petData.get('name') as any;
	const petLat = petData.get('last_lat') as any;
	const petLng = petData.get('last_lng') as any;

	if (petId && petName && petLat && petLng) {
		const algoliaRes = await indexPet.saveObject({
			objectID: petId,
			petName,
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
	const indexItemPet = bodyToIndex({ lat, lng, petName }, id);
	const pet = indexPet.partialUpdateObject(indexItemPet);
	return pet;
}
export { registerPetAlgolia, searchPets, updatePetAlgolia };
