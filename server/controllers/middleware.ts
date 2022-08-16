import * as jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET;

export async function authMiddleware(req, res, next): Promise<void> {
	const authorization: string = req.get('Authorization');
	const token: string = authorization.split(' ')[1];

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
