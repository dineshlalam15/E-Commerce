import User from '../models/user.model.js';

const checkAdmin = async (req, res, next) => {
  try {
    const findUser = await User.findById(req.user._id);
    if (!findUser) {
      return res.status(404).json({ error: "User doesn't exist" });
    }
    if (findUser.role !== 'admin') {
      return res.status(403).json({ error: 'Access Denied' });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { checkAdmin };
