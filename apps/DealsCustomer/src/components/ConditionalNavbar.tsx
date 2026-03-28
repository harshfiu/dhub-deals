"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

// Pages where the Navbar should NOT appear
const HIDE_NAVBAR_ON = ["/login", "/signup"];

export default function ConditionalNavbar() {
  const pathname = usePathname();
  if (HIDE_NAVBAR_ON.includes(pathname)) return null;
  return <Navbar />;
}
