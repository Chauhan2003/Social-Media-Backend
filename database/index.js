import mongoose, { mongo } from "mongoose";

const db_connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connection established");
  } catch (err) {
    console.log("Error connecting to Mongoose database " + err.message);
  }
};

export default db_connection;
