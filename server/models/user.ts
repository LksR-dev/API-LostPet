import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

export class User extends Model {}
User.init(
  {
    // Model attributes are defined here
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);
