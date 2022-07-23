import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

export class Pet extends Model {}
Pet.init(
  {
    // Model attributes are defined here
    name: DataTypes.STRING,
    bio: DataTypes.STRING,
    img: DataTypes.STRING,
    founded: DataTypes.BOOLEAN,
    last_lng: DataTypes.FLOAT,
    last_lat: DataTypes.FLOAT,
  },
  { sequelize, modelName: "pet" }
);
