# 게임 케이스

zip으로 묶은 HTML 게임을 아이폰 Safari에서 이미지·CSS·스크립트·사운드까지 그대로 실행하는 웹앱입니다. 홈 화면에 추가하면 앱처럼 쓸 수 있고, 한 번 열고 나면 인터넷 없이도 열립니다.

## 들어 있는 파일

| 파일 | 역할 |
| --- | --- |
| `index.html` | 앱 본체 |
| `jszip.min.js` | zip 압축 해제 라이브러리 (JSZip 3.10.1, MIT) |
| `sw.js` | 오프라인 실행용 캐시 |
| `manifest.webmanifest` | 홈 화면 앱 설정 |
| `icon-*.png`, `favicon.png` | 아이콘 |
| `deepl-worker.js` | DeepL 연결 서버 코드 (Cloudflare Worker에 붙여넣기용) |
| `.nojekyll` | GitHub Pages가 파일을 그대로 올리도록 하는 표시 파일 |

## 아이폰만으로 GitHub Pages에 올리기

1. Safari에서 github.com에 로그인합니다.
2. 오른쪽 위 **+** → **New repository**를 누릅니다. 이름은 `game-case`처럼 정하고 **Public**으로 만듭니다.
3. 새 저장소에서 **uploading an existing file** 링크(또는 **Add file → Upload files**)를 누릅니다.
4. 파일 앱에서 받은 zip을 눌러 압축을 풀고, 풀린 폴더 안의 파일을 **모두** 선택해 올린 뒤 **Commit changes**를 누릅니다.
   - `index.html`이 저장소 맨 위에 있어야 합니다. 폴더째 올라가면 안 됩니다.
   - `.nojekyll`은 숨김 파일이라 안 보일 수 있습니다. 빠져도 동작에는 문제없습니다.
5. 저장소의 **Settings → Pages**로 갑니다. **Branch**를 `main`, 폴더를 `/ (root)`로 고르고 **Save**를 누릅니다.
6. 1~2분 뒤 같은 화면 위쪽에 주소가 뜹니다. 보통 `https://내아이디.github.io/game-case/` 입니다.

## 홈 화면에 추가

1. 위 주소를 Safari로 엽니다.
2. 공유 버튼 → **홈 화면에 추가** → **추가**를 누릅니다.

## 게임 넣기

1. 파일 앱에서 게임 폴더를 길게 누르고 **압축**을 누릅니다.
2. 게임 케이스에서 **zip 파일 넣기**를 누르고 만든 zip을 고릅니다.
3. 보관함의 카드를 누르면 실행됩니다. 위쪽 **← 보관함**으로 돌아오고, **다시 시작**으로 처음부터 실행합니다.

## 번역

게임 화면 위쪽의 **번역**을 누르면 영어 글자를 한국어로 바꿔요. 다시 누르면 원문으로 돌아가요.

- 번역 엔진은 **⋯ → 번역 설정 · 단어장**에서 고릅니다. 기본은 DeepL(연결 주소를 넣었을 때)이고, 안 되면 Google, Microsoft 순서로 넘어가요. Google Cloud API 키가 있으면 직접 넣어 쓸 수도 있어요.
- 번역하려면 화면의 게임 글자가 번역 서버로 보내져요. 한 번 번역한 문장은 기기에 저장해서 다시 보내지 않아요.

### 뜻 바꾸기

- 번역된 글자를 길게 눌러 선택하면 아래에 **뜻 바꾸기** 버튼이 떠요.
- 또는 **⋯ → 뜻 바꾸기 모드**를 켜고 문장을 누르세요. 이 모드에서는 눌러도 게임이 진행되지 않아요.
- 바꿀 말과 원하는 뜻을 넣고 **모든 번역에서** 또는 **이 문장에서만**을 고릅니다. **문장 전체를 위 번역으로 고정**으로 문장 하나를 통째로 고칠 수도 있어요.
- 저장한 내용은 **번역 설정 · 단어장**에서 보고 지울 수 있어요.

## DeepL 번역

DeepL은 보안 정책상 웹페이지에서 바로 부를 수 없어서(CORS 차단), 무료 Cloudflare Worker로 작은 연결 서버를 하나 만들어야 해요. 아이폰 Safari만으로 할 수 있어요.

1. [dash.cloudflare.com](https://dash.cloudflare.com)에 무료로 가입하고 로그인합니다.
2. 메뉴에서 **Workers & Pages**(또는 **Compute**) → **Create** → **Hello World**로 Worker를 만들고 이름을 정한 뒤(예: `game-case-deepl`) **Deploy**를 누릅니다.
3. **Edit code**를 눌러 기존 코드를 모두 지우고, [deepl-worker.js 원문](https://raw.githubusercontent.com/qqh430/game--case/main/deepl-worker.js)을 전체 복사해 붙여넣은 뒤 **Deploy**를 누릅니다.
4. Worker의 **Settings → Variables and Secrets → Add**에서 종류를 **Secret**으로, 이름을 `DEEPL_KEY`로, 값에 DeepL API 키를 넣고 저장(**Deploy**)합니다.
   - 키는 이 저장소에 적지 마세요. 저장소가 공개라서 누구나 볼 수 있어요.
5. Worker 주소(`https://game-case-deepl.내계정.workers.dev`)를 복사합니다.
6. 게임 케이스의 게임 화면 → **⋯ → 번역 설정 · 단어장** → **DeepL 연결 주소**에 붙여넣고 **연결 확인 · 사용량 보기**를 누릅니다. "연결됐어요"가 나오면 끝이에요.

- 번역 엔진이 **자동**이면 DeepL을 먼저 쓰고, DeepL이 안 되면(사용량 초과 등) Google·Microsoft로 넘어가요. 화면 왼쪽 아래에 이유가 표시돼요.
- **DeepL 말투**에서 반말 쪽 / 존댓말 쪽을 고를 수 있어요.
- DeepL 무료 플랜은 한 달 50만 자까지예요. 한 번 번역한 문장은 기기에 저장돼서 다시 쓰지 않아요.
- 게임 케이스를 `qqh430.github.io`가 아닌 다른 주소에 올렸다면 `deepl-worker.js` 맨 위 `ALLOWED_ORIGINS`에 그 주소를 추가하세요.

## 알아둘 점

- 게임은 이 기기의 브라우저 저장소에 보관됩니다. 홈 화면 앱과 Safari 탭은 저장소가 따로라서, 넣은 게임이 서로 보이지 않습니다.
- Safari 방문 기록·웹사이트 데이터를 지우면 보관한 게임도 지워집니다.
- zip 안에서 `index.html`을 먼저 엽니다. 없으면 가장 바깥쪽 `.html` 파일을 엽니다.
- 다른 파일을 `import`로 불러오는 모듈 스크립트, Web Worker, `location.href`로 다른 페이지로 이동하는 게임은 일부 동작하지 않을 수 있습니다.

## 고치고 나서 업데이트가 안 보일 때

앱은 저장된 버전을 먼저 띄우고 새 버전은 뒤에서 받습니다. 파일을 바꿔 올린 뒤에는 앱을 한 번 열었다 닫고 다시 열면 반영됩니다.
