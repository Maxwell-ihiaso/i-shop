import { IProduct, Product } from '../models'

export default class ProductRepository {
  async Products(): Promise<IProduct[]> {
    const products = await Product.find()
    return products
  }

  async CreateProduct(product: IProduct): Promise<IProduct> {
    const newProduct = new Product(product)
    return await newProduct.save()
  }

  async FindById(id: string): Promise<IProduct | null> {
    const product = await Product.findById(id).exec()
    return product
  }

  async FindByCategory(category: string): Promise<IProduct[]> {
    const products = await Product.find({ type: category }).exec()
    return products
  }

  async FindSelectedProducts(selectedIds: string[]): Promise<IProduct[]> {
    const products = await Product.find({ _id: { $in: selectedIds } }).exec()
    return products
  }
}
