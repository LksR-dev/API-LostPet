import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  username: "cfxczyabvvzizi",
  password: "6fef6d2b741662562380dccf9a6f38a2374a3fd7793c2b0dfb9cefcab6af83e3",
  database: "d4a3itd7i2bgr3",
  port: 5432,
  host: "ec2-52-44-13-158.compute-1.amazonaws.com",
  ssl: true,
  // esto es necesario para que corra correctamente
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
