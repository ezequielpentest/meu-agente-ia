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
    const { email, password } = await request.json();
    const db = env.DB;
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not connected' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Buscar usuário no banco
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Usuário não encontrado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Hash da senha inserida para comparar
    const encoder = new TextEncoder();
    const hashedInput = await crypto.subtle.digest('SHA-256', encoder.encode(password));
    const hashHex = [...new Uint8Array(hashedInput)].map(b => b.toString(16).padStart(2, '0')).join('');
    
    if (hashHex !== user.password) {
      return new Response(JSON.stringify({ success: false, error: 'Senha incorreta' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Gerar token simples
    const token = btoa(`${email}:${Date.now()}`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      token: token,
      user: { email: user.email, name: user.name }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
