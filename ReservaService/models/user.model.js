import { DataTypes } from "sequelize";
import { sequelize } from "../database/config.js";

export const UserModel = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // garante que não existam emails duplicados
    validate: {
      isEmail: true,
    },
  },
  pass: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isadmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "users",
});
