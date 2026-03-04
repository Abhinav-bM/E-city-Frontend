import React, { Suspense } from "react";
import ShopPage from "@/page-component/shop";
import Loader from "@/components/ui/Loader";
import MainWrapper from "@/wrapper/main";

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
