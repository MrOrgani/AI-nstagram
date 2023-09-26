import { useState } from "react";

import { Icons } from "./ui/icons";
import { Label } from "@radix-ui/react-label";
import { cn, createOrGetUser, signInUser, signUpUser } from "../lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { GoogleLogin } from "@react-oauth/google";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const location = useLocation();
  const signupPage = location.pathname === "/sign-up";

  const { userProfile, addUser } = useAuthStore();

  const user = userProfile;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    return signupPage
      ? signUpUser({ email, password, name }, addUser)
      : signInUser({ email, password }, addUser);
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {signupPage ? `Sign up` : `Sign in`}
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to connect
        </p>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              {signupPage ? (
                <Input
                  id="name"
                  placeholder="John Smith"
                  type="name"
                  autoCapitalize="none"
                  autoComplete="name"
                  autoCorrect="off"
                  disabled={isLoading}
                  onChange={(e) => setName(e.target.value)}
                />
              ) : null}
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                id="password"
                placeholder="Password"
                type="password"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value)}
              />
              {signupPage ? (
                <Input
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              ) : null}
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {signupPage ? `Sign Up` : `Sign In`} with Email
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" type="button" disabled={isLoading}>
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}
          Github
        </Button>
        {user ? (
          <div>Logged In</div>
        ) : (
          <GoogleLogin
            onSuccess={(response) => createOrGetUser(response, addUser)}
          />
        )}
        <p className="px-8 text-center text-sm text-muted-foreground">
          {signupPage ? (
            <>
              Already have an account ?{" "}
              <Link to={"/sign-in"} className="underline">
                Sign in!
              </Link>
            </>
          ) : (
            <>
              No account ?{" "}
              <Link to={"/sign-up"} className="underline">
                Sign up!
              </Link>
            </>
          )}
        </p>
      </div>
    </>
  );
}
