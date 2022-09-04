import { Report, User, Pet } from '../models';

async function report(
	userId: number,
	petId: number,
	phone_number: number,
	data: string,
	fullname: string,
): Promise<any> {
	try {
		const report: Report = await Report.create({
			phone_number,
			report_data: data,
			fullname,
			userId,
			petId,
		});
		const pet: Pet = await Pet.findByPk(petId, { include: [User] });

		return [report, pet];
	} catch (err) {
		throw err;
	}
}

async function getReports() {
	const report = await Report.findAll();
	return report;
}

export { report, getReports };
