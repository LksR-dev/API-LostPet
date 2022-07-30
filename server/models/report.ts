import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

export class Report extends Model {}
Report.init(
  {
    // Model attributes are defined here
    fullname: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.INTEGER,
    },
    report_data: {
      type: DataTypes.STRING,
    },
  },
  { sequelize, modelName: "report" }
);
