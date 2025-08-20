import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    
    if (!question) {
      return new Response(
        JSON.stringify({ error: 'Question is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user's API key
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (apiKeyError || !apiKeyData) {
      return new Response(
        JSON.stringify({ error: 'API key not found' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Make request to your external API
    const apiResponse = await fetch('http://18.230.116.139:8000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKeyData.api_key
      },
      body: JSON.stringify({ question })
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('External API error:', errorText);
      return new Response(
        JSON.stringify({ 
          error: 'API request failed', 
          details: errorText 
        }), 
        { 
          status: apiResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const result = await apiResponse.json();

    // Update API key usage statistics
    const now = new Date();
    const resetTime = new Date(apiKeyData.last_reset_at);
    
    let currentRequests = apiKeyData.current_requests;
    let lastResetAt = apiKeyData.last_reset_at;
    
    // Check if we need to reset daily counter
    if (resetTime.toDateString() !== now.toDateString()) {
      currentRequests = 0;
      lastResetAt = now.toISOString();
    }
    
    // Increment request count
    currentRequests += 1;

    // Update the database
    await supabase
      .from('api_keys')
      .update({
        current_requests: currentRequests,
        last_reset_at: lastResetAt
      })
      .eq('id', apiKeyData.id);

    // Save chat history
    await supabase
      .from('chat_history')
      .insert([
        {
          user_id: user.id,
          role: 'user',
          message: question
        },
        {
          user_id: user.id,
          role: 'assistant',
          message: result.answer || 'No response from AI'
        }
      ]);

    return new Response(
      JSON.stringify(result), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});