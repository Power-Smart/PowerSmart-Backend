import { get_sse_client } from "../config/sse.config.js";
import Place from "../models/place.model.js";
import CustomerPlace from "../models/customerPlace.model.js";
import Room from "../models/room.model.js";
import sequelize from "../models/index.js";

// export const sendSensorDara = async (req, res) => {
//     const { user_id, place_id } = req.params;

//     const sse_client = get_sse_client(user_id);
//     if (sse_client) {
//         const sensorData = await SensorData.findOne({ where: { sensor_unit_id: place_id } });
//         sse_client.write(`data:${JSON.stringify(sensorData.dataValues)}\n\n`);
//     }
// };

export const sendPlaceSensorData = async (req, res) => {
    const { user_id } = req.params;

    const sse_client = get_sse_client(user_id);
    if (sse_client) {
        try {
            const promises = await getPlacesAndRooms(user_id);

            Promise.all(promises)
                .then((updatedRooms) => {
                    sse_client.write(`data:${JSON.stringify(updatedRooms)}\n\n`);
                })
                .catch(error => {
                    console.error(error);
                    sse_client.write(`data:${JSON.stringify({ err })}\n\n`);
                });
        } catch (err) {
            console.log(err);
            sse_client.write(`data:${JSON.stringify({ err })}\n\n`);
        }
    }
}

export const getPlacesAndRooms = async (user_id) => {
    const customerPlaces = await CustomerPlace.findAll({
        where: {
            user_id: user_id,
            access_level: 1,
        },
        attributes: ["place_id"],
    });
    const places = await Place.findAll({
        where: {
            place_id: customerPlaces.map((place) => place.place_id),
        },
    });

    const rooms = await Room.findAll({
        where: {
            place_id: places.map((place) => place.place_id),
        },
        attributes: [
            "room_id",
            ["name", "room_name"],
            "is_active",
            "place_id"
        ],
    });

    const promises = rooms.map(async (room) => {
        const [sensorData, metadata] = await sequelize.query(`SELECT * FROM sensor_data, sensor_units WHERE sensor_data.sensor_unit_id = sensor_units.sensor_unit_id AND sensor_units.room_id = ${room.room_id} ORDER BY sensor_data."updatedAt" DESC LIMIT 1`);
        let sensorDataObj = sensorData[0];
        room.dataValues = { ...room.dataValues, ...sensorDataObj };
        return room.dataValues;
    });

    return promises;
};