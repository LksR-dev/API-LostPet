import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

export class Auth extends Model {}
Auth.init(
  {
    // Model attributes are defined here
    password: DataTypes.STRING,
    email: DataTypes.STRING,
  },
  { sequelize, modelName: "auth" }
);
