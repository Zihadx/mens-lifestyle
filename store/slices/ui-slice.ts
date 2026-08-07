import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isMobileNavOpen: boolean;
  isSearchOpen: boolean;
  isFilterDrawerOpen: boolean;
  isCommandMenuOpen: boolean;
  activeQuickViewProductId: string | null;
}

const initialState: UIState = {
  isMobileNavOpen: false,
  isSearchOpen: false,
  isFilterDrawerOpen: false,
  isCommandMenuOpen: false,
  activeQuickViewProductId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMobileNavOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileNavOpen = action.payload;
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },
    setFilterDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterDrawerOpen = action.payload;
    },
    setCommandMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isCommandMenuOpen = action.payload;
    },
    openQuickView: (state, action: PayloadAction<string>) => {
      state.activeQuickViewProductId = action.payload;
    },
    closeQuickView: (state) => {
      state.activeQuickViewProductId = null;
    },
  },
});

export const {
  setMobileNavOpen,
  setSearchOpen,
  setFilterDrawerOpen,
  setCommandMenuOpen,
  openQuickView,
  closeQuickView,
} = uiSlice.actions;
export default uiSlice.reducer;

export const selectUI = (state: { ui: UIState }) => state.ui;
