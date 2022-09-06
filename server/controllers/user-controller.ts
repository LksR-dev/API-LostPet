import { User } from '../models';
import { Pet } from '../models';

async function createUser(fullname: string, email: string): Promise<User> {
	if (!fullname) {
		throw `I need user fullName`;
	} else if (!email) {
		throw `I need user email`;
	} else {
		const [user, created] = await User.findOrCreate({
			where: { email: email },
			defaults: {
				fullname,
				email,
			},
		});
		return user;
	}
}

async function getUser(userId: number): Promise<User> {
	if (userId) {
		const user: User = await User.findByPk(userId);
		return user;
	}
}

async function getEmail(email: string): Promise<User> {
	try {
		const user = await User.findOne({ where: { email } });
		return user;
	} catch {
		throw `Email doesn't exists.`;
	}
}

async function getAllUser(): Promise<User[]> {
	try {
		const user: User[] = await User.findAll();
		return user;
	} catch {
		throw `Problems to get users.`;
	}
}

async function updateUser(fullname: string, userId: number): Promise<any> {
	try {
		await User.update({ fullname }, { where: { id: userId } });
		return `The user has been updated correctly`;
	} catch {
		throw `Problems at create user.`;
	}
}

async function getPets(userId: number): Promise<Pet[]> {
	const pets = await Pet.findAll({ where: { userId } });
	return pets;
}

async function userData(userId): Promise<User> {
	const user = await User.findByPk(userId);
	return user;
}

export { createUser, userData, getPets, getAllUser, updateUser, getUser, getEmail };
