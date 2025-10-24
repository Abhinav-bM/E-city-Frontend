import Mainwrapper from "@/wrapper/main";
import Authwrapper from "@/wrapper/auth-wrapper";
import WishlistPage from "@/page-component/wishlist";
import React from "react";

const page = () => {
  return (
    <Mainwrapper>
      <Authwrapper>
        <WishlistPage />
      </Authwrapper>
    </Mainwrapper>
  );
};

export default page;
