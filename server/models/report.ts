import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

export class Report extends Model {}
Report.init(
  {
    // Model attributes are defined here
    fullname: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    report_data: DataTypes.STRING,
  },
  { sequelize, modelName: "report" }
);
