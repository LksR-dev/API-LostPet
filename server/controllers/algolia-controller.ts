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

export { registerPetAlgolia };
