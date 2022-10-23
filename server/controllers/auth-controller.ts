import { Auth } from '../models';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

function getSHA256ofString(text: string) {
	return crypto.createHash('sha256').update(JSON.stringify(text)).digest('hex');
}
const SECRET = process.env.JWT_SECRET;

async function authUser(email: string, password: string, userId: number): Promise<any> {
	try {
		const [auth, authCreated] = await Auth.findOrCreate({
			where: { email: email },
			defaults: {
				email,
				password: getSHA256ofString(password),
				userId,
			},
		});
		return auth;
	} catch (err) {
		return `Error to auth user. Error: ${err}`;
	}
}

async function getToken(email: string, password: string): Promise<string> {
	try {
		const auth: Auth = await Auth.findOne({
			where: {
				email: email,
				password: getSHA256ofString(password),
			},
		});

		const token: string = jwt.sign({ id: auth.get('userId') }, SECRET);
		return token;
	} catch (err) {
		return `Error to getToken. Error: ${err}`;
	}
}

async function updateUserPassword(userId: number, password: string): Promise<string> {
	try {
		const passHash = getSHA256ofString(password);
		await Auth.update({ password: passHash }, { where: { userId: userId } });
		return `User password has been updated`;
	} catch {
		return `Error to update user password`;
	}
}

export { authUser, getToken, updateUserPassword };
