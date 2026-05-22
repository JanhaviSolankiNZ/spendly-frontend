import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const SignInPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <Card className="w-full max-w-sm m-auto  border border-card-foreground">
        <CardHeader className="text-center text-muted space-y-2">
          <div>
            <img />
            <p>Spendly</p>
          </div>
          <h1 className="text-2xl">Welcome back</h1>
          <p className="text-foreground text-light">Sign in to your account</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            type="button"
            className="w-full bg-card-foreground text-muted-foreground py-5 cursor-pointer hover:bg-card-foreground"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
          <div className="flex items-center">
            <Separator className="flex-1" />
            <p className="text-xs text-secondary px-2">Or</p>
            <Separator className="flex-1" />
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Email address</Label>
              <Input type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-foreground">Password</Label>
                <Link to="/forgot-password" className="text-primary">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input type="password" placeholder="Enter your password" />
                <Button className="absolute right-1 top-1 cursor-pointer">
                  <Eye />
                </Button>
              </div>
            </div>
            <Button className="w-full py-5 px-2" type="submit">Sign In</Button>
          </form>
          <p className="text-secondary text-center">Don't have an account? <Link to="/signup" className="text-primary">Sign up free</Link></p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
