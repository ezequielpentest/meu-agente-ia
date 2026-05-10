/**
 * Cloudflare Pages Function — proxy seguro para a API DeepSeek
 * Variável de ambiente necessária: DEEPSEEK_API_KEY
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  const apiKey = env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "DEEPSEEK_API_KEY não configurada nas variáveis de ambiente do Cloudflare Pages." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  let body;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "Payload inválido" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }); }

  // DeepSeek usa formato OpenAI — system vira primeira mensagem
  const messages = [];
  if (body.system) messages.push({ role: "system", content: body.system });
  messages.push(...(body.messages || []));

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: body.model || "deepseek-chat",
      max_tokens: body.max_tokens || 1200,
      messages,
    }),
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
