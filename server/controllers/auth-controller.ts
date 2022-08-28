import { Auth } from '../models';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

function getSHA256ofString(text: string) {
	return crypto.createHash('sha256').update(JSON.stringify(text)).digest('hex');
}
const SECRET = process.env.JWT_SECRET;

async function authUser(email: string, password: string, userId: number): Promise<Auth> {
	if (!email) {
		throw `I need a user Email`;
	} else if (!password) {
		throw `I need a user Password`;
	} else if (!userId) {
		throw `I need userId`;
	} else {
		const [auth, authCreated] = await Auth.findOrCreate({
			where: { email: email },
			defaults: {
				email,
				password: getSHA256ofString(password),
				userId,
			},
		});
		return auth;
	}
}

async function getToken(email: string, password: string): Promise<string> {
	if (!email) {
		throw `I need a user Email`;
	} else if (!password) {
		throw `I need a user Password`;
	} else {
		const auth: Auth = await Auth.findOne({
			where: {
				email: email,
				password: getSHA256ofString(password),
			},
		});

		if (auth) {
			const token: string = jwt.sign({ id: auth.get('userId') }, SECRET);
			return token;
		} else {
			return `Email or password incorrect`;
		}
	}
}

async function updateUserPassword(userId: number, password: string) {
	try {
		const passHash = getSHA256ofString(password);
		await Auth.update({ password: passHash }, { where: { userId: userId } });
		return `User password has been updated`;
	} catch {
		throw `Error to update user password`;
	}
}

export { authUser, getToken, updateUserPassword };
