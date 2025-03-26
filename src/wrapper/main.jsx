import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import "@/assets/styles/styles.scss";
import React, { Fragment } from "react";

const Mainwrapper = ({ children }) => {
  return (
    <Fragment>
      <Navbar />
      {children}
      <Footer />
    </Fragment>
  );
};

export default Mainwrapper;
