import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleWishlistItem,
  removeFromWishlist,
  clearWishlist,
  selectWishlistItems,
  selectWishlistCount,
} from "@/store/slices/wishlist-slice";
import type { RootState } from "@/store/index";

export function useWishlist() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const count = useAppSelector(selectWishlistCount);

  function isWishlisted(productId: string) {
    return items.some((item) => item.productId === productId);
  }

  return {
    items,
    count,
    isWishlisted,
    toggle: (item: Parameters<typeof toggleWishlistItem>[0]) => dispatch(toggleWishlistItem(item)),
    remove: (productId: string) => dispatch(removeFromWishlist({ productId })),
    clear: () => dispatch(clearWishlist()),
  };
}

// Re-exported for components that only need a single boolean without
// subscribing to the whole wishlist array (avoids unnecessary rerenders).
export function useIsWishlisted(productId: string) {
  return useAppSelector((state: RootState) => state.wishlist.items.some((item) => item.productId === productId));
}
