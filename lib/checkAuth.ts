import { getSession } from "next-auth/react";

export const checkAuth = async () => {
  const session = await getSession();

  const user = session?.user;
  if (!user) {
    return false;
  }
  return true;
};