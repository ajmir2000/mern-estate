// createSlice is a function from the Redux Toolkit library that simplifies the process of creating a Redux slice, in past wee must manually create action types, action creators and reducers, but with createSlice we can do all of that in one step, it takes an object as an argument that contains the name of the slice, the initial state and the reducers (actions) that will be used to update the state.
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

//
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    // state come from initialState and action is like event have type and payload, type is the name of the action and payload is the data that we want to send to the reducer, in this case we want to send the user data that we get from the server after successful login, so we can update the currentUser state with that data and also set loading to false and error to null.

    // Dispatching an action is like sending a signal to the reducer that something happened and we want to update the state based on that, so when we dispatch signInSuccess action with the user data as payload, the reducer will update the currentUser state with that data and also set loading to false and error to null, so we can use that state in our components to show the user data and also show loading spinner or error message if there is any.
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    // this functions are for update user profile.
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
// redux like simple data like object, array, string not function , promise, date

//reducer === change state function or function get old state and change to new state
// reducer come get muliple things and return one thing.
//dispatch mean send an event === action to redux

// dispatch(action)
//       ↓
//  reducer runs
//       ↓
//  state updates
//       ↓
//  UI updates

// خلاصه خیلی ساده:

// Store

// database مرکزی

// Slice

// یک بخش از store

// State

// data فعلی

// Action

// پیغام اتفاق

// Payload

// data همراه action

// Reducer

// منطق تغییر state
