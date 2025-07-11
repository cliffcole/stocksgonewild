import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configure axios to send cookies
axios.defaults.withCredentials = true;

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async () => {
    const response = await axios.get(`${API_URL}/auth/status`);
    return response.data;
  }
);

export const initiateLogin = createAsyncThunk(
  'auth/login',
  async () => {
    const response = await axios.get(`${API_URL}/auth/login`);
    return response.data;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await axios.post(`${API_URL}/auth/logout`);
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    loading: true,
    error: null,
    authUrl: null,
    expiresAt: null
  },
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.expiresAt = action.payload.expiresAt;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(initiateLogin.fulfilled, (state, action) => {
        state.authUrl = action.payload.authUrl;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.expiresAt = null;
      });
  }
});

export const { setAuthenticated } = authSlice.actions;
export default authSlice.reducer;