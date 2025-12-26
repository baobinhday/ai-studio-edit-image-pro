import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Generate Image Endpoint
http.route({
  path: "/geminiGenerate",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      const body = await request.json();
      
      // Call the Node.js action
      const result = await ctx.runAction(api.geminiActions.generateImage, body);
      
      if (result.error) {
        return new Response(JSON.stringify({ error: result.error }), {
          status: result.status || 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ image: result.image }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }),
});

// Edit Image Endpoint
http.route({
  path: "/geminiEdit",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      const body = await request.json();
      
      // Call the Node.js action
      const result = await ctx.runAction(api.geminiActions.editImage, body);
      
      if (result.error) {
        return new Response(JSON.stringify({ error: result.error }), {
          status: result.status || 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ image: result.image }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;
