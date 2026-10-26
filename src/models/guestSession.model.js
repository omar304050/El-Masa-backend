
import mongoose from "mongoose";

const guestSessionSchema = new mongoose.Schema(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const GuestSession = mongoose.model(
  "GuestSession",
  guestSessionSchema
);

export default GuestSession;
