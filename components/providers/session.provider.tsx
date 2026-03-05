"use client";
import { SessionProvider } from "next-auth/react";

import React from "react";

const SessionWrap = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
export default SessionWrap;