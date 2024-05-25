import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")) : null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    activeUser: (state, action) => {
      state.value = action.payload
      localStorage.setItem("user", JSON.stringify(action.payload))
    },
    logoutUser: (state) => {
      state.value = null
      localStorage.removeItem("user")
    },
  },
})

// Action creators are generated for each case reducer function
export const { activeUser, logoutUser } = userSlice.actions

export default userSlice.reducer