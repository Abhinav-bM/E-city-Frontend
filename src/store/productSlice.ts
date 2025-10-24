import { getProducts } from "@/api/product";
import { ProductsFilter } from "@/models/shop";
import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
  data: any[];
  status: string;
  hasMore: boolean;
  filter: ProductsFilter;
}

export const initialState: initialStateType = {
  data: [],
  status: "loading",
  hasMore: false,
  filter: {
    page: 1,
    page_size: 18,
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    fetchProductsStart: (state: any) => {
      state.status = "loading";
    },
    fetchProductsFailure: (state) => {
      state.status = "idle";
    },
    fetchProductsSuccess: (state, action) => {
      const { filter, products } = action.payload;
      state.filter = filter;
      state.status = "idle";
      state.data = [...products];
    },
  },
});

// Fetch
export const fetchProducts = (filter: any) => {
  return async (dispatch: any) => {
    dispatch(fetchProductsStart());
    try {
      const response = await getProducts(filter);
      if (response.data) {
        const { data } = response.data;
        dispatch(
          fetchProductsSuccess({
            filter: data.pagination,
            products: data.products,
          })
        );
      }
    } catch (error) {
      console.error(error);
      dispatch(fetchProductsFailure());
    }
  };
};

export const {
  fetchProductsStart,
  fetchProductsFailure,
  fetchProductsSuccess,
} = productSlice.actions;

export const selectProduct = (state: any) => state.product;
export const selectFilters = (state: any) => state.product.filter;

export default productSlice.reducer;
