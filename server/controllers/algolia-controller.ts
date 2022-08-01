import { indexPet } from "../lib/algolia";

const bodyToIndex = (body, id?) => {
  const resp = {} as any;

  if (body.nombre) {
    resp.nombre = body.nombre;
  }
  if (body.rubro) {
    resp.rubro = body.rubro;
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

async function registerPetAlgolia(
  objectID: number,
  petName: string,
  lat: string,
  lng: string
): Promise<object> {
  if (objectID && petName && lat && lng) {
    const algoliaRes = await indexPet.saveObject({
      objectID,
      petName,
      _geoloc: {
        lat,
        lng,
      },
    });
    return algoliaRes;
  } else {
    throw `Error to saveObject in algolia`;
  }
}

async function searchPets(lat: string, lng: string): Promise<object> {
  try {
    const { hits } = await indexPet.search("", {
      aroundLatLng: [lat, lng].join(","),
      aroundRadius: 1000,
    });
    return hits;
  } catch {
    throw `Problems with search pets`;
  }
}

export { registerPetAlgolia, searchPets };
