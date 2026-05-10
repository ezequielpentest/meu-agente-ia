// functions/api/register.js
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
    const { email, password, name } = await request.json();
    const db = env.DB;
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not connected' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email e senha são obrigatórios' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Verificar se usuário já existe
    const existing = await db.prepare('SELECT email FROM users WHERE email = ?').bind(email).first();
    if (existing) {
      return new Response(JSON.stringify({ error: 'Email já cadastrado' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Hash da senha (SHA-256)
    const encoder = new TextEncoder();
    const hashedPassword = await crypto.subtle.digest('SHA-256', encoder.encode(password));
    const hashHex = [...new Uint8Array(hashedPassword)].map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Inserir usuário
    await db
      .prepare("INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, ?)")
      .bind(email, hashHex, name || email.split('@')[0], Date.now())
      .run();
    
    return new Response(JSON.stringify({ success: true, message: "Conta criada com sucesso!" }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
