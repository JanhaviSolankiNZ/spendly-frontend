import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <div className="flex items-center justify-between py-4 px-8 h-16 border-b border-border">
            <div>
                <h1 className="text-xl font-bold text-foreground">
                    <Link to="/">Spendly</Link>
                </h1>
            </div>
            <NavigationMenu>
                <NavigationMenuList className="gap-6">
                    <p>Have an account ?</p>
                    <NavigationMenuItem>
                        <Link to="/signin" className="text-primary">Sign in</Link>
                    </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
        </div>

    )
}

export default Navbar