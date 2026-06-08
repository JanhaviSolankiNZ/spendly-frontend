import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import {Button} from "@/components/ui/button";
import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <div className="flex items-center justify-between py-4 px-8 h-16">
            <div>
                <h1 className="text-xl font-bold text-foreground">
                    <Link to="/">Spendly</Link>
                </h1>
            </div>
            <NavigationMenu>
                <NavigationMenuList className="gap-6">
                <NavigationMenuItem>
                    <a href="/#features">Features</a>
                </NavigationMenuItem>
                <Button variant="ghost" className="border border-border bg-foreground/10 hover:bg-foreground/20 cursor-pointer">
                   <Link to="/signin">Sign in</Link>
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                  <Link to="/signup">Get started for free</Link>
                </Button>
            </NavigationMenuList>
        </NavigationMenu>
        </div>

    )
}

export default Navbar