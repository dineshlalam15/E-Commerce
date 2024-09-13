import Merchant from '../models/merchant.model.js';
import User from '../models/user.model.js';
import { deleteFromAzure } from '../utils/azure.js';
import { isEmpty } from '../utils/validation.js';

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find()
      .sort({
        createdAt: -1,
      })
      .select('-password');
    return res.status(200).json({
      message: 'All Users details fetched succesfully',
      Details: allUsers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const findUser = await User.findById(req.params.id);
    const imageURL = findUser.avatar;
    if (!isEmpty(imageURL)) {
      deleteFromAzure(imageURL);
    }
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllMerchants = async (req, res) => {
  try {
    const allMerchants = await Merchant.find().sort({ createdAt: -1 }).select('-password');
    return res.status(200).json({
      message: 'All merchants details fetched successfully',
      details: allMerchants,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteMerchant = async (req, res) => {
  try {
    await Merchant.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Merchant account deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).status({ error: 'Internal Server Error' });
  }
};

export { getAllUsers, deleteUser, getAllMerchants, deleteMerchant };
