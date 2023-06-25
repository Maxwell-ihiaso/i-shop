import { CustomerRepository } from '../database';
import { signAccessToken, signRefreshToken } from '../utils';

// All Business logic will be here
class CustomerService {
  private repository;

  public constructor() {
    this.repository = new CustomerRepository();
  }

  async SignIn(userInputs: { email: string; password: string }) {
    const { email, password } = userInputs;

    const existingCustomer = await this.repository.FindCustomer({ email });

    if (existingCustomer) {
      const validPassword = await existingCustomer.isValidPassword(password);

      if (validPassword) {
        const accessToken = await signAccessToken(
          existingCustomer._id,
          existingCustomer.roles,
        );
        const refreshToken = await signRefreshToken(
          existingCustomer._id,
          existingCustomer.roles,
        );
        return {
          id: existingCustomer._id,
          roles: existingCustomer.roles,
          accessToken,
          refreshToken,
        };
      }
    }

    return null;
  }

  async SignUp(userInputs: { email: string; password: string; phone: string }) {
    const { email, password, phone } = userInputs;

    const existingCustomer = await this.repository.CreateCustomer({
      email,
      password,
      phone,
    });

    return { id: existingCustomer._id, roles: existingCustomer.roles };
  }

  async AddNewAddress(
    _id: string,
    userInputs: {
      street: string;
      postalCode: any;
      city: string;
      country: string;
    },
  ) {
    const { street, postalCode, city, country } = userInputs;

    const addressResult = await this.repository.CreateAddress({
      _id,
      street,
      postalCode,
      city,
      country,
    });

    return addressResult;
  }

  async GetProfile(id: string) {
    const existingCustomer = await this.repository.FindCustomerById({ id });
    return existingCustomer;
  }

  //Revisit shopping details
  async GetShopingDetails(id: string) {
    const existingCustomer = await this.repository.FindCustomerById({ id });

    if (existingCustomer) {
      // const orders = await this.shopingRepository.Orders(id);
      return existingCustomer;
    }
    return null;
  }

  async GetWishList(customerId: string) {
    const wishListItems = await this.repository.Wishlist(customerId);
    return wishListItems;
  }

  async AddOrRemoveWishlist(customerId: string, product: any) {
    const wishlistResult = await this.repository.AddOrRemoveWishlistItem(
      customerId,
      product,
    );
    return wishlistResult;
  }

  async GetCart(customerId: string) {
    const cart = await this.repository.Cart(customerId);
    return cart;
  }

  async ManageCart(
    customerId: string,
    product: any,
    qty: number,
    isRemove: boolean,
  ) {
    const cartResult = await this.repository.AddOrRemoveCartItem(
      customerId,
      product,
      qty,
      isRemove,
    );
    return cartResult;
  }

  async GetOrders(customerId: string) {
    const orders = await this.repository.Orders(customerId);
    return orders;
  }

  async ManageOrder(customerId: string, order: any) {
    const orderResult = await this.repository.AddOrderToProfile(
      customerId,
      order,
    );
    return orderResult;
  }

  //   async SubscribeEvents(payload) {
  //     console.log('Triggering.... Customer Events');

  //     payload = JSON.parse(payload);

  //     const { event, data } = payload;

  //     const { userId, product, order, qty } = data;

  //     switch (event) {
  //       case 'ADD_TO_WISHLIST':
  //       case 'REMOVE_FROM_WISHLIST':
  //         this.AddToWishlist(userId, product);
  //         break;
  //       case 'ADD_TO_CART':
  //         this.ManageCart(userId, product, qty, false);
  //         break;
  //       case 'REMOVE_FROM_CART':
  //         this.ManageCart(userId, product, qty, true);
  //         break;
  //       case 'CREATE_ORDER':
  //         this.ManageOrder(userId, order);
  //         break;
  //       default:
  //         break;
  //     }
  //   }
}

module.exports = CustomerService;
