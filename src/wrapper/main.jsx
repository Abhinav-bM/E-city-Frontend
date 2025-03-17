import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import "@/assets/styles/styles.scss";
import React, { Fragment } from "react";

const main = ({ children }) => {
  return (
    <Fragment>
      <Navbar />
      {children}
      <Footer />
    </Fragment>
  );
};

export default main;
