import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchStockQuote = createAsyncThunk(
  'stocks/fetchQuote',
  async (symbol) => {
    const response = await axios.get(`${API_URL}/stocks/quote/${symbol}`);
    return response.data;
  }
);

export const fetchMultipleQuotes = createAsyncThunk(
  'stocks/fetchMultipleQuotes',
  async (symbols) => {
    const response = await axios.get(`${API_URL}/stocks/quotes`, {
      params: { symbols: symbols.join(',') }
    });
    return response.data;
  }
);

const stocksSlice = createSlice({
  name: 'stocks',
  initialState: {
    quotes: {},
    watchlist: [],
    loading: false,
    error: null,
  },
  reducers: {
    addToWatchlist: (state, action) => {
      if (!state.watchlist.includes(action.payload)) {
        state.watchlist.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action) => {
      state.watchlist = state.watchlist.filter(symbol => symbol !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockQuote.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming the API returns data with symbol as key
        Object.assign(state.quotes, action.payload);
      })
      .addCase(fetchStockQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMultipleQuotes.fulfilled, (state, action) => {
        Object.assign(state.quotes, action.payload);
      });
  },
});

export const { addToWatchlist, removeFromWatchlist } = stocksSlice.actions;
export default stocksSlice.reducer;