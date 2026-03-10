import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

export function AppBar() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 border-b border-solid border-foreground/10 bg-background/50 backdrop-blur-xl supports-backdrop-filter:bg-background/50">
      <nav className="h-full w-11/12 mx-auto flex items-center justify-between">
        <section className="flex items-end gap-3">
          <Link
            href="/"
            className="text-xl sm:text-3xl font-semibold font-fraunces"
          >
            ASIN Harvest
          </Link>
        </section>
        <ModeToggle />
      </nav>
    </header>
  );
}
