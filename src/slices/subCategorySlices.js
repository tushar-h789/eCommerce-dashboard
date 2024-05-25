// src/slices/subCategorySlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  subCategories: localStorage.getItem("subCategories") ? JSON.parse(localStorage.getItem("subCategories")) : [],
}

export const subCategorySlice = createSlice({
  name: 'subCategory',
  initialState,
  reducers: {
    addSubCategory: (state, action) => {
      state.subCategories.push(action.payload)
      localStorage.setItem("subCategories", JSON.stringify(state.subCategories))
    },
  },
})

export const { addSubCategory } = subCategorySlice.actions
export default subCategorySlice.reducer