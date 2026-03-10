"use client";
import { FC, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Moon as MoonIcon,
  Sun as SunIcon,
  Monitor as MonitorIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";

export const ModeToggle: FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <></>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon
            className={clsx(
              "h-[1.2rem] w-[1.2rem] transition-all",
              resolvedTheme === "light" ? "scale-100" : "scale-0",
            )}
          />
          <MoonIcon
            className={clsx(
              "absolute h-[1.2rem] w-[1.2rem] transition-all",
              resolvedTheme === "dark" ? "scale-100" : "scale-0",
            )}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="flex flex-col gap-y-0.5">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={clsx(
            "cursor-pointer",
            theme === "light" ? "bg-accent" : "",
          )}
        >
          <SunIcon className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={clsx(
            "cursor-pointer",
            theme === "dark" ? "bg-accent" : "",
          )}
        >
          <MoonIcon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={clsx(
            "cursor-pointer",
            theme === "system" ? "bg-accent" : "",
          )}
        >
          <MonitorIcon className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
