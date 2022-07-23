import * as jwt from "jsonwebtoken";
const SECRET = "asdasdasd12341234";

export async function authMiddleware(req, res, next): Promise<void> {
  const authorization: string = req.get("Authorization");
  const token: string = authorization.split(" ")[1];
  console.log(authorization, token);

  try {
    const data: string = jwt.verify(token, SECRET);
    req._user = data;
    next();
  } catch (err) {
    res.status(401).json({
      message: `Header authorization doesn't exists or token invalid.`,
    });
  }
}
