"use client";

// THINGS TO ADD  //
// mobileNav
// navbar multilevel dropdown
// hover effects for all user interactive elemets

import { useState } from "react";
import Link from "next/link";
import UserIcon from "./icons/userIcon";
import CartIcon from "./icons/cartIcon";
import HeartIcon from "./icons/heartIcon";
import urls from "@/utils/routes";
import CloseIcon from "./icons/closeIcon";
import MenuIcon from "./icons/menuIcon";

const Navbar = () => {
  const [openNavbar, setOpenNavbar] = useState(false);

  const _handleToggleNavbar = () => {
    setOpenNavbar(!openNavbar);
  };

  return (
    <header className="header">
      <nav className="navbar  custom-padding">
        <div className="mobile-nav-toggler ">
          <button onClick={_handleToggleNavbar} type="button">
            {openNavbar ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile menu */}
        {openNavbar && (
          <div className="absolute top-16 left-0  w-full bg-gray-800 text-white h-screen z-10 md:hidden">
            <div className="flex flex-col items-start p-6 space-y-4">
              <Link
                href={urls.home}
                className="text-lg font-medium hover:text-gray-300"
              >
                Home
              </Link>
              <Link
                href={urls.shop}
                className="text-lg font-medium hover:text-gray-300"
              >
                Shop
              </Link>
            </div>
          </div>
        )}

        <div className="logo-container   md:flex md:justify-center md:items-center md:justify-start md:w-1/4">
          <Link className="nav-brand m-0" href="/">
            {/* <div className="position-relative h-full overflow-hidden">
                    <img
                      src="#"
                      alt="logo"
                      className="w-auto h-100"
                      width={10}
                      height={10}
                    />
                  </div> */}

            <span className="xl:text-xl">StoreName </span>
          </Link>
        </div>

        <div className=" search-area ">
          <input
            // ref={searchInputRef}
            type="search"
            placeholder="Search for products..."
            aria-label="Search"
            // onKeyUp={_handleeOnSearchKeyDown}
          />
        </div>

        <div className="flex w-1/4 items-center justify-end">
          <ul className="m-0 p-0 flex justify-end items-center gap-1 md:gap-6">
            <li className="">
              <Link href={urls.wishlist} className="nav-link dropdown-btn m-0">
                <HeartIcon
                  width={30}
                  height={30}
                  className=" text-black hover:scale-110 transition-transform duration-200 h-[24px] md:h-auto"
                />
              </Link>
            </li>

            <li className="">
              <Link href={urls.profile} className="nav-link dropdown-btn m-0">
                <UserIcon
                  width={30}
                  height={30}
                  className=" text-black hover:scale-110 transition-transform duration-200 h-[24px] md:h-auto"
                />
              </Link>
            </li>

            <li className="nav-item dropdown col-md-auto mr-1">
              <Link
                href={urls.cart}
                className="relative nav-link nav-with-text m-0"
              >
                <CartIcon
                  width={30}
                  height={30}
                  className=" text-black hover:scale-110 transition-transform duration-200 h-[25px] md:h-auto"
                />

                <span className="absolute -top-4 -right-3 bottom-3 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="hidden md:flex header-menu py-1 justify-center bg-primary">
        {/* HERE GOES THE NAV ELEMENTS WITH DROPDOWN */}
        <ul className="relative m-0 py-2 flex gap-x-6 text-white font-semibold">
          <li>
            <Link href={urls.shop}>Shop</Link>
          </li>
          {/* {navBar && generateNavElement(navBar.navElements, categories)} */}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
