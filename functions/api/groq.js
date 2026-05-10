// functions/api/groq.js
export async function onRequest(context) {
  const { request, env } = context;
  
  // Apenas POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const { messages, system } = await request.json();
    const GROQ_API_KEY = env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: 'API Key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Prepara o histórico de mensagens
    const formattedMessages = [
      { role: "system", content: system },
      ...messages
    ];
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',  // Modelo rápido e inteligente
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1500
      })
    });
    
    const data = await response.json();
    
    // Retorna no formato esperado pelo frontend
    return new Response(JSON.stringify({
      content: [{ text: data.choices?.[0]?.message?.content || "Sem resposta" }]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
