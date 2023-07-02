import { IProduct, Product } from '../models'

export default class ProductRepository {
  /**
   * Retrieves a list of products.
   *
   * @return {Promise<IProduct[]>} The list of products.
   */
  async Products(): Promise<IProduct[]> {
    const products = await Product.find()
    return products
  }

  /**
   * Creates a new product.
   *
   * @param {IProduct} product - The product to be created.
   * @return {Promise<IProduct>} The newly created product.
   */
  async CreateProduct(product: IProduct): Promise<IProduct> {
    const newProduct = new Product(product)
    return await newProduct.save()
  }

  /**
   * Find a product by its ID.
   *
   * @param {string} id - The ID of the product.
   * @return {Promise<IProduct | null>} The found product, or null if not found.
   */
  async FindById(id: string): Promise<IProduct | null> {
    const product = await Product.findById(id).exec()
    return product
  }

  /**
   * Find products by category.
   *
   * @param {string} category - The category to search for.
   * @return {Promise<IProduct[]>} The products found.
   */
  async FindByCategory(category: string): Promise<IProduct[]> {
    const products = await Product.find({ type: category }).exec()
    return products
  }

  /**
   * Find selected products based on the given array of IDs.
   *
   * @param {string[]} selectedIds - Array of selected product IDs.
   * @return {Promise<IProduct[]>} Promise that resolves to an array of selected products.
   */
  async FindSelectedProducts(selectedIds: string[]): Promise<IProduct[]> {
    const products = await Product.find({ _id: { $in: selectedIds } }).exec()
    return products
  }
}
