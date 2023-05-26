import { createSlice } from "@reduxjs/toolkit";

interface IProductStore {
  [key: string]: string | string[] | number | Date | boolean;
}

interface IInitialState {
  products: IProductStore[];
  quantity: number;
  total: number;
}

interface IActionProps {
  payload: IProductStore;
  type: string;
}

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state: IInitialState, action: IActionProps) => {
      const isExisting = state.products.find(
        (item) => item._id === action.payload._id
      );

      if (isExisting) {
        isExisting.quantity = Number(isExisting.quantity) + 1;
      } else {
        state.quantity += 1;
        state.products.push(action.payload);
      }
      state.total = state.products.reduce(
        (acc, product) =>
          (acc += Number(product.price) * Number(product.quantity)),
        0
      );
    },
    addUnit: (state: IInitialState, action: IActionProps) => {
      state.products.map((product) => {
        if (product._id === action.payload._id) {
          product.quantity = Number(product.quantity) + 1;
        }
      });
      state.total = state.products.reduce(
        (acc, product) =>
          (acc += Number(product.price) * Number(product.quantity)),
        0
      );
    },
    removeProduct: (state: IInitialState, action: IActionProps) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload._id
      );
      state.quantity -= 1;
      state.total = state.products.reduce(
        (acc, prod) => (acc += Number(prod.price) * Number(prod.quantity)),
        0
      );
    },
    removeUnit: (state: IInitialState, action: IActionProps) => {
      state.products.map((product) => {
        if (product._id === action.payload._id) {
          product.quantity = Number(product.quantity) - 1;
        }
      });

      state.total = state.products.reduce(
        (acc, prod) => (acc += Number(prod.price) * Number(prod.quantity)),
        0
      );
    },
  },
});

export const { addProduct, addUnit, removeProduct, removeUnit } =
  cartSlice.actions;
export default cartSlice.reducer;
