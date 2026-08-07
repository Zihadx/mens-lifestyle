import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface RecentlyViewedItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
}

const MAX_ITEMS = 12;

const initialState: RecentlyViewedState = { items: [] };

const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState,
  reducers: {
    trackProductView: (state, action: PayloadAction<RecentlyViewedItem>) => {
      state.items = [action.payload, ...state.items.filter((item) => item.productId !== action.payload.productId)].slice(
        0,
        MAX_ITEMS
      );
    },
    clearRecentlyViewed: (state) => {
      state.items = [];
    },
  },
});

export const { trackProductView, clearRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;

export const selectRecentlyViewed = (state: { recentlyViewed: RecentlyViewedState }) => state.recentlyViewed.items;
