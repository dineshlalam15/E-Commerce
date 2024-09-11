import Merchant from '../models/merchant.model.js';
import User from '../models/user.model.js';

const createMerchantAccount = async (req, res) => {
  try {
    const findUser = await User.findById(req.user._id);
    const { storeName } = req.body;
    const existedMerchant = await Merchant.findOne({ email: req.user.email });
    if (existedMerchant) {
      return res
        .status(400)
        .json({ error: 'Mechant with this email Id already exists ' });
    }
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
    (findUser.merchant = merchantProfile), (findUser.role = 'merchant');
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

const disableMerchantAccount = async (req, res) => {
  try {
    await Merchant.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isActive: false,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: 'Merchant account deactivated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error ' });
  }
};

const deleteMerchantAccount = async (req, res) => {
  try {
    await Merchant.deleteOne({ _id: req.params.id });
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          role: 'user',
        },
      },
      { new: true }
    );
    return res.status(200).json({ message: 'Merchant successfully deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error ' });
  }
};

export { createMerchantAccount, disableMerchantAccount, deleteMerchantAccount };
