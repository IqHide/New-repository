"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { layoutConfig } from "@/config/layout.config";
import RegistrationModal from "../modals/registration.modal";
import LoginModal from "../modals/login.modal";
import { useState } from "react";
import signOutFunc from "@/actions/sign-out";
import { useAuthStore } from "@/store/auth.store";

export const SiteLogo = () => {
  return (
    <Image src="/Mercedes-Logo.png"
      alt="Mercedes-Logo"
      width={32}
      height={32}
      priority />
  );
};

export default function Header() {
  const pathname = usePathname();

  const { isAuth, session, status, setAuthState } = useAuthStore();


  const [IsRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutFunc();

    } catch (error) {
      console.log("error", error);
    }

    setAuthState("unauthenticated", null);
  }

  return (
    <Navbar style={{ height: layoutConfig.headerHeight }} >
      <NavbarBrand>
        <Link href="/" className="flex gap-2">
          <SiteLogo />
          <p className="font-bold text-inherit">{siteConfig.title}</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {siteConfig.navItems
          .filter((item) => {
            if (item.href === "/cars") {
              return isAuth;
            }
            return true;
          })
          .map((item) => {
            const isActive = pathname === item.href;

            return (
              <NavbarItem key={item.href}>
                <Link
                  className={` px-3 py-1
                  ${isActive ? "text-blue-500" : "text-foreground"}
                  hover:text-blue-300 hover:border
                  hover:border-blue-300 hover:rounded-md
                  transition-colors
                  transition-border
                  duration-300
                `}
                  href={item.href}>
                  {item.label}
                </Link>
              </NavbarItem>
            )
          })}
      </NavbarContent>
      {status === 'loading' ?
        <p>Загрузка...</p> :
        <NavbarContent justify="end">
          {isAuth && <p>Привет, {session?.user?.email}</p>}
          {isAuth ? (
            <NavbarItem className="hidden sm:flex">
              <Button as={Link} color="primary" href="#" variant="flat" onPress={handleSignOut} >
                Exit
              </Button>
            </NavbarItem>
          ) : (
            <>
              <NavbarItem className="hidden sm:flex">
                <Button as={Link} color="primary" href="#" variant="flat" onPress={() => setIsLoginOpen(true)} >
                  Log In
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button as={Link} color="primary" href="#" variant="flat" onPress={() => setIsRegistrationOpen(true)} >
                  Sign Up
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
      }
      <RegistrationModal
        isOpen={IsRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      >
      </RegistrationModal>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      >

      </LoginModal>
    </Navbar>
  );
}
