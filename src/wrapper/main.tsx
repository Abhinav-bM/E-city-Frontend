import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import "@/assets/styles/styles.scss";
import React, { Fragment } from "react";
import { Toaster } from "react-hot-toast";
import { DEFAULT_TOAST_CONFIG } from "@/utils/toast";

const Mainwrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fragment>
      <Navbar />
      {children}
      <Toaster toastOptions={DEFAULT_TOAST_CONFIG} />
      <Footer />
    </Fragment>
  );
};

export default Mainwrapper;
