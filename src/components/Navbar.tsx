import React from "react";
import { Navbar as NextraNavBar } from "nextra-theme-docs";
import Image from "next/image";

function Navbar() {
  return (
    <NextraNavBar
      logo={
        <Image src={"/logo-azul.png"} width={150} height={100} alt="logo" />
      }
    />
  );
}

export default Navbar;
