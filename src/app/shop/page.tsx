import React, { Suspense } from "react";
import MainWrapper from "@/wrapper/main";
import ShopPage from "@/page-component/shop";

const Page = () => {
  return (
    <MainWrapper>
      <Suspense fallback={<p>Loading shop...</p>}>
        <ShopPage />
      </Suspense>
    </MainWrapper>
  );
};

export default Page;
