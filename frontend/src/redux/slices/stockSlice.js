import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},  // e.g., { symbol: { candles: [], report: {} }}
  scans: { atr: false, ma: true, rsi: false },  // Toggles for scans (expand later)
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStockData: (state, action) => {
      state.data[action.payload.symbol] = action.payload.data;
    },
    toggleScan: (state, action) => {
      state.scans[action.payload.scanName] = action.payload.enabled;
    },
  },
});

export const { setStockData, toggleScan } = stockSlice.actions;
export default stockSlice.reducer;