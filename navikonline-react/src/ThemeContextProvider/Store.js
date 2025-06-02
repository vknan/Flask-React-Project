import { configureStore } from "@reduxjs/toolkit";
import ThemeSlice from "./ThemeSlice";
import { ApiSlice } from "./ApiSlice";
import authReducer from './authSlice'; // Import auth slice

const Store = configureStore({
   reducer: { 
       auth: authReducer, // Add auth reducer
       [ApiSlice.reducerPath]: ApiSlice.reducer
      ,ThemeSlice: ThemeSlice
   },
   middleware:(getDefaultMiddleware)=>
         getDefaultMiddleware().concat(ApiSlice.middleware),
   devTools:true
})

export default Store;

