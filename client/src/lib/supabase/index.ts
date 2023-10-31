import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_DB_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default supabase;
