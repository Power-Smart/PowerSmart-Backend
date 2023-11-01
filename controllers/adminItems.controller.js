import Item from "../models/item.model.js";

export const getItemsView = async (req, res) => {
    try {
        const items = await Item.findAll({
            order: [['item_id', 'ASC']]
        });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
