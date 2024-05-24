import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")) : null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    activeUser: (state, actions) => {
      state.value = actions.payload
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { activeUser } = userSlice.actions

export default userSlice.reducer