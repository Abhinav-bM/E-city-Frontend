import React, { Suspense } from "react";
import MainWrapper from "@/wrapper/main";
import ShopPage from "@/page-component/shop";
import Loader from "@/components/ui/Loader";

const Page = () => {
  return (
    <MainWrapper>
      <Suspense fallback={<Loader fullScreen theme="monochrome" />}>
        <ShopPage />
      </Suspense>
    </MainWrapper>
  );
};

export default Page;
