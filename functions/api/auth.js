// Cloudflare Pages Function - autenticação segura
export async function onRequest(context) {
  const { request } = context;
  
  // Apenas POST
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const { username, password } = await request.json();
    
    // Credenciais seguras nas Environment Variables
    const VALID_USER = context.env.ADMIN_USERNAME || "Usuário";
    const VALID_PASS = context.env.ADMIN_PASSWORD;
    
    if (username === VALID_USER && password === VALID_PASS) {
      // Gera token simples (opcional)
      const token = btoa(`${username}:${Date.now()}`);
      
      return new Response(JSON.stringify({ 
        success: true, 
        token: token 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500
    });
  }
}
