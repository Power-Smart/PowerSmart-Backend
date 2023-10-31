import CustomerPlace from "../models/customerPlace.model.js"
import Place from "../models/place.model.js";
import TechSupport from "../models/techSupport.model.js";
import TechSupportPlace from "../models/techSupportPlace.model.js"
import User from "../models/user.model.js";

export const techSupportAccess = async (req, res) => {
    try {
        const { userID } = req.params;
        const userPlaces = await CustomerPlace.findAll({
            attributes: ["place_id"],
            where: {
                user_id: userID
            }
        });
        const placeIDs = userPlaces.map(place => place.dataValues.place_id);
        const techRequests = await TechSupportPlace.findAll({
            include: [
                {
                    model: Place,
                    as: "place",
                    attributes: ["name"]
                },
                {
                    model: TechSupport,
                    as: "techSupport",
                    attributes: ["user_id"],
                    include: {
                        model: User,
                        as: "user",
                        attributes: ["first_name", "last_name"]
                    }
                }
            ],
            where: {
                place_id: placeIDs,
            }
        });
        const data = techRequests.map(item => {
            return {
                place_id: item.dataValues.place_id,
                place_name: item.dataValues.place.dataValues.name,
                tech_support_id: item.dataValues.tech_support_id,
                tech_support_name: item.dataValues.techSupport.dataValues.user.dataValues.first_name + " " + item.dataValues.techSupport.dataValues.user.dataValues.last_name,
                access_type: item.dataValues.access_type,
                created_at: item.dataValues.created_at,
                updated_at: item.dataValues.updated_at
            }
        });
        res.json(data);
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
}

export const restrictAccess = async (req, res) => {
    // const { userID } = req.params;
    try {
        const { placeID, techSupportID } = req.body;
        await TechSupportPlace.update({
            access_type: 0
        }, {
            where: {
                tech_support_id: techSupportID,
                place_id: placeID
            }
        });
        res.status(200).json({ message: "Access restricted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
}

export const controlAccess = async (req, res) => {
    try {
        const { userID } = req.params;
        const { place_id, tech_support_id, access_type } = req.body;
        const userPlaces = await CustomerPlace.findAll({
            attributes: ["place_id"],
            where: {
                user_id: userID,
                place_id
            }
        });
        if (userPlaces.length > 0) {
            await TechSupportPlace.update({
                access_type
            }, {
                where: {
                    tech_support_id,
                    place_id
                }
            });
            res.status(200).json({ message: "Access controlled successfully" });
        } else {
            res.status(401).json({ message: "Access control unauthorized" });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
}