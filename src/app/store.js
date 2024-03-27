import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bCategoryReducer from "../features/bcategory/bcategorySlice";
import colorReducer from "../features/color/colorSlice";
import uploadReducer from "../features/upload/uploadSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    bCategory: bCategoryReducer,
    color: colorReducer,
    upload: uploadReducer,
  },
});
