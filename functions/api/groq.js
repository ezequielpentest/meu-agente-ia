// functions/api/groq.js
export async function onRequest(context) {
  const { request, env } = context;
  
  // Headers CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // Preflight request (OPTIONS)
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  // Aceita apenas POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Extrai os dados do corpo da requisição
    const { messages, system } = await request.json();
    
    // Pega a API Key das variáveis de ambiente
    const GROQ_API_KEY = env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY não configurada');
      return new Response(JSON.stringify({ error: 'API Key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Formata as mensagens para a API da Groq
    const formattedMessages = [
      { role: "system", content: system },
      ...messages
    ];
    
    console.log('Enviando para Groq. Modelo: llama-3.3-70b-versatile');
    console.log('Mensagens:', JSON.stringify(formattedMessages).substring(0, 500));
    
    // Faz a chamada para a API da Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',  // Modelo atual e estável
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1500
      })
    });
    
    const data = await response.json();
    
    // Log da resposta para debug
    console.log('Status da resposta Groq:', response.status);
    
    // Verifica se a resposta foi bem sucedida
    if (!response.ok) {
      console.error('Erro da API Groq:', data);
      return new Response(JSON.stringify({ 
        error: data.error?.message || 'API Groq error',
        status: response.status
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Extrai a mensagem do assistente
    const assistantMessage = data.choices?.[0]?.message?.content || "";
    
    if (!assistantMessage) {
      console.error('Resposta vazia da Groq:', data);
      return new Response(JSON.stringify({ 
        error: 'Empty response from Groq API'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Resposta recebida com sucesso. Tamanho:', assistantMessage.length);
    
    // Retorna no formato que o frontend espera
    return new Response(JSON.stringify({
      content: [{ text: assistantMessage }]
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Erro no worker Groq:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
