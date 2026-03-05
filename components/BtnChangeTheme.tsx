"use client";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export default function BtnChangeTheme() {

  const { theme, setTheme } = useTheme();
  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <>
      <Button className="mx-6 p-2" variant={"outline"} onClick={handleToggleTheme}>
        {theme === "light" ? "🌜" : "🌞"}
      </Button>
    </>
  );
}
