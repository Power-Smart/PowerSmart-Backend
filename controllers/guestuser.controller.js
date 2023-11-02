import GuestUser from "../models/guestUser.model.js";
import GuestUserSuggest from "../models/guestUserSuggest.model.js";
import Place from "../models/place.model.js";
import Room from "../models/room.model.js";
import twilio from 'twilio';

const accountSid = 'AC9ca6623ae4b04281066da8c92858af4a';
const authToken = '18b5f0cceadb84449cfd4e4a4b6e403a';
const client = twilio(accountSid, authToken);


export const addGuestUser = async (req, res) => {
    const { guest_name, guest_email, profile_pic, customerID } = req.body;
    console.log(req.body)

    try {
        const existingUser = await GuestUser.findOne({
            where: {
                guest_email: guest_email
            }
        });

        if (existingUser) {
            return res.status(200).json({ user_id: existingUser.user_id });
        } else {
            const newGuestUser = await GuestUser.create({
                customer_id: customerID,
                guest_name: guest_name,
                guest_email: guest_email,
                guest_profile_pic: profile_pic
            });
            return res.status(201).json({ user_id: newGuestUser.user_id });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};



export const addNewGuestUserSuggest = async (req, res) => {
    console.log(req.body)
    const { guest_id, customer_id, place_id, room_id, suggestion } = req.body

    try {
        const guestUserSuggest = await GuestUserSuggest.create({
            user_id: guest_id,
            customer_id: customer_id,
            place_id: place_id,
            room_id: room_id,
            suggest_description: suggestion,
        });
        res.status(201).send(guestUserSuggest);
    } catch (error) {
        console.log(error);
    }
};


export const getAllGuestUser = async (req, res) => {
    const { customerID } = req.params;
    try {
        const allGuestUser = await GuestUser.findAll({
            attributes: ['guest_email', 'guest_name', 'guest_profile_pic', 'is_ban'],
            where: {
                customer_id: customerID,
            },
        });
        res.send(allGuestUser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};



export const banAndUnbanGuestUser = async (req, res) => {
    console.log("banAndUnbanGuestUser")
    try {
        const { guest_email } = req.body;
        console.log("guest_email:", guest_email)

        const guestUser = await GuestUser.findOne({
            where: {
                guest_email: guest_email
            }
        });
        console.log("guestUser:", guestUser)
        if (guestUser.is_ban) {
            guestUser.is_ban = false;
        } else {
            guestUser.is_ban = true;
        }
        await guestUser.save();
        res.send(guestUser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


export const getAllGuestSuggest = async (req, res) => {
    try {
        const allGuestUser = await GuestUserSuggest.findAll(
            {
                where: {
                    customer_id: req.params.customerID,
                },
            }
        );

        for (let i = 0; i < allGuestUser.length; i++) {
            const place = await Place.findOne({
                where: {
                    place_id: allGuestUser[i].place_id,
                },
            });
            const room = await Room.findOne({
                where: {
                    room_id: allGuestUser[i].room_id,
                },
            });

            const gusetUser = await GuestUser.findOne({
                where: {
                    user_id: allGuestUser[i].user_id,
                },
            });

            allGuestUser[i].dataValues.place_name = place.name;
            allGuestUser[i].dataValues.room_name = room.name;
            allGuestUser[i].dataValues.guest_name = gusetUser.guest_name;
            allGuestUser[i].dataValues.guest_profile_pic = gusetUser.guest_profile_pic;
        }

        res.send(allGuestUser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


