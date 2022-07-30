//Libs, dependencies
import * as express from "express";
import * as path from "path";
import * as cors from "cors";

//Controllers
import { createUser, userData } from "./controllers/user-controller";
import { registerPet } from "./controllers/pet-controller";
import { authUser, getToken } from "./controllers/auth-controller";
import { uploadCloudinaryImg } from "./controllers/cloudinary-controller";
import { registerPetAlgolia } from "./controllers/algolia-controller";
import { authMiddleware } from "./controllers/middleware";
import { Auth, Pet, Report, User } from "./models";
import { indexPet } from "./lib/algolia";

//Init server and server cfg
const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/env", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
  });
});

//Signup
app.post(`/auth`, async (req, res): Promise<void> => {
  const { fullname, email, password } = req.body;

  try {
    const userData = await createUser(fullname, email);
    const userId: number = userData.get("id") as any;
    const authCreated = await authUser(email, password, userId);

    res.json(authCreated);
  } catch (err) {
    res.status(400).json({ message: `Missing data in the body` });
  }
});

//Signin
app.post(`/auth/token`, async (req, res): Promise<void> => {
  const { email, password } = req.body;

  try {
    const token = await getToken(email, password);
    res.json(token);
  } catch {
    res.status(400).json({ error: "Missing data in the body" });
  }
});

app.get("/me", authMiddleware, async (req, res): Promise<void> => {
  try {
    console.log(req._user.id);

    const user = await userData(req._user.id);
    res.json(user);
  } catch {
    res
      .status(400)
      .json({ message: `I need the user ID from the req authmiddleware` });
  }
});

app.post(
  `/user/register-pet`,
  authMiddleware,
  async (req, res): Promise<void> => {
    const { petname, img, lat, lng } = req.body;

    if (req._user.id && req.body) {
      //Cloudinary section
      // const image = await uploadCloudinaryImg(img);

      //Pet Controller
      const pet = await registerPet(petname, img, lat, lng, req._user.id);

      //Algolia section
      const petId = pet.get("id") as any;
      const petName = pet.get("name") as any;
      const petLat = pet.get("last_lat") as any;
      const petLng = pet.get("last_lng") as any;

      const algoliaRes = await registerPetAlgolia(
        petId,
        petName,
        petLat,
        petLng
      );

      res.json({ pet, algoliaRes });
    } else {
      res
        .status(400)
        .json({ message: `Error userId and/or I need data in req.body` });
    }
  }
);

const route = path.resolve(__dirname, "../dist");
app.use(express.static(route));
app.get(`*`, (req, res) => {
  res.sendFile(route, +`/index.html`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
