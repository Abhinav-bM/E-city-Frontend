import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/api/wishlist";

interface WishlistState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWishlist();
      return response.data; // Array of wishlist items
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch wishlist",
      );
    }
  },
);

export const toggleWishlistItem = createAsyncThunk(
  "wishlist/toggleItem",
  async (
    { productId, isWishlisted }: { productId: string; isWishlisted: boolean },
    { rejectWithValue },
  ) => {
    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
        return { productId, action: "removed" };
      } else {
        const response = await addToWishlist(productId);
        return { productId, action: "added", item: response.data };
      }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update wishlist",
      );
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        if (action.payload.action === "removed") {
          state.items = state.items.filter(
            (item) =>
              (item.productId?._id || item.productId) !==
              action.payload.productId,
          );
        } else if (action.payload.action === "added") {
          // Typically response returns the full item, or we fetch it later.
          // For immediate UI update, we push a minimal stub or fetch all.
          // It's safest to just push what we got:
          state.items.push(action.payload.item);
        }
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
