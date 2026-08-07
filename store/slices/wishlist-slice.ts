import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = { items: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlistItem: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.some((item) => item.productId === action.payload.productId);
      if (exists) {
        state.items = state.items.filter((item) => item.productId !== action.payload.productId);
      } else {
        state.items.unshift(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<{ productId: string }>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload.productId);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { toggleWishlistItem, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items;
export const selectIsWishlisted = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.items.some((item) => item.productId === productId);
export const selectWishlistCount = (state: { wishlist: WishlistState }) => state.wishlist.items.length;
