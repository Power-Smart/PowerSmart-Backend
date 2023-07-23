import db from './index.js';
import { DataTypes } from 'sequelize';


const StockManager = db.define('stock_manager', {
    stock_manager_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    profile_pic: {
        type: DataTypes.STRING,
    },
    tel_no: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: true,
    },
    is_banned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

export default StockManager;