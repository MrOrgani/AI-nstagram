import { GoogleLogin } from "@react-oauth/google";
import supabase from "@/lib/supabase";

export const GoogleForm = () => {
  // Handler
  const createOrGetUser = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      throw new Error("Error when connecting with Google");
    }
  };

  return <GoogleLogin onSuccess={createOrGetUser} />;
};
