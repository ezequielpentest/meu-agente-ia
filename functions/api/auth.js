// functions/api/auth.js
export async function onRequest(context) {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const { username, password } = await request.json();
    
    const VALID_USERNAME = env.ADMIN_USERNAME;
    const VALID_PASSWORD = env.ADMIN_PASSWORD;
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Authenticated successfully"
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: "Invalid credentials"
    }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
