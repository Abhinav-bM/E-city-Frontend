import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart as getCartAPI,
  addToCart as addToCartAPI,
  removeFromCart as removeFromCartAPI,
  updateCartItem as updateCartItemAPI,
  clearCart as clearCartAPI,
} from "../api/cart";
import { toast } from "react-hot-toast";

interface CartItem {
  _id: string;
  productVariantId: {
    images: any;
    _id: string;
    baseProductId: {
      _id: string;
      title: string;
      slug: string;
      images: { url: string; _id?: string }[];
      brand: string;
      category: string;
    };
    attributes: Record<string, string>;
    sellingPrice: number;
    compareAtPrice?: number;
    inventoryType: "Quantity" | "Unique";
    condition: string;
    stock: number;
  };
  quantity: number;
  priceAtAdd: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  loading: false,
  error: null,
};

// Async Thunks

export const fetchCartHook = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCartAPI();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

export const addItemToCartHook = createAsyncThunk(
  "cart/addItem",
  async (
    {
      baseProductId,
      variantId,
      quantity,
    }: { baseProductId: string; variantId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await addToCartAPI(baseProductId, variantId, quantity);
      // toast.success("Added to cart"); // Handled in UI with View Cart action
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add item");
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const updateItemQuantityHook = createAsyncThunk(
  "cart/updateItem",
  async (
    { variantId, quantity }: { variantId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateCartItemAPI(variantId, quantity);
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const removeItemHook = createAsyncThunk(
  "cart/removeItem",
  async (variantId: string, { rejectWithValue }) => {
    try {
      const response = await removeFromCartAPI(variantId);
      toast.success("Item removed");
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove item");
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const clearCartHook = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await clearCartAPI();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder.addCase(fetchCartHook.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCartHook.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.subtotal || 0;
        state.totalItems = action.payload.totalItems || 0;
      } else {
        state.items = [];
        state.totalAmount = 0;
        state.totalItems = 0;
      }
    });
    builder.addCase(fetchCartHook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add Item (updates whole cart from response)
    builder.addCase(addItemToCartHook.fulfilled, (state, action) => {
      state.items = action.payload.items;
      state.totalAmount = action.payload.subtotal;
      state.totalItems = action.payload.totalItems;
    });

    // Update Item
    builder.addCase(updateItemQuantityHook.fulfilled, (state, action) => {
      state.items = action.payload.items;
      state.totalAmount = action.payload.subtotal;
      state.totalItems = action.payload.totalItems;
    });

    // Remove Item
    builder.addCase(removeItemHook.fulfilled, (state, action) => {
      if (action.payload) {
        state.items = action.payload.items;
        state.totalAmount = action.payload.subtotal;
        state.totalItems = action.payload.totalItems;
      } else {
        state.items = [];
        state.totalAmount = 0;
        state.totalItems = 0;
      }
    });

    // Clear Cart
    builder.addCase(clearCartHook.fulfilled, (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
