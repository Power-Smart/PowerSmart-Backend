import dbConfig from "../config/db.config.js";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false,
    //         ca: fs.readFileSync('config/ssl/ca.crt').toString(),
    //     },
    // },
});

export default sequelize;
