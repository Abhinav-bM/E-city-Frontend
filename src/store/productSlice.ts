import { getProducts } from "@/api/product";
import { ProductsFilter } from "@/models/shop";
import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
  data: any[];
  status: string;
  hasMore: boolean;
  filter: ProductsFilter;
  facets: {
    brands: string[];
    conditions: string[];
    minPrice: number;
    maxPrice: number;
  };
}

export const initialState: initialStateType = {
  data: [],
  status: "loading",
  hasMore: false,
  filter: {
    page: 1,
    limit: 12,
  },
  facets: {
    brands: [],
    conditions: [],
    minPrice: 0,
    maxPrice: 5000,
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
      const { filter, products, facets } = action.payload;
      state.filter = filter;
      state.status = "idle";

      if (Number(filter.page) === 1) {
        state.data = [...products];
      } else {
        state.data = [...state.data, ...products];
      }

      if (facets) {
        state.facets = facets;
      }
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
            facets: data.facets,
          }),
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
