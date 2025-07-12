import { createSlice } from '@reduxjs/toolkit';

const initialState = { user: null, isAuthenticated: false, loading: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload; },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logoutUser: (state) => ({ ...initialState, loading: false }),
  },
});

export const { setUser, logoutUser, setLoading } = authSlice.actions;
export default authSlice.reducer;