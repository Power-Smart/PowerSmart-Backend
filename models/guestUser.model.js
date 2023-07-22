import db from '../models/index.js';
import { DataTypes } from 'sequelize';

const GuestUser = db.define('guestUser', {
    guest_user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    is_banned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

export default GuestUser;