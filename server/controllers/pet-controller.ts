import { Pet } from "../models";

async function registerPet(
  petname: string,
  img: string,
  lat: string,
  lng: string,
  userId: number
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

export { registerPet };
