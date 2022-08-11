import { where } from 'sequelize/types';
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

async function updateUser(fullname: string, email: string, userId: number): Promise<any> {
	try {
		await User.update({ fullname, email }, { where: { id: userId } });
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

export { createUser, userData, getPets, updateUser };
