"use client";

import { useAuthStore } from "@/store/auth.store";
import { useCarsStore } from "@/store/cars.store";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface IProps {
  children: React.ReactNode;
}

const AppLoader = ({ children }: IProps) => {

  const { data: session, status } = useSession();
  const { loadCars } = useCarsStore();
  const { isAuth, setAuthState } = useAuthStore();

  useEffect(() => {
    setAuthState(status, session);
  }, [status, session, setAuthState]);

  useEffect(() => {
    if (isAuth) {
      loadCars();
    }
  }, [isAuth, loadCars]);

  return <>{children}</>;
}

export default AppLoader;