import { configureStore } from '@reduxjs/toolkit'
import userSlices from './src/slices/userSlices'
import subCategoryReducer from './src/slices/subCategorySlices'

export const store = configureStore({
  reducer: {
    activeUser: userSlices,
    subCategory: subCategoryReducer
  },
})