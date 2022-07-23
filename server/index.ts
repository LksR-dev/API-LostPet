import { createUser, userData } from "./controllers/user-controller";
import { authUser, getToken } from "./controllers/auth-controller";
import { uploadCloudinaryImg } from "./controllers/cloudinary-controller";
import { authMiddleware } from "./controllers/middleware";
import * as express from "express";
import * as path from "path";

const app = express();
app.use(express.json());
const port = 3000;

app.get("/env", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
  });
});

app.post(`/auth`, async (req, res): Promise<void> => {
  const { fullname, email, password, bio, img } = req.body;

  try {
    const urlImg = await uploadCloudinaryImg(img);
    const userData = await createUser(fullname, email, bio, urlImg.url);
    const userId: number = userData.get("id") as any;
    const authCreated = await authUser(email, password, userId);

    res.json(authCreated);
  } catch (err) {
    res.status(400).json({ message: `Missing data in the body` });
  }
});

app.post(`/auth/token`, async (req, res): Promise<void> => {
  const { email, password } = req.body;

  try {
    const token = await getToken(email, password);
    res.json(token);
  } catch (err) {
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

app.put(`/user`, authMiddleware, async (req, res): Promise<void> => {
  const img = req.body.img;

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
