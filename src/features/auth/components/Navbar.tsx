import { SpendlyLogo } from "@/assets/SpendlyLogo";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
    const location = useLocation();
    const isSignIn = location.pathname === "/signin";
    return (
        <div className="flex items-center justify-between px-4 h-14 border-b border-border sm:px-8 sm:h-16">
            <Link to="/" className="flex items-center gap-2 shrink-0">
                <SpendlyLogo className="w-8 h-8"/>
                <h1 className="leading-none text-base sm:text-xl font-bold text-muted-foreground">
                   Spendly
                </h1>
            </Link>
            <NavigationMenu>
                <NavigationMenuList className="gap-2 sm:gap-4">
                    <p className="text-xs sm:text-sm text-secondary hidden sm:block">{isSignIn ? "Don't have an account?" : "Have an account?"}</p>
                    <NavigationMenuItem>
                        <Link
                            to={isSignIn ? "/signup" : "/signin"}
                            className="text-primary text-sm font-medium hover:underline"
                        >
                            {isSignIn ? "Sign up" : "Sign in"}
                        </Link>
                    </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
        </div>

    )
}

export default Navbar