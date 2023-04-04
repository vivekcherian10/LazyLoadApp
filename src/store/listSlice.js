// import statements
import { createSlice } from "@reduxjs/toolkit";

// initial states
const initialState = {
  listItems: [],
  searchResults: [],
  currentPage: 1,
  showLoader: false,
};

export const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    setPageData: (state, action) => {
      state.listItems = action.payload;
      state.currentPage = state.currentPage + 1;
    },
    setSearchData: (state, action) => {
      state.searchResults = action.payload;
    },
    resetCurrentPage: (state) => {
      state.currentPage = 1;
    },
  },
});

export const { setPageData, resetCurrentPage, setSearchData } =
  listSlice.actions;

export default listSlice.reducer;
