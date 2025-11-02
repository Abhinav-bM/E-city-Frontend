import MainWrapper from "@/wrapper/main";
import MainBanner from "@/components/mainBanner";
import { Fragment } from "react";

/*
  Home Page
   1:fetch home page data from an API and render here
*/

export default function Home() {
  return (
    <MainWrapper>
      <MainBanner />
    </MainWrapper>
  );
}
