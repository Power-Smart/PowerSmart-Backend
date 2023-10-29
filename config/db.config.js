import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const dbConfig = {
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
            ca: fs.readFileSync('./public/config/ssl/ca.crt').toString(),
            key: fs.readFileSync('./public/config/ssl/postgresql.key').toString(),
            cert: fs.readFileSync('./public/config/ssl/postgresql.crt').toString(),
        },
    },
};

export default dbConfig;
