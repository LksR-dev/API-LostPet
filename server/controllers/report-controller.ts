import { Report, User, Pet } from '../models';

async function report(
	userId: number,
	petId: number,
	phone_number: number,
	data: string,
	fullname: string,
): Promise<any> {
	try {
		console.log(userId, petId, phone_number, data, fullname);

		const report: Report = await Report.create({
			phone_number,
			report_data: data,
			fullname,
			userId,
			petId,
		});
		console.log(`soy created`, report);

		const pet: Pet = await Pet.findByPk(petId, { include: [User] });
		console.log(`soy el pet`, pet);

		return { report, pet };
	} catch (err) {
		throw err;
	}
}

async function getReports() {
	const report = await Report.findAll();
	return report;
}

export { report, getReports };
