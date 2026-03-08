"use client";
import React, { useMemo } from "react";
import HeartIcon from "./icons/heartIcon";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleWishlistItem } from "@/store/wishlistSlice";
import { useRouter } from "next/navigation";

const WishlistButton = ({ variantId }: { variantId: string }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { items } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.user);

  const isProductWishlisted = useMemo(() => {
    return items.some(
      (item) => (item.variantId?._id || item.variantId) === variantId,
    );
  }, [items, variantId]);

  const _handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to manage your wishlist.");
      router.push("/login");
      return;
    }

    try {
      await dispatch(
        toggleWishlistItem({ variantId, isWishlisted: isProductWishlisted }),
      ).unwrap();

      toast.success(
        isProductWishlisted ? "Removed from wishlist" : "Added to wishlist",
      );
    } catch (error: any) {
      toast.error(error || "Error updating wishlist");
    }
  };

  return (
    <button onClick={_handleAddToWishlist} className="cursor-pointer">
      <HeartIcon
        className={clsx(isProductWishlisted ? "text-red-500 fill-red-500" : "")}
      />
    </button>
  );
};

export default WishlistButton;
