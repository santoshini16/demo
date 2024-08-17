import { configureStore } from "@reduxjs/toolkit";
import authReducer from './configureslice/reduxSlice';


const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });
  
  export default store;