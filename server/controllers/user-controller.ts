import { User } from "../models";

async function createUser(
  fullname: string,
  email: string,
  bio: string,
  img: string
): Promise<User> {
  if (!fullname) {
    throw `I need user fullName`;
  } else if (!email) {
    throw `I need user email`;
  } else if (!bio) {
    throw `I need user description`;
  } else if (!img) {
    throw `I need user IMG`;
  } else {
    const [user, created] = await User.findOrCreate({
      where: { email: email },
      defaults: {
        fullname,
        email,
        bio,
        img,
      },
    });
    return user;
  }
}

async function userData(userId): Promise<User> {
  const user = await User.findByPk(userId);
  return user;
}

export { createUser, userData };
