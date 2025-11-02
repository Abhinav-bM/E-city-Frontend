"use client";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/store";
import React, { useEffect, useRef } from "react";
import { setStoreDispatch } from "@/api/httpService";

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore | undefined>(undefined);

  if (!storeRef.current) {
    // create the store instance the first time this render
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current) {
      setStoreDispatch(storeRef.current.dispatch);
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
