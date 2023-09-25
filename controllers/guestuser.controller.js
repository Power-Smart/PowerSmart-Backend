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

export const getGuestUserSuggest = async (req, res) => {
    try {
        const {customerID} = req.params;
        console.log("customerID:",customerID)

        const guestUserSuggests = await GuestUser.findOne({
            where:{
                customer_id:customerID
            }
        });
        res.send(guestUserSuggests);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
