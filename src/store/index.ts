import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  useStore,
  TypedUseSelectorHook,
} from "react-redux";
import productSlice from "./productSlice";
import userSlice from "./authSlice";

// Create the store
export const makeStore = () => {
  return configureStore({
    reducer: {
      product: productSlice,
      user: userSlice,
    },
  });
};

// 2Infer useful types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Typed React-Redux hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useStore<AppStore>();
