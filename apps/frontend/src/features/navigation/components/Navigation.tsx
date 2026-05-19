import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Link, Outlet } from "react-router";

export default function Navigation() {
  const user = useAuthStore((s) => s.user);
  return (
    <>
      <nav className="border-border/60 bg-background/85 sticky top-0 z-40 flex items-center justify-between border-b py-3 backdrop-blur">
        <Link to="/" className="group">
          <div className="text-foreground group-hover:text-primary text-3xl font-bold tracking-[-0.08em] transition-colors">
            thockr
          </div>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/leaderboard">Leaderboard</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {user && (
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/account">Account</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {!user && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link to="/signin">Sign in</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link to="/register">Register</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
      <Outlet />
    </>
  );
}
