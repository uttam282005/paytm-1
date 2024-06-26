const express = require("express");
const user_authentication = require("../middlewares/auth");
const { User, Accounts } = require("../db");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/balance", user_authentication, async (req, res) => {
  try {
    const userId = req.user_id;
    console.log(userId);
    const user_account = await Accounts.findOne({ user_id: userId }).populate(
      "user_id"
    );
    console.log(user_account);
    if (!user_account)
      return res.status(411).json({
        message: "user not found",
        success: false,
      });
    res.status(200).json({
      balance: user_account.balance,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      message: error,
      success: false,
    });
  }
});
router.post("/transfer", user_authentication, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { send_from_id, send_to_id, amount } = req.body;
    session.startTransaction();
    const send_from = await Accounts.findOne({ user_id: send_from_id }).session(
      session
    );
    if (send_from.balance < amount) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(411).json({
        message: "not enough balance",
        success: false,
      });
    }
    send_from.balance -= amount;
    const send_to = await Accounts.findOneAndUpdate(
      { user_id: send_to_id },
      { $inc: { balance: amount } }
    ).session(session);
    await send_from.save({ session });
    await send_to.save();
    await session.commitTransaction();
    await session.endSession();
    return res.status(200).json({
      message: "transaction successful",
      success: true,
    });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    await session.endSession();
    return res.status(403).json({
      message: error,
      success: false,
    });
  }
});
module.exports = router;
