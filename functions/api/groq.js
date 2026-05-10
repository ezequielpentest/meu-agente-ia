// functions/api/groq.js
export async function onRequest(context) {
  const { request, env } = context;
  
  // Headers CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // Preflight request
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
    const { messages, system } = await request.json();
    const GROQ_API_KEY = env.GROQ_API_KEY;
    
    console.log('API Key existe?', !!GROQ_API_KEY);
    console.log('Messages recebidas:', messages?.length);
    
    if (!GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: 'API Key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Prepara mensagens no formato Groq
    const formattedMessages = [
      { role: "system", content: system },
      ...messages
    ];
    
    console.log('Enviando para Groq...');
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1500
      })
    });
    
    const data = await response.json();
    console.log('Resposta status:', response.status);
    console.log('Resposta data:', JSON.stringify(data).substring(0, 500));
    
    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: data.error?.message || 'Erro na API Groq',
        status: response.status
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Extrai o texto da resposta no formato correto
    const assistantMessage = data.choices?.[0]?.message?.content || "";
    
    console.log('Mensagem extraída:', assistantMessage.substring(0, 200));
    
    // Retorna no formato que o frontend espera
    return new Response(JSON.stringify({
      content: [{ text: assistantMessage }]
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Erro no worker:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
