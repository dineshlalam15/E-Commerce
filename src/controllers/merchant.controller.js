import Merchant from '../models/merchant.model.js';
import User from '../models/user.model.js';

const createMerchantAccount = async (req, res) => {
  try {
    const findUser = await User.findById(req.user._id);
    const { storeName } = req.body;
    const merchantProfile = await Merchant.create({
      name: {
        firstName: findUser.name.firstName,
        lastName: findUser.name.lastName ? findUser.name.lastName : undefined,
      },
      email: findUser.email,
      phoneNo: findUser.phoneNo ? findUser.phoneNo : undefined,
      isActive: true,
      storeName: storeName,
      status: 'approvalInProgress',
    });
    findUser.merchant = merchantProfile,
    findUser.save({ validateBeforeSave: false });
    return res.status(201).json({
      message: 'Merchant Account Created',
      details: merchantProfile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { createMerchantAccount };
