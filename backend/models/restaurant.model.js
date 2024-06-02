import mongoose from "mongoose";

const resturentSchema = new mongoose.Schema(
  {
    cusReturentID: {
      type: "string",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timeStamps: true }
);

const Resturent = mongoose.model("resturents", resturentSchema);

export default Resturent;
