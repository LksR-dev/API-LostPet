import { Model, DataTypes } from 'sequelize';
import { sequelize } from './conn';

export class Pet extends Model {}
Pet.init(
	{
		// Model attributes are defined here
		name: {
			type: DataTypes.STRING,
		},
		founded: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		last_lng: {
			type: DataTypes.FLOAT,
		},
		last_lat: {
			type: DataTypes.FLOAT,
		},
	},
	{ sequelize, modelName: 'pet' },
);
