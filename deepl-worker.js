// 게임 케이스 ↔ DeepL 연결 서버 (Cloudflare Worker)
//
// DeepL은 웹페이지에서 바로 부르는 것을 막아 두었기 때문에(CORS 차단),
// 이 작은 서버가 게임 케이스의 번역 요청을 받아 DeepL로 전달합니다.
//
// DeepL API 키는 이 파일에 넣지 말고, Cloudflare의 Worker 설정에서
// 비밀 변수(Secret) DEEPL_KEY 로 넣으세요. (README의 'DeepL 번역' 참고)
// 이 저장소는 공개되어 있어서, 여기에 키를 적으면 누구나 볼 수 있어요.

// 이 연결 서버를 쓸 수 있는 웹 주소. 게임 케이스를 다른 주소에 올렸다면 여기에 추가하세요.
const ALLOWED_ORIGINS = ['https://qqh430.github.io'];

const PASS_FIELDS = ['source_lang', 'formality', 'context', 'glossary_id', 'preserve_formatting', 'split_sentences', 'model_type'];
const MAX_TEXTS = 50;
const MAX_CHARS = 30000;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (!allowed) return reply({ message: '허용되지 않은 주소에서 온 요청이에요' }, 403, cors);

    const key = (env && env.DEEPL_KEY || '').trim();
    if (!key) return reply({ message: 'DeepL 키가 설정되지 않았어요. Worker 설정에 DEEPL_KEY를 넣어 주세요' }, 500, cors);
    const host = key.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
    const auth = { 'Authorization': 'DeepL-Auth-Key ' + key };
    const path = new URL(request.url).pathname.replace(/\/+$/, '') || '/';

    let upstream;
    try {
      if (path === '/translate' && request.method === 'POST') {
        let body;
        try { body = await request.json(); } catch (e) { return reply({ message: '요청 내용을 읽을 수 없어요' }, 400, cors); }
        const text = Array.isArray(body && body.text) ? body.text.map(String) : null;
        if (!text || !text.length || text.length > MAX_TEXTS) return reply({ message: `문장은 한 번에 1~${MAX_TEXTS}개까지 보낼 수 있어요` }, 400, cors);
        if (text.reduce((n, t) => n + t.length, 0) > MAX_CHARS) return reply({ message: '한 번에 보내는 글자가 너무 많아요' }, 413, cors);
        const out = { text, target_lang: String(body.target_lang || 'KO') };
        for (const k of PASS_FIELDS) if (body[k] != null) out[k] = body[k];
        upstream = await fetch(host + '/v2/translate', {
          method: 'POST',
          headers: { ...auth, 'Content-Type': 'application/json' },
          body: JSON.stringify(out),
        });
      } else if (path === '/usage' && request.method === 'GET') {
        upstream = await fetch(host + '/v2/usage', { headers: auth });
      } else if (path === '/' && request.method === 'GET') {
        return reply({ ok: true, service: 'game-case-deepl' }, 200, cors);
      } else {
        return reply({ message: '없는 주소예요' }, 404, cors);
      }
    } catch (e) {
      return reply({ message: 'DeepL 서버에 연결하지 못했어요' }, 502, cors);
    }

    const headers = new Headers(cors);
    headers.set('Content-Type', upstream.headers.get('Content-Type') || 'application/json');
    return new Response(upstream.body, { status: upstream.status, headers });
  },
};

function reply(obj, status, cors) {
  return new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } });
}
