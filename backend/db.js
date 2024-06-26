const config = require("./config");
const mongoose = require("mongoose");

const connection_url = config.mongo_url;

const connect_db = async (res) => {
  try {
    await mongoose.connect(connection_url); // connecting to database
    console.log("mongoo connection established");
    // setting up event listeners
    mongoose.connection.on("connected", () =>
      console.log("connection established")
    );
    mongoose.connection.on("disconnected", () =>
      console.log("disconnected to db")
    );
    mongoose.connection.on("error", (err) => {
      console.error(err);
      res.status(403).json({
        message: "mongo connection error",
      });
    });
    // Close the Mongoose connection when Node.js process ends
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Mongoose connection closed due to application termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("error while connecting to db", error); // checking for errors while initial connection
  }
};

connect_db();

const user_schema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    maxLength: 8,
  },
  first_name: {
    type: String,
    required: [true, "first name is required"],
    lowercase: true,
    trim: true,
    maxLength: 8
  },
  last_name: {
    type: String,
    required: [true, "last name is required"],
    lowercase: true,
    trim: true,
    maxLength: 8
  },
  hashed_password: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    default: function () {
      return this._id;
    },
  },
});

const account_schema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true,
    default: null,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const User = mongoose.model("User", user_schema);
const Accounts = mongoose.model("Accounts", account_schema);

module.exports = {
  User,
  Accounts,
};
