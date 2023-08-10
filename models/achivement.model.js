import db from '../models/index.js';
import { DataTypes } from 'sequelize';

const Achievement = db.define('achievement', {
    achievement_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    trophyImg: {
        type: DataTypes.STRING,
    },
    is_reach: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },

});

export default Achievement;
