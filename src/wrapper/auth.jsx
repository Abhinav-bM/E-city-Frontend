"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Authwrapper = ({ children }) => {
  const isAuthenticated = true;
  const router = useRouter();
  if (!isAuthenticated) {
    router.push("/login");
    return;
  } else {
    return children;
  }
};

export default Authwrapper;
