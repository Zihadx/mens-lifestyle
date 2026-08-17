"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Heart,
  User,
  ShoppingBag,
  Sun,
  Moon,
  LogOut,
  Package,
  UserRound,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { navConfig, siteConfig } from "@/config/site";

import { useAppDispatch } from "@/store/hooks";
import {
  setMobileNavOpen,
  setSearchOpen,
} from "@/store/slices/ui-slice";

import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

import { createClient } from "@/lib/supabase/client";


// ============================================================
// TYPES
// ============================================================

type UserRole =
  | "admin"
  | "customer"
  | "staff"
  | "moderator";

type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  status: string | null;
};


// ============================================================
// COMPONENT
// ============================================================

export function SiteHeader() {
  const dispatch = useAppDispatch();

  const {
    itemCount,
    openDrawer: openCart,
  } = useCart();

  const {
    count: wishlistCount,
  } = useWishlist();

  const {
    theme,
    setTheme,
  } = useTheme();

  const [mounted, setMounted] = useState(false);

  const [isAuthLoading, setIsAuthLoading] =
    useState(true);

  const [user, setUser] =
    useState<any>(null);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const supabase = useMemo(
    () => createClient(),
    [],
  );


  // ==========================================================
  // THEME HYDRATION
  // ==========================================================

  useEffect(() => {
    setMounted(true);
  }, []);


  // ==========================================================
  // LOAD PROFILE FROM DATABASE
  // ==========================================================

  const loadProfile = useCallback(
    async (userId: string) => {
      const {
        data,
        error,
      } = await supabase
        .from("user_profiles")
        .select(
          `
            id,
            name,
            email,
            phone,
            role,
            status
          `,
        )
        .eq("id", userId)
        .single();

      if (error) {
        console.error(
          "Failed to load user profile:",
          error,
        );

        setProfile(null);

        return null;
      }

      setProfile(data as UserProfile);

      return data as UserProfile;
    },
    [supabase],
  );


  // ==========================================================
  // LOAD AUTH USER + PROFILE
  // ==========================================================

  const loadUser = useCallback(
    async () => {
      setIsAuthLoading(true);

      try {
        const {
          data: {
            user: authUser,
          },
          error: authError,
        } = await supabase.auth.getUser();

        // ----------------------------------------------
        // Not authenticated
        // ----------------------------------------------

        if (
          authError ||
          !authUser
        ) {
          setUser(null);
          setProfile(null);
          return;
        }

        // ----------------------------------------------
        // Auth user
        // ----------------------------------------------

        setUser(authUser);

        // ----------------------------------------------
        // Database profile
        // ----------------------------------------------

        await loadProfile(
          authUser.id,
        );
      } catch (error) {
        console.error(
          "Failed to load authentication:",
          error,
        );

        setUser(null);
        setProfile(null);
      } finally {
        setIsAuthLoading(false);
      }
    },
    [supabase, loadProfile],
  );


  // ==========================================================
  // AUTH STATE LISTENER
  // ==========================================================

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      if (!active) return;

      await loadUser();
    };

    initialize();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        async (
          event,
          session,
        ) => {
          if (!active) return;

          console.log(
            "Supabase auth event:",
            event,
          );

          // --------------------------------------------
          // Signed out
          // --------------------------------------------

          if (!session?.user) {
            setUser(null);
            setProfile(null);
            setIsAuthLoading(false);

            return;
          }

          // --------------------------------------------
          // Signed in / token refreshed / OTP verified
          // --------------------------------------------

          setUser(
            session.user,
          );

          await loadProfile(
            session.user.id,
          );

          setIsAuthLoading(false);
        },
      );

    return () => {
      active = false;

      subscription.unsubscribe();
    };
  }, [
    supabase,
    loadUser,
    loadProfile,
  ]);


  // ==========================================================
  // AUTH STATUS
  // ==========================================================

  const isAuthenticated =
    Boolean(user);


  // ==========================================================
  // USER DISPLAY INFORMATION
  // ==========================================================

  const metadata =
    user?.user_metadata ?? {};


  const displayName =
    profile?.name ||
    metadata.full_name ||
    metadata.name ||
    user?.email?.split("@")[0] ||
    "My Account";


  const email =
    profile?.email ||
    user?.email ||
    "";


  // ==========================================================
  // AVATAR
  // ==========================================================

  const avatarUrl =
    metadata.avatar_url ||
    metadata.picture ||
    metadata.avatar ||
    null;


  // ==========================================================
  // INITIALS
  // ==========================================================

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part: string) =>
          part
            .charAt(0)
            .toUpperCase(),
      )
      .join("") ||
    "U";


  // ==========================================================
  // ROLE
  //
  // IMPORTANT:
  // Role comes from user_profiles table.
  // NOT from user_metadata.
  // ==========================================================

  const role: UserRole =
    profile?.role ?? "customer";


  // ==========================================================
  // DASHBOARD CONFIG
  // ==========================================================

  const dashboardConfig = {
    admin: {
      label: "Admin Dashboard",
      href: "/admin",
      icon: ShieldCheck,
    },

    staff: {
      label: "Staff Dashboard",
      href: "/staff",
      icon: LayoutDashboard,
    },

    moderator: {
      label: "Moderator Dashboard",
      href: "/moderator",
      icon: ShieldCheck,
    },

    customer: {
      label: "My Dashboard",
      href: "/account",
      icon: LayoutDashboard,
    },
  } satisfies Record<
    UserRole,
    {
      label: string;
      href: string;
      icon: typeof LayoutDashboard;
    }
  >;


  const dashboard =
    dashboardConfig[role];

  const DashboardIcon =
    dashboard.icon;


  // ==========================================================
  // SIGN OUT
  // ==========================================================

  const handleSignOut =
    async () => {
      try {
        const {
          error,
        } =
          await supabase.auth.signOut({
            scope: "local",
          });

        if (error) {
          console.error(
            "Supabase sign out error:",
            error,
          );

          toast.error(
            "Couldn't sign out. Please try again.",
          );

          return;
        }

        setUser(null);
        setProfile(null);

        toast.success(
          "Signed out successfully.",
        );
      } catch (error) {
        console.error(
          "Sign out error:",
          error,
        );

        toast.error(
          "Something went wrong while signing out.",
        );
      }
    };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-border
        bg-background/95
        backdrop-blur
        supports-[backdrop-filter]:bg-background/80
      "
    >
      <div
        className="
          container
          flex h-16
          items-center
          justify-between
          gap-4
        "
      >

        {/* ====================================================
            MOBILE MENU
        ==================================================== */}

        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              dispatch(
                setMobileNavOpen(true),
              )
            }
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
        </div>


        {/* ====================================================
            LOGO
        ==================================================== */}

        <Link
          href="/"
          className="
            font-display
            text-xl
            font-semibold
            tracking-tight
          "
        >
          {siteConfig.name}
        </Link>


        {/* ====================================================
            DESKTOP NAVIGATION
        ==================================================== */}

        <nav
          className="
            hidden
            items-center
            gap-7
            lg:flex
          "
        >
          {navConfig.main.map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                className="
                  text-sm
                  font-medium
                  text-foreground/80
                  transition-colors
                  hover:text-foreground
                "
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>


        {/* ====================================================
            ACTIONS
        ==================================================== */}

        <div
          className="
            flex
            items-center
            gap-1
          "
        >

          {/* ==================================================
              SEARCH
          ================================================== */}

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              dispatch(
                setSearchOpen(true),
              )
            }
            aria-label="Search"
          >
            <Search className="size-4.5" />
          </Button>


          {/* ==================================================
              THEME
          ================================================== */}

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(
                theme === "dark"
                  ? "light"
                  : "dark",
              )
            }
            aria-label="Toggle theme"
            className="
              hidden
              sm:inline-flex
            "
          >
            {mounted &&
            theme === "dark" ? (
              <Sun className="size-4.5" />
            ) : (
              <Moon className="size-4.5" />
            )}
          </Button>


          {/* ==================================================
              WISHLIST
          ================================================== */}

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="
              relative
              hidden
              sm:inline-flex
            "
          >
            <Link
              href="/wishlist"
              aria-label="Wishlist"
            >
              <Heart className="size-4.5" />

              {wishlistCount > 0 && (
                <span
                  className="
                    absolute
                    right-0.5
                    top-0.5
                    flex
                    size-4
                    items-center
                    justify-center
                    rounded-full
                    bg-accent
                    text-[10px]
                    font-medium
                    text-accent-foreground
                  "
                >
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>


          {/* ==================================================
              ACCOUNT
          ================================================== */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="
                  hidden
                  rounded-full
                  sm:inline-flex
                "
                aria-label="Account"
              >
                {isAuthenticated &&
                !isAuthLoading ? (
                  <Avatar className="size-7">
                    <AvatarImage
                      src={
                        avatarUrl ??
                        undefined
                      }
                      alt={displayName}
                    />

                    <AvatarFallback
                      className="
                        text-[10px]
                        font-medium
                      "
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="size-4.5" />
                )}
              </Button>
            </DropdownMenuTrigger>


            <DropdownMenuContent
              align="end"
              className="w-64"
            >

              {/* ==================================================
                  AUTHENTICATED
              ================================================== */}

              {isAuthenticated ? (
                <>

                  {/* ==============================================
                      USER IDENTITY
                  ============================================== */}

                  <DropdownMenuLabel
                    className="font-normal"
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >
                      <Avatar
                        className="
                          size-9
                          shrink-0
                        "
                      >
                        <AvatarImage
                          src={
                            avatarUrl ??
                            undefined
                          }
                          alt={
                            displayName
                          }
                        />

                        <AvatarFallback>
                          {initials}
                        </AvatarFallback>
                      </Avatar>


                      <div className="min-w-0">
                        <p
                          className="
                            truncate
                            text-sm
                            font-medium
                          "
                        >
                          {displayName}
                        </p>

                        <p
                          className="
                            truncate
                            text-xs
                            font-normal
                            text-muted-foreground
                          "
                        >
                          {email}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-muted-foreground
                          "
                        >
                          {role}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>


                  <DropdownMenuSeparator />


                  {/* ==============================================
                      ROLE DASHBOARD
                  ============================================== */}

                  <DropdownMenuItem asChild>
                    <Link
                      href={
                        dashboard.href
                      }
                    >
                      <DashboardIcon
                        className="
                          mr-2
                          size-4
                        "
                      />

                      {
                        dashboard.label
                      }
                    </Link>
                  </DropdownMenuItem>


                  <DropdownMenuSeparator />


                  {/* ==============================================
                      PROFILE
                  ============================================== */}

                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <UserRound
                        className="
                          mr-2
                          size-4
                        "
                      />

                      Profile
                    </Link>
                  </DropdownMenuItem>


                  {/* ==============================================
                      ORDERS
                  ============================================== */}

                  <DropdownMenuItem asChild>
                    <Link
                      href="/account/orders"
                    >
                      <Package
                        className="
                          mr-2
                          size-4
                        "
                      />

                      My Orders
                    </Link>
                  </DropdownMenuItem>


                  {/* ==============================================
                      TRACK ORDER
                  ============================================== */}

                  <DropdownMenuItem asChild>
                    <Link href="/track">
                      <ShoppingBag
                        className="
                          mr-2
                          size-4
                        "
                      />

                      Track Order
                    </Link>
                  </DropdownMenuItem>


                  {/* ==============================================
                      WISHLIST
                  ============================================== */}

                  <DropdownMenuItem asChild>
                    <Link
                      href="/wishlist"
                    >
                      <Heart
                        className="
                          mr-2
                          size-4
                        "
                      />

                      Wishlist

                      {wishlistCount >
                        0 && (
                        <span
                          className="
                            ml-auto
                            text-xs
                            text-muted-foreground
                          "
                        >
                          {
                            wishlistCount
                          }
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>


                  <DropdownMenuSeparator />


                  {/* ==============================================
                      SIGN OUT
                  ============================================== */}

                  <DropdownMenuItem
                    onClick={
                      handleSignOut
                    }
                    destructive
                  >
                    <LogOut
                      className="
                        mr-2
                        size-4
                      "
                    />

                    Sign Out
                  </DropdownMenuItem>

                </>
              ) : (

                /* ==================================================
                   NOT AUTHENTICATED
                ================================================== */

                <>
                  <DropdownMenuLabel>
                    My Account
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/login">
                      <User
                        className="
                          mr-2
                          size-4
                        "
                      />

                      Sign In
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/register">
                      Create Account
                    </Link>
                  </DropdownMenuItem>
                </>
              )}

            </DropdownMenuContent>
          </DropdownMenu>


          {/* ==================================================
              CART
          ================================================== */}

          <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            className="relative"
            aria-label="Cart"
          >
            <ShoppingBag className="size-4.5" />

            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{
                    scale: 0.5,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{
                    scale: 0.5,
                    opacity: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 25,
                  }}
                  className="
                    absolute
                    right-0.5
                    top-0.5
                    flex
                    size-4
                    items-center
                    justify-center
                    rounded-full
                    bg-accent
                    text-[10px]
                    font-medium
                    text-accent-foreground
                  "
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

        </div>
      </div>
    </header>
  );
}