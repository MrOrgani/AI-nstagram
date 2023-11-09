import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

const apiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const ai = new OpenAI({ apiKey: apiKey ?? "" });

  const { prompt } = await req.json();

  const aiResponse = await ai.images.generate({
    prompt,
    n: 1,
    size: "1024x1024",
    response_format: "b64_json",
    model: "dall-e-3",
  });
  if (aiResponse.error) {
    return new Response(JSON.stringify(aiResponse.error), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
  const res = new Response(
    JSON.stringify({ generatedImages: aiResponse.data }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
  return res;
});
