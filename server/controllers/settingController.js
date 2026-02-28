import User from "../models/User.js";
import bcrypt from "bcrypt";

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // user id middleware se lo
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Wrong old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Setting error" });
  }
};

export { changePassword };