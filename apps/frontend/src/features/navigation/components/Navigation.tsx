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
      <nav className="flex items-center justify-between">
        <Link to="/">
          <div className="text-3xl font-bold">thockr</div>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
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
