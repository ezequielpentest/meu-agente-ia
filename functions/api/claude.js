// functions/api/claude.js
export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const { model, max_tokens, system, messages } = await request.json();
    
    const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
    
    if (!ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'API Key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-haiku-20240307',
        max_tokens: max_tokens || 1500,
        system: system,
        messages: messages
      })
    });
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
