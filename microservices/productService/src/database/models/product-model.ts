import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  desc: string
  banner: string
  type: string
  unit: number
  price: number
  available: boolean
  supplier: string
}

const ProductSchema: Schema<IProduct> = new Schema<IProduct>({
  name: { type: String, lowercase: true, required: true },
  desc: String,
  banner: {
    type: String,
    default: 'https://bubbleerp.sysfosolutions.com/img/default-pro.jpg'
  },
  type: { type: String, lowercase: true, required: true },
  unit: { type: Number, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, required: true },
  supplier: { type: String, lowercase: true, required: true }
})

export default mongoose.model<IProduct>('Product', ProductSchema)
