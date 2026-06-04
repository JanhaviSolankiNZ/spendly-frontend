import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import type { SignInData } from "@/utils/schema";
import { signInSchema } from "@/utils/schema";
import { SpendlyLogo } from "@/assets/SpendlyLogo";
import { GoogleIcon } from "@/assets/GoogleIcon";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login: loginUser, loading } = useAuthStore();

  const {register, handleSubmit, formState: {errors}, setError} = useForm<SignInData>({resolver: zodResolver(signInSchema)})

  const from = (location.state as any)?.from?.pathname || "/dashboard"; // redirect back to where trying to go, default dashboard

  const onSubmit = async (values: SignInData) => {
    const success = await loginUser(values.email, values.password);
    if(success){
      navigate(from, {replace: true});
    }else{
      setError("root", { message: "Invalid email or password" })
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
    <div className="flex-1 flex items-start sm:items-center justify-center px-4 pt-6 pb-8 sm:py-10">
      <div className="w-full max-w-sm">
      <Card className="border-0 sm:border sm:border-card-foreground rounded-xl shadow-none sm:shadow-sm">
        <CardHeader className="text-center space-y-3 pb-0 px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <SpendlyLogo className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="text-xs text-secondary font-medium tracking-wide">Spendly</span>
          </div>
          <h1 className="text-2xl font-semibold text-muted-foreground">Welcome back</h1>
          <p className="text-foreground text-sm mt-1">Sign in to your account</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-5 px-4 sm:px-6">
          <Button
            variant="outline"
            type="button"
            className="w-full h-11 bg-card-foreground text-muted-foreground cursor-pointer gap-2 border-border hover:bg-card-foreground"
          >
            <GoogleIcon/>
            Continue with Google
          </Button>
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <p className="text-xs text-secondary">Or</p>
            <Separator className="flex-1" />
          </div>
          {errors.root && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
              {errors.root.message}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-1.5">
              <Label className="text-foreground text-sm">Email address</Label>
              <Input type="email" placeholder="Enter your email" {...register("email")} className="h-11 text-base sm:text-sm" />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-foreground text-sm">Password</Label>
                <Link to="/forgot-password" className="text-primary text-xs hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input type={showPassword ? "text": "password"} placeholder="Enter your password" {...register("password")} className="h-11 text-base sm:text-sm" />
                <Button className="absolute right-3 top-1.5 cursor-pointer text-secondary hover:text-muted-foreground transition-colors p-2 -mr-1" onClick={() => setShowPassword(!showPassword)}>
                 {showPassword ? <EyeOff/> : <Eye />}
                </Button>
              </div>
               {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>
            <Button className="w-full h-11 font-medium cursor-pointer" type="submit">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : "Sign in"}
            </Button>
          </form>
          <p className="text-secondary text-center text-sm">Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link></p>
        </CardContent>
      </Card>
      </div>
      </div>
    </div>
  );
};

export default SignInPage;
