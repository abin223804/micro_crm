import mongoose from "mongoose";
import Organization from "./Organization";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true },
    OrganizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Organization,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
