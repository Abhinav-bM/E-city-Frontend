import { getProducts } from "@/api/product";
import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  data: [],
  status: "loading",
  hasMore: false,
  filter: {
    page: 1,
    size: 18,
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.state = "loading";
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
export const fetchProducts = (filter) => {
  return async (dispatch) => {
    dispatch(fetchProductsStart(filter.page === 1));

    try {
      const response = await getProducts(filter);
      if (response.data) {
        const { data } = response.data;
        dispatch(
          fetchProductsSuccess({
            filter,
            products: data,
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

export const selectProduct = (state) => state.product;
export const selectFilters = (state) => state.product.filter;

export default productSlice.reducer;
