import { configureStore } from '@reduxjs/toolkit';
import stocksReducer from './features/stocks/stocksSlice';
import scansReducer from './features/scans/scansSlice';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    stocks: stocksReducer,
    scans: scansReducer,
    auth: authReducer,
  },
});