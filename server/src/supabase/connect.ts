import { createClient } from "@supabase/supabase-js";

const getClient = (url: string, key: string) => {
  const supabaseClient = createClient(url, key);

  return supabaseClient;
};

export default getClient;
