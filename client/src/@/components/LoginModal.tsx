import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import { Card } from "./ui/card";
import { cn, createOrGetUser, signInUser, signUpUser } from "../lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button, buttonVariants } from "./ui/button";
import { Icons } from "./ui/icons";
import { GoogleLogin } from "@react-oauth/google";
import { ImCross } from "react-icons/im";
import { useToast } from "./ui/use-toast";

interface LoginModalProps {
  initialDisplay?: boolean;
  displayButton?: boolean;
  onClose?: () => void;
}

const LoginModal = ({
  initialDisplay = false,
  displayButton = true,
  onClose,
}: LoginModalProps) => {
  const { userProfile } = useAuthStore();
  const [diplayModal, setDiplayModal] = useState(initialDisplay);

  const [mode, settMode] = useState<"signup" | "signin">("signin");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (userProfile?.id) {
    return null;
  }

  const user = userProfile;

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    const { data, error } =
      mode === "signup"
        ? await signUpUser({ email, password, name })
        : await signInUser({ email, password });
    if (error) {
      setError(error.message);
    }

    //TODO: Do we need Data ?
  }

  return (
    <>
      {displayButton ? (
        <Button
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          )}
          onClick={() => setDiplayModal(true)}
        >
          Sign in
        </Button>
      ) : null}

      {diplayModal ? (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="fixed inset-0 bg-black opacity-50 z-50" />
          <Card className="fixed flex flex-col items-center justify-center mx-auto my-auto z-50 p-10">
            <div className="flex flex-col space-y-2 text-center">
              <div
                className="absolute top-0 right-0 p-4 cursor-pointer"
                onClick={() => {
                  setDiplayModal(false);
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                <ImCross />
              </div>
              <div className="flex justify-center">
                <span
                  className={`text-2xl ${
                    mode === "signin"
                      ? "font-semibold"
                      : "text-muted-foreground"
                  } tracking-tight`}
                  onClick={() => settMode("signin")}
                >
                  Sign in
                </span>
                <span className={`text-2xl font-semiboldtracking-tight mx-2`}>
                  |
                </span>
                <span
                  className={`text-2xl ${
                    mode === "signup"
                      ? "font-semibold"
                      : "text-muted-foreground"
                  } tracking-tight`}
                  onClick={() => settMode("signup")}
                >
                  Sign up
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter your email below to connect
              </p>
            </div>
            <div className={cn("grid gap-6")}>
              <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="email">
                      Email
                    </Label>
                    {mode === "signup" ? (
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
                    {mode === "signup" ? (
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
                  {error && (
                    <div className="flex align-middle justify-center">
                      <p className="text-xs text-muted-foreground text-red-600 justify-center">
                        {error}
                      </p>
                    </div>
                  )}
                  <Button disabled={isLoading}>
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {mode === "signup" ? `Sign Up` : `Sign In`} with Email
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
                  onSuccess={(response) => createOrGetUser(response)}
                />
              )}
              <p className="px-8 text-center text-sm text-muted-foreground">
                {mode === "signup" ? (
                  <>
                    Already have an account ?{" "}
                    <span
                      onClick={() => settMode("signin")}
                      className="underline"
                    >
                      Sign in!
                    </span>
                  </>
                ) : (
                  <>
                    No account ?{" "}
                    <span
                      onClick={() => settMode("signup")}
                      className="underline"
                    >
                      Sign up!
                    </span>
                  </>
                )}
              </p>
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
};

export default LoginModal;
