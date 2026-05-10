// functions/api/auth.js
export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const { username, password } = await request.json();
    
    // ⚠️ CREDENCIAIS SEGURAS - Configure no Cloudflare Dashboard
    const VALID_USERNAME = env.ADMIN_USERNAME;
    const VALID_PASSWORD = env.ADMIN_PASSWORD;
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Authenticated"
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: "Invalid credentials"
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
