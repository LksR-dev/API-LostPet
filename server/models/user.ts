import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

export class User extends Model {}
User.init(
  {
    // Model attributes are defined here
    fullname: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  },
  { sequelize, modelName: "user" }
);
