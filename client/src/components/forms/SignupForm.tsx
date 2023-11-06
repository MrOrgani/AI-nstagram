import * as z from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupValidation } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "../shared/Loader";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queries";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // Queries
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } =
    useSignInAccount();

  // Handler
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        toast({ title: "Sign up failed. Please try again." });

        return;
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ title: "Something went wrong. Please login your new account" });

        // navigate("/sign-in");

        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();

        navigate("/");
      } else {
        toast({ title: "Login failed. Please try again." });

        return;
      }
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignup)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" autoComplete="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="text" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      id="current-password"
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
