import Customer from "../models/customer.model.js";
import User from "../models/user.model.js";

export const getUser = async (req, res) => {
    let id = req.params.id;
    try {
        const user = await User.findByPk(id);
        const customer = await Customer.findByPk(id);

        customer.dataValues.first_name = user.dataValues.first_name;
        customer.dataValues.last_name = user.dataValues.last_name;
        
        res.send(customer);
    } catch (e) {
        res.status(500).send(e);
    }
};



export const completeCustomerProfile = async (req, res) => {
    const { firstName, lastName, address, user_id } = req.body;

    console.log(req.body);

    try {
        const customer = await Customer.create({
            user_id: user_id,
            first_name: firstName,
            last_name: lastName,
            address: address
        });
        res.status(201).send(customer);
        console.log("Customer Profile Complete Successfully.");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error Profile Complete.");
    }
}


export const updateCustomerProfile = async (req, res) => {
    const id = req.params.id;
    const { name, tel_no, address } = req.body;
    try {
        const customer = await Customer.findByPk(id);
        customer.tel_no = tel_no;
        customer.address = address;
        await customer.save();
        const user = await User.findByPk(id);
        user.name = name;
        await user.save();
        res.status(200).send(customer);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating profile");
    }
};



export const saveProfile = async (req, res) => {
    console.log(req.file)

    try{
        await Customer.update({profile_pic:`customer/${req.file.originalname}`},{
            where:{
                user_id:17
            }
        })
        res.status(200).send("Insert Profile into db");
    }catch(error){
        console.log(error);
    }
};

export const deleteProfile = async (req,res) => {
    try{
        await Customer.update({profile_pic:null},{
            where:{
                user_id:17
            }
        })
        res.status(200).send("Remove the profile picture");
    }catch(error){
        console.log(error);
    }
}