import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  name: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
