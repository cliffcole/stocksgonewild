import { createSlice } from '@reduxjs/toolkit';

const scansSlice = createSlice({
  name: 'scans',
  initialState: {
    activeScan: null,
    scanResults: [],
    savedScans: [],
  },
  reducers: {
    setActiveScan: (state, action) => {
      state.activeScan = action.payload;
    },
    setScanResults: (state, action) => {
      state.scanResults = action.payload;
    },
    saveScan: (state, action) => {
      state.savedScans.push(action.payload);
    },
  },
});

export const { setActiveScan, setScanResults, saveScan } = scansSlice.actions;
export default scansSlice.reducer;