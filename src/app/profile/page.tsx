import AccountSettings from "@/components/userProfile";
import Authwrapper from "@/wrapper/auth-wrapper";
import Mainwrapper from "@/wrapper/main";
import React from "react";

const page = () => {
  return (
    <Mainwrapper>
      <Authwrapper>
        <AccountSettings />
      </Authwrapper>
    </Mainwrapper>
  );
};

export default page;
