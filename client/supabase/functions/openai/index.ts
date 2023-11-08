import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as openai from "https://deno.land/x/openai@1.2.1/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

const apiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.info("Request received: ", req.url);
  const ai = new openai.OpenAI(apiKey ?? "");

  const { prompt } = await req.json();
  console.info("1️⃣ prompt", prompt);

  const aiResponse = await ai.createImage({
    prompt,
    n: 1,
    size: "1024x1024",
    responseFormat: "b64_json",
  });
  console.info("2️⃣ aiResponse", aiResponse);

  if (aiResponse.error) {
    console.info("3️⃣ aiResponse.error", aiResponse.error.message);
    return new Response(
      JSON.stringify({ message: "There was an error on OpenAI server" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  const res = new Response(
    JSON.stringify({ photoUrl: aiResponse.data["0"].b64_json }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
  return res;
});
