import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: String,
    gender: String,
    birthday: {
      type: Date,
      default: null
    },
    age: Number,
    profilePic: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    favorites: [
      {
        name: String,
        price: Number,
        desc: String,
        img: String,
        category: String,
      },
    ],
    orders: [
      {
        orderItems: [
          {
            name: String,
            qty: Number,
            price: Number,
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref: "MenuItem", // assuming you’ll have a MenuItem model later
            },
          },
        ],
        totalAmount: Number,
        paymentMethod: String,
        status: String,
      },
    ],
    savedCards: [
      {
        name: String,
        last4: String,
        expMonth: String,
        expYear: String,
        brand: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate age from birthday
userSchema.methods.calculateAge = function () {
  if (!this.birthday) return null;
  const today = new Date();
  const birthDate = new Date(this.birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Pre-save middleware to calculate age when birthday is updated
userSchema.pre("save", async function (next) {
  if (this.isModified("birthday") && this.birthday) {
    this.age = this.calculateAge();
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
