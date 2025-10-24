"use client";
import { useRouter } from "next/navigation";
import { Provider } from "react-redux";

const Authwrapper = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = true;
  const router = useRouter();
  if (!isAuthenticated) {
    router.push("/login");
    return;
  } else {
    return children;
  }
};

export default Authwrapper;
