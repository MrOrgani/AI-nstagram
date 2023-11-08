import { GoogleLogin } from "@react-oauth/google";
import supabase from "@/lib/supabase";
import { getURL } from "@/lib/utils";

export const GoogleForm = () => {
  // Handler
  const createOrGetUser = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getURL() },
    });
    if (error) {
      throw new Error("Error when connecting with Google");
    }
  };

  return <GoogleLogin onSuccess={createOrGetUser} />;
};
