import MarketPlace from "../models/marketPlace.model.js";


export const getMarketPlaceItems = async (req, res) => {
    try {
        const items = await MarketPlace.findAll();
        res.status(200).json(items);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
