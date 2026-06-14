import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { buttonVariants } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import { NavLink, Outlet } from "react-router";

const navLinkClassName = cn(
  buttonVariants({ variant: "ghost", size: "sm" }),
  "h-8 px-2.5 text-xs font-medium tracking-[-0.03em] transition-colors",
  "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
  "focus-visible:ring-1 focus-visible:ring-ring/50",
);

const primaryNavLinkClassName = cn(
  buttonVariants({ variant: "default", size: "sm" }),
  "h-8 px-2.5 text-xs tracking-[-0.03em] shadow-sm shadow-primary/10 hover:bg-primary/90",
);

export default function Navigation() {
  const { user } = useCurrentUser();
  return (
    <>
      <nav className="border-border/70 bg-background/82 shadow-background/30 sticky top-0 z-40 overflow-hidden border-b shadow-sm backdrop-blur-md">
        <div className="via-primary/60 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent" />
        <div className="via-primary/60 pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent" />
        <div className="flex min-h-14 items-center justify-between gap-3 py-2">
          <NavLink
            to="/"
            className="group focus-visible:ring-ring/50 outline-none focus-visible:ring-1"
          >
            <span className="text-foreground group-hover:text-primary text-2xl font-bold tracking-[-0.1em] transition-colors sm:text-3xl">
              thocktype
            </span>
          </NavLink>

          <NavigationMenu viewport={false}>
            <NavigationMenuList className="border-border/60 bg-card/45 shadow-background/30 gap-1 border p-1 shadow-inner">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink to="/leaderboard" className={navLinkClassName}>
                    Leaderboard
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {user && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <NavLink to="/account" className={navLinkClassName}>
                      Account
                    </NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              {!user && (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <NavLink to="/signin" className={navLinkClassName}>
                        Sign in
                      </NavLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/register"
                        className={primaryNavLinkClassName}
                      >
                        Register
                      </NavLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
