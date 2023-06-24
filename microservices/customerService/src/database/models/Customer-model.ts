import mongoose, { Document, Model, Schema } from 'mongoose';
import { GeneratePassword, GenerateSalt, ValidatePassword } from '../../utils';

interface IProduct extends Document {
  _id: string;
  name: string;
  banner: string;
  price: number;
}

interface ICartProduct extends Document {
  product: IProduct;
  unit: number;
}

interface IWishList extends Document {
  _id: string;
  name: string;
  description: string;
  banner: string;
  available: boolean;
  price: number;
}

interface IOrder extends Document {
  _id: string;
  amount: string;
  date: Date;
}

interface ICustomer extends Document {
  email: string;
  password: string;
  salt: string;
  phone: string;
  address: string[];
  cart: ICartProduct[];
  wishlist: IWishList[];
  orders: IOrder[];
  roles: number[];
  image: string;
}

const WishListSchema: Schema<IWishList> = new Schema({
  _id: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  banner: { type: String },
  available: { type: Boolean },
  price: { type: Number },
});

const ProductSchema: Schema<IProduct> = new Schema({
  _id: { type: String, required: true },
  name: { type: String },
  banner: { type: String },
  price: { type: Number },
});

const CartProductSchema: Schema<ICartProduct> = new Schema({
  product: { type: ProductSchema, required: true },
  unit: { type: Number, required: true },
});

const OrderSchema: Schema<IOrder> = new Schema({
  _id: { type: String, required: true },
  amount: { type: String },
  date: { type: Date, default: Date.now() },
});

const CustomerSchema: Schema<ICustomer> = new Schema(
  {
    email: String,
    password: String,
    phone: String,
    address: [{ type: Schema.Types.ObjectId, ref: 'address', required: true }],
    cart: [CartProductSchema],
    wishlist: [WishListSchema],
    orders: [OrderSchema],
    roles: [
      {
        type: Number,
        default: 2001,
      },
    ],
    image: { type: String },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
    timestamps: true,
  },
);

CustomerSchema.pre('save', async function (next) {
  if (!this.isModified(this.password)) next();
  else {
    const hash = await GenerateSalt(10);
    const hashedPassword = await GeneratePassword(this.password, hash);
    this.password = hashedPassword;
    next();
  }
});

CustomerSchema.methods.isValidPassword = async function (password: string) {
  return await ValidatePassword(password, this.password);
};

const CustomerModel: Model<ICustomer> = mongoose.model<ICustomer>(
  'customer',
  CustomerSchema,
);

export default CustomerModel;
