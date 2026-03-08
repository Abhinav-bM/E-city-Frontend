import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
    { variantId, isWishlisted }: { variantId: string; isWishlisted: boolean },
    { dispatch, rejectWithValue },
  ) => {
    try {
      if (isWishlisted) {
        await removeFromWishlist(variantId);
        dispatch(fetchWishlist());
        return { variantId, action: "removed" };
      } else {
        const response = await addToWishlist(variantId);
        dispatch(fetchWishlist());
        return { variantId, action: "added", item: response.data };
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

      .addCase(toggleWishlistItem.fulfilled, () => {
        // Optimistic/manual array manipulation removed;
        // We now rely on `dispatch(fetchWishlist())` side-effect explicitly fetching fresh data.
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
