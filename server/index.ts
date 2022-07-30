//Libs, dependencies
import * as express from "express";
import * as path from "path";
import * as cors from "cors";

//Controllers
import { createUser, userData } from "./controllers/user-controller";
import { authUser, getToken } from "./controllers/auth-controller";
import { uploadCloudinaryImg } from "./controllers/cloudinary-controller";
import { authMiddleware } from "./controllers/middleware";

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

app.post(`/auth/token`, async (req, res): Promise<void> => {
  const { email, password } = req.body;

  const token = await getToken(email, password);
  if (token) {
    res.json(token);
  } else {
    res.status(400).json({ error: "Email or password incorrect" });
  }
});

app.get("/me", authMiddleware, async (req, res): Promise<void> => {
  if (!req._user.id) {
    throw `I need the user ID from the req authmiddleware`;
  } else {
    const user = await userData(req._user.id);
    res.json(user);
  }
});

app.put(`/user/pets`, authMiddleware, async (req, res): Promise<void> => {
  const { petname, img, lat, lng } = req.body;

  if (!img) {
    throw `I need a img from the req.body`;
  } else {
    uploadCloudinaryImg(img);
  }
});

const route = path.resolve(__dirname, "../dist");
app.use(express.static(route));
app.get(`*`, (req, res) => {
  res.sendFile(route, +`/index.html`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
