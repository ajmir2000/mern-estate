// configureStore is a function from @reduxjs/toolkit that simplifies the process of creating a Redux store.
// combineReducers is a function that combines multiple reducers (state) into a single reducing (state) function that you can pass to createStore.
import { combineReducers, configureStore } from "@reduxjs/toolkit";

//states and actions for user authentication like currentUser, loading and errorfrom userSlice
import userReducer from "./user/userSlice";

// persistReducer is a function that wraps your root reducer and returns a new reducer that handles the persistence of the state.
// persistStore is a function that creates a persistor object that can be used to persist the store.
import { persistReducer, persistStore } from "redux-persist";

// storage is the default storage engine for web, which uses localStorage.
import storage from "redux-persist/lib/storage";

// this is the root reducer that combines all the reducers in the application, in this case we only have userReducer but we can add more reducers like propertyReducer, etc.
const rootReducer = combineReducers({
  user: userReducer,
});

// persistent === save the state in localStorage, so when the user refresh the page or close the browser and open it again, the state will be persisted and the user will not be logged out.
// this is the configuration object for redux-persist, it tells redux-persist how to persist the state, in this case we are using localStorage and we are giving it a key of "root" which is the key that will be used to store the state in localStorage.
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// this is the persisted reducer that will be used to create the store and save the state in localStorage, it wraps the rootReducer with the persistReducer function and the persistConfig object.
// here each update to reducer will be save in localStorage.
const persistedReducer = persistReducer(persistConfig, rootReducer);

//Here create Redux Store this is like central database for the application where we can store the state of the application and access it from any component in the application, we are using configureStore from @reduxjs/toolkit which simplifies the process of creating a Redux store and it also includes some useful features like middleware and devtools integration, we are also passing the persistedReducer to the store so that the state will be persisted in localStorage, and we are also disabling the serializableCheck middleware because redux-persist uses non-serializable values in the state.

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    // redux-persist uses non-serializable values in the state, so we need to disable the serializableCheck middleware to avoid warnings in the console.
    getDefaultMiddleware({ serializableCheck: false }),
});

//here have responsible for save and reload of sates in localStorage.
export const persistor = persistStore(store);
