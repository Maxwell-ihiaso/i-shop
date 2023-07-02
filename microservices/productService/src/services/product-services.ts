import { ProductRepository } from '@/database'
import { IProduct } from '@/database/models'

export default class ProductService {
  private readonly repository

  constructor() {
    this.repository = new ProductRepository()
  }

  /**
   * Create a product.
   *
   * @param {IProduct} product - The product to be created.
   * @return {Promise<IProduct>} The created product.
   */
  async CreateProduct(product: IProduct): Promise<IProduct> {
    return await this.repository.CreateProduct(product)
  }

  /**
   * GetProducts is an asynchronous function that retrieves a list of products.
   *
   * @return {Promise<IProduct[]>} A promise that resolves to an array of IProduct objects representing the products.
   */
  async GetProducts(): Promise<IProduct[]> {
    return await this.repository.Products()
  }

  /**
   * Retrieves products and categories.
   *
   * @return {Promise<{
   *   products: IProduct[],
   *   categories: string[]
   * }>} A promise that resolves to an object containing the products and categories.
   */
  async GetProductsAndCategories(): Promise<{
    products: IProduct[]
    categories: string[]
  }> {
    const products = await this.repository.Products()

    const categories = [...new Set(products.map(({ type }) => type))]

    return { products, categories }
  }

  /**
   * Retrieves a product by its ID.
   *
   * @param {string} productId - The ID of the product.
   * @return {Promise<IProduct | null>} A promise that resolves to the product if found, or null if not found.
   */
  async GetProductById(productId: string): Promise<IProduct | null> {
    return await this.repository.FindById(productId)
  }

  /**
   * Get products by category.
   *
   * @param {string} category - The category of the products.
   * @return {Promise<IProduct[]>} A promise that resolves to an array of products.
   */
  async GetProductsByCategory(category: string): Promise<IProduct[]> {
    return await this.repository.FindByCategory(category)
  }

  /**
   * Retrieves a list of products based on the provided IDs.
   *
   * @param {string[]} ids - The IDs of the products to retrieve.
   * @return {Promise<IProduct[]>} A promise that resolves to an array of products.
   */
  async GetProductsFromSelectedIds(ids: string[]): Promise<IProduct[]> {
    return await this.repository.FindSelectedProducts(ids)
  }

  /**
   * Retrieves the payload for a product.
   *
   * @param {string} userId - The ID of the user.
   * @param {Object} payload - The payload object.
   * @param {string} payload.productId - The ID of the product.
   * @param {number} payload.qty - The quantity of the product.
   * @param {string} event - The event.
   * @return {Promise<null | {
   *   event: string;
   *   data: {
   *     userId: string;
   *     product: IProduct;
   *     qty: number;
   *   };
   * }>} The payload object or null if the product is not found.
   */
  async GetProductPayload(
    userId: string,
    { productId, qty = 1 }: { productId: string; qty?: number },
    event: string
  ): Promise<{
    event: string
    data: {
      userId: string
      product: IProduct
      qty?: number
    }
  } | null> {
    const product = await this.repository.FindById(productId)

    if (product) {
      const payload = {
        event: event,
        data: { userId, product, qty }
      }

      return payload
    } else {
      return null
    }
  }
}
