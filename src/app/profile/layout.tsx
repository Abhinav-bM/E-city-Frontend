import React from "react";
import MainWrapper from "@/wrapper/main";
import ProfileSidebar from "@/components/profile/Sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainWrapper>
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8 max-w-7xl w-full mx-auto items-start">
          <div className="md:sticky md:top-24 w-full md:w-auto z-10 shrink-0">
            <ProfileSidebar />
          </div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    </MainWrapper>
  );
}
