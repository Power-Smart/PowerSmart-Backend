import GuestUser from "../models/guestUser.model.js";


export const addGuestUserSuggest = async (req, res) => {
    const {customerID,selectedOption} = req.body

    try {
        const guestUserSuggest = await GuestUser.create({
            suggest: selectedOption,
            customer_id: customerID,
        });
        res.status(201).send(guestUserSuggest);
    } catch (error) {
        console.log(error);
    }
};
