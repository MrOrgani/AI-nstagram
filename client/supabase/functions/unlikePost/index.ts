// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log(`Function "unlikePost" is up and running!`);

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      supabaseUrl,
      // Supabase API ANON KEY - env var exported by default.
      supabaseKey,
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );
    // We remove the like from the table
    const { post_id, user_id } = await req.json();

    await supabaseClient
      .from("likes")
      .delete()
      .eq("post_id", post_id)
      .eq("user_id", user_id);

    // We get the current likes of the liked post and decrement it by one
    const { data: currentPostLikes } = await supabaseClient
      .from("posts")
      .select("likes")
      .eq("id", post_id);

    const { data: updatedPost } = await supabaseClient
      .from("posts")
      .update({ likes: Math.max(0, parseInt(currentPostLikes?.[0].likes) - 1) })
      .eq("id", post_id);

    return new Response(JSON.stringify(updatedPost), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
