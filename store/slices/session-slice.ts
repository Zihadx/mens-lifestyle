import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "customer" | "staff" | "moderator" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatarUrl?: string;
}

interface SessionState {
  user: SessionUser | null;
  status: "unauthenticated" | "authenticated" | "loading";
}

const initialState: SessionState = {
  user: null,
  status: "unauthenticated",
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSessionLoading: (state) => {
      state.status = "loading";
    },
    setSessionUser: (state, action: PayloadAction<SessionUser>) => {
      state.user = action.payload;
      state.status = "authenticated";
    },
    clearSession: (state) => {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
});

export const { setSessionLoading, setSessionUser, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;

export const selectSessionUser = (state: { session: SessionState }) => state.session.user;
export const selectIsAuthenticated = (state: { session: SessionState }) => state.session.status === "authenticated";
export const selectUserRole = (state: { session: SessionState }) => state.session.user?.role ?? null;
