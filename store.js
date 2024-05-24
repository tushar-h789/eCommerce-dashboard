import { configureStore } from '@reduxjs/toolkit'
import userSlices from './src/slices/userSlices'

export const store = configureStore({
  reducer: {
    activeUser: userSlices
  },
})