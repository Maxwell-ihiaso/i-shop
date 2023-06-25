import { CustomerModel, AddressModel } from '../models';
import {
  ICartProduct,
  ICustomer,
  IOrder,
  IProduct,
  IWishList,
} from '../models/Customer-model';

//Dealing with data base operations
class CustomerRepository {
  async CreateCustomer({ email, password, phone }: any): Promise<ICustomer> {
    const customer = new CustomerModel({
      email,
      password,
      phone,
      address: [],
      cart: [],
      wishlist: [],
      orders: [],
    });

    const customerResult = await customer.save();
    return customerResult;
  }

  async CreateAddress({
    _id,
    street,
    postalCode,
    city,
    country,
  }: any): Promise<ICustomer | undefined> {
    const profile = await CustomerModel.findById(_id);

    if (profile) {
      const newAddress = new AddressModel({
        street,
        postalCode,
        city,
        country,
      });

      await newAddress.save().then((val) => profile.address.push(val._id));
    }

    return await profile?.save();
  }

  async FindCustomer({ email }: any): Promise<ICustomer | null> {
    const existingCustomer = await CustomerModel.findOne({ email: email })
      .populate('address')
      .exec();
    return existingCustomer;
  }

  async FindCustomerById({ id }: any) {
    const existingCustomer = await CustomerModel.findById(id)
      .populate('address')
      .exec();
    return existingCustomer;
  }

  async Wishlist(customerId: string): Promise<IWishList[] | undefined> {
    const profile = await CustomerModel.findById(customerId).populate(
      'wishlist',
    );

    return profile?.wishlist;
  }

  async AddOrRemoveWishlistItem(
    customerId: string,
    { _id, name, description, price, available, banner }: IWishList,
  ) {
    const product = {
      _id,
      name,
      description,
      price,
      available,
      banner,
    };

    const profile = await CustomerModel.findById(customerId).exec();

    if (profile) {
      let wishlist = profile.wishlist;

      if (wishlist.length) {
        let isExist = false;

        for (const item of wishlist) {
          if (item._id.toString() === product._id.toString()) {
            isExist = true;
            const index = wishlist.indexOf(item);
            wishlist.splice(index, 1);
            break;
          }
        }

        if (!isExist) {
          wishlist.push(product as IWishList);
        }
      } else {
        wishlist.push(product as IWishList);
      }

      profile.wishlist = wishlist;
    }

    const profileResult = await profile?.save();

    return profileResult?.wishlist;
  }

  async Cart(customerId: string): Promise<ICartProduct[] | undefined> {
    const profile = await CustomerModel.findById(customerId).exec();

    return profile?.cart;
  }

  async AddOrRemoveCartItem(
    customerId: string,
    { _id, name, price, banner }: IProduct,
    qty: number,
    isRemove: boolean,
  ) {
    const profile = await CustomerModel.findById(customerId).exec();

    if (profile) {
      const cartItem = {
        product: { _id, name, price, banner },
        unit: qty,
      };

      let cartItems = profile.cart;

      if (cartItems.length) {
        let isExist = false;

        for (const [index, item] of cartItems.entries()) {
          if (item.product._id.toString() === _id.toString()) {
            isExist = true;

            if (isRemove) {
              cartItems.splice(index, 1);
              break;
            } else {
              item.unit = qty;
              break;
            }
          }
        }

        if (!isExist) {
          cartItems.push(cartItem as ICartProduct);
        }
      } else {
        cartItems.push(cartItem as ICartProduct);
      }

      profile.cart = cartItems;

      return await profile.save();
    }

    throw new Error('Unable to add to cart!');
  }

  async AddOrderToProfile(customerId: string, order: IOrder) {
    const profile = await CustomerModel.findById(customerId).exec();

    if (profile) {
        
      profile.orders.push(order);

      profile.cart = [];

      const profileResult = await profile.save();

      return profileResult;
    }

    throw new Error('Unable to add to order!');
  }
}

export default CustomerRepository;
