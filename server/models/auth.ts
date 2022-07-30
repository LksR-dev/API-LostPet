import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

export class Auth extends Model {}
Auth.init(
  {
    // Model attributes are defined here
    password: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  },
  { sequelize, modelName: "auth" }
);
