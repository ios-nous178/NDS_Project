/**
 * tools/scenario-board.ts — 목업 산출물에 강제로 박는 "시나리오 보드 (리뷰용 가이드)".
 *
 * 목적: 생성된 목업(공유용 dist + 앱 라이브 미리보기)에 **에이전트가 우회할 수 없는**
 * 고정 형태의 우측 패널을 박아, 이 목업을 처음 보는 사람을 위한 화면 흐름·조작 가이드를
 * 항상 노출한다. ds-stamp.ts 의 자매 — 같은 "결정론적 주입" 원리.
 *
 * 역할 분리:
 *  - 콘텐츠(flow / 화면별 설명·조작팁 / 엣지케이스)는 **AI 가 작성한** JSON 블록
 *    (`<script type="application/json" data-nds-scenario>{…}</script>`)에 담긴다 — 의미 정보라
 *    AI 가 채워야 하며, scenario-coverage.ts 게이트가 누락을 차단한다(prd-coverage 미러).
 *  - 셸(CSS + 컨테이너 + 드라이버 JS)은 여기서 **결정론적으로** 주입한다. 드라이버는 런타임에
 *    위 JSON 블록을 읽어 패널을 렌더하고, `[data-screen]` 규약으로 "지금 보는 화면"을 라이브 싱크한다.
 *
 * 순수 문자열 연산(no fs / no cheerio) — build-html(dist) 과 라이브 프리뷰 양쪽에서 같은 함수로 주입.
 *
 * 멱등: injectScenarioBoard 는 항상 기존 보드를 먼저 걷어내고 새로 박으므로 재주입해도 1개만 남는다.
 */

/** 보드 셸 엘리먼트(style/panel/driver 공통)를 식별하는 attribute. strip 의 기준. */
export const SCENARIO_BOARD_MARKER = "data-nds-scenario-board";

/** AI 가 작성하는 콘텐츠 JSON 블록의 식별 attribute (scenario-coverage 게이트가 검증). */
export const SCENARIO_DATA_ATTR = "data-nds-scenario";

export interface ScenarioFlowStep {
  /** 화면 키 — `[data-screen="key"]` 및 screens[key] 와 일치해야 한다. */
  key: string;
  /** 흐름 단계 제목(예: "로그인"). */
  title: string;
  /** 보조 설명(예: "신규 광고주 진입 · 설득"). */
  sub?: string;
}

export interface ScenarioScreen {
  /** 이 화면이 무엇을 하는 화면인지 한 줄 설명. */
  desc: string;
  /** 이 화면에서의 조작 가이드(불릿). */
  tips?: string[];
}

export interface ScenarioEdgeCase {
  /** 이 엣지케이스가 속한 화면 키 — 해당 화면일 때만 노출. 생략 시 항상 노출. */
  screen?: string;
  /** 엣지케이스 버튼 라벨(예: "광고계정 0개 · 빈 상태"). */
  label: string;
  /** 보조 설명. */
  note?: string;
}

export interface ScenarioData {
  /** 전체 플로우(번호가 붙는 단계 목록). */
  flow: ScenarioFlowStep[];
  /** 화면 키 → 화면별 설명·조작팁. */
  screens: Record<string, ScenarioScreen>;
  /** 모든 화면 공통 조작팁. */
  commonTips?: string[];
  /** 엣지케이스(빈 상태 등) 안내. */
  edgeCases?: ScenarioEdgeCase[];
}

/**
 * HTML 에서 AI 가 작성한 `data-nds-scenario` JSON 블록을 추출해 파싱한다. 없거나 깨졌으면 null.
 * 순수 정규식 — cheerio 없이 build/preview 양쪽에서 쓴다.
 */
export function parseScenarioFromHtml(html: string): ScenarioData | null {
  const m = html.match(
    /<script\b[^>]*\bdata-nds-scenario\b[^>]*>([\s\S]*?)<\/script>/i,
  );
  if (!m) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(m[1].trim());
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const data = parsed as Partial<ScenarioData>;
  if (!Array.isArray(data.flow) || data.flow.length === 0) return null;
  if (!data.screens || typeof data.screens !== "object") return null;
  return {
    flow: data.flow,
    screens: data.screens,
    commonTips: Array.isArray(data.commonTips) ? data.commonTips : [],
    edgeCases: Array.isArray(data.edgeCases) ? data.edgeCases : [],
  };
}

// 고정 팔레트 — 브랜드 cascade 와 무관한 "시스템 리뷰 가이드" 다크 패널 색. 어떤 목업 위에서도 동일.
const SB = {
  width: 320,
  bg: "#16181d",
  panelBg: "#1e2128",
  border: "#2a2d35",
  text: "#d7dbe2",
  textDim: "#8a90a0",
  textStrong: "#ffffff",
  accent: "#ffd200", // 리뷰 가이드 옐로우(브랜드 옐로우와 별개의 시스템 색)
  currentBg: "#2a2410",
};

/**
 * 시나리오 보드 셸(style + panel + driver) 마크업 문자열. **콘텐츠를 모른다** — 드라이버가
 * 런타임에 `data-nds-scenario` JSON 을 읽어 채운다.
 *
 * - 우측 고정 패널(320px) + 토글 탭. 열림 시 html padding-right 로 본문을 밀어 비-겹침.
 *   토글로 접으면 padding 0 → 좁은 뷰포트/모바일 목업도 가린 채 볼 수 있다.
 * - 인쇄 시 숨김(@media print). z-index 는 stamp 바 아래(보드는 패널, stamp 는 워터마크).
 */
export function renderScenarioBoard(): string {
  const style =
    `<style ${SCENARIO_BOARD_MARKER}="style">` +
    `@media print{[${SCENARIO_BOARD_MARKER}]{display:none!important}html{padding-right:0!important}}` +
    `html.ndssb-open{padding-right:${SB.width}px}` +
    `.ndssb{position:fixed;top:0;right:0;width:${SB.width}px;height:100vh;box-sizing:border-box;` +
    `background:${SB.bg};color:${SB.text};z-index:2147483600;display:flex;flex-direction:column;gap:18px;` +
    `padding:22px 18px;overflow-y:auto;border-left:1px solid ${SB.border};` +
    `font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard",sans-serif;` +
    `font-size:13px;line-height:1.55;transform:translateX(0);transition:transform .2s ease}` +
    `html:not(.ndssb-open) .ndssb{transform:translateX(100%)}` +
    `.ndssb-toggle{position:fixed;top:14px;right:0;z-index:2147483601;box-sizing:border-box;` +
    `display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border:0;cursor:pointer;` +
    `border-radius:8px 0 0 8px;background:${SB.bg};color:${SB.accent};border:1px solid ${SB.border};border-right:0;` +
    `font-family:inherit;font-size:12px;font-weight:700;box-shadow:-2px 2px 10px rgba(0,0,0,.25)}` +
    `html.ndssb-open .ndssb-toggle{right:${SB.width}px}` +
    `.ndssb-head{display:flex;flex-direction:column}` +
    `.ndssb-title{font-size:15px;font-weight:800;color:${SB.textStrong}}` +
    `.ndssb-sub{font-size:12px;color:${SB.textDim};margin-top:4px}` +
    `.ndssb-sec{display:flex;flex-direction:column;gap:9px}` +
    `.ndssb-label{font-size:11px;font-weight:800;letter-spacing:.4px;color:${SB.accent};text-transform:uppercase}` +
    `.ndssb-flow{display:flex;flex-direction:column;gap:8px}` +
    `.ndssb-step{display:flex;gap:10px;align-items:flex-start;padding:10px;border-radius:10px;` +
    `background:${SB.panelBg};border:1px solid ${SB.border};cursor:pointer;text-align:left}` +
    `.ndssb-step.is-current{background:${SB.currentBg};border-color:${SB.accent}}` +
    `.ndssb-num{width:20px;height:20px;border-radius:9999px;background:${SB.border};color:#c7ccd6;` +
    `font-size:12px;font-weight:700;display:grid;place-items:center;flex:0 0 auto}` +
    `.ndssb-step.is-current .ndssb-num{background:${SB.accent};color:#1a1a1a}` +
    `.ndssb-step b{color:${SB.textStrong};font-size:13px;display:block}` +
    `.ndssb-step-tx span{display:block;color:${SB.textDim};font-size:12px;margin-top:1px}` +
    `.ndssb-now{background:${SB.panelBg};border:1px solid ${SB.border};border-radius:10px;padding:12px;color:#c7ccd6}` +
    `.ndssb-tips{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}` +
    `.ndssb-tips li{position:relative;padding-left:14px;color:#c7ccd6}` +
    `.ndssb-tips li::before{content:"";position:absolute;left:0;top:7px;width:5px;height:5px;` +
    `border-radius:9999px;background:${SB.accent}}` +
    `.ndssb-edge{margin-bottom:10px}` +
    `.ndssb-edge-label{display:block;padding:9px 12px;border-radius:10px;background:${SB.currentBg};` +
    `border:1px solid ${SB.accent};color:${SB.accent};font-size:13px;font-weight:700;text-align:center}` +
    `.ndssb-edge-note{margin-top:6px;font-size:11px;color:${SB.textDim}}` +
    `.ndssb-foot{margin-top:auto;font-size:11px;color:#6b7180}` +
    `</style>`;

  const panel =
    `<aside ${SCENARIO_BOARD_MARKER}="panel" class="ndssb" role="complementary" aria-label="시나리오 보드">` +
    `<div class="ndssb-head"><div class="ndssb-title">시나리오 보드</div>` +
    `<div class="ndssb-sub">이 목업을 처음 보는 분을 위한 화면 흐름·조작 가이드</div></div>` +
    `<div class="ndssb-sec"><div class="ndssb-label">전체 플로우</div>` +
    `<div class="ndssb-flow" data-ndssb="flow"></div></div>` +
    `<div class="ndssb-sec"><div class="ndssb-label">지금 보는 화면</div>` +
    `<div class="ndssb-now" data-ndssb="now"></div></div>` +
    `<div class="ndssb-sec"><div class="ndssb-label">조작 가이드</div>` +
    `<ul class="ndssb-tips" data-ndssb="tips"></ul></div>` +
    `<div class="ndssb-sec" data-ndssb="edge-sec" hidden><div class="ndssb-label">엣지케이스</div>` +
    `<div data-ndssb="edge"></div></div>` +
    `<div class="ndssb-foot" data-ndssb="foot"></div>` +
    `</aside>`;

  const toggle =
    `<button type="button" ${SCENARIO_BOARD_MARKER}="toggle" data-ndssb="toggle-btn" class="ndssb-toggle" ` +
    `aria-label="시나리오 보드 토글" title="시나리오 보드 토글">` +
    `<span data-ndssb="toggle-ic" aria-hidden="true">›</span><span data-ndssb="toggle-tx">가이드</span></button>`;

  return style + panel + toggle + `<script ${SCENARIO_BOARD_MARKER}="driver">${SCENARIO_DRIVER}</script>`;
  // 주: 클래스 prefix 는 `ndssb`(=`nds-` 미시작) — validator 의 unknown-nds-class 오탐 회피.
}

/**
 * 런타임 드라이버 — 브라우저에서 `data-nds-scenario` JSON 을 읽어 패널을 채우고,
 * `[data-screen]` 가시성을 관찰해 "지금 보는 화면"을 라이브 싱크한다. 콘텐츠는 전적으로 JSON 에서 옴.
 */
const SCENARIO_DRIVER = `(function(){
  var root=document.documentElement;
  var dataEl=document.querySelector('script[type="application/json"][data-nds-scenario]');
  var data=null; try{data=dataEl?JSON.parse(dataEl.textContent||"{}"):null;}catch(e){}
  if(!data||!Array.isArray(data.flow)||!data.flow.length)return;
  var screens=data.screens||{};
  var byKey={}; data.flow.forEach(function(s,i){byKey[s.key]=i;});
  function q(n){return document.querySelector('[data-ndssb="'+n+'"]');}
  function txt(el,t){if(el)el.textContent=t==null?"":String(t);}

  // 전체 플로우 렌더(클릭 시 해당 화면 표시 시도 + 이벤트 dispatch)
  var flowEl=q("flow");
  if(flowEl){flowEl.innerHTML="";data.flow.forEach(function(s,i){
    var b=document.createElement("button");b.type="button";b.className="ndssb-step";
    b.setAttribute("data-ndssb-step",s.key);
    b.innerHTML='<span class="ndssb-num">'+(i+1)+'</span><div class="ndssb-step-tx"><b></b><span></span></div>';
    b.querySelector("b").textContent=s.title||s.key;
    b.querySelector(".ndssb-step-tx span").textContent=s.sub||"";
    b.addEventListener("click",function(){navTo(s.key);});
    flowEl.appendChild(b);
  });}

  // 공통 푸터(commonTips 는 조작 가이드 뒤에 합쳐 노출하므로 푸터엔 안내문)
  txt(q("foot"),"브라우저 뒤로가기로 이전 화면으로 돌아갈 수 있습니다.");

  function renderScreen(key){
    var sc=screens[key]||screens[data.flow[0].key]||{};
    txt(q("now"),sc.desc||"");
    var tips=q("tips");
    if(tips){tips.innerHTML="";
      var all=(sc.tips||[]).concat(data.commonTips||[]);
      all.forEach(function(t){var li=document.createElement("li");li.textContent=t;tips.appendChild(li);});
    }
    document.querySelectorAll('[data-ndssb-step]').forEach(function(el){
      el.classList.toggle("is-current",el.getAttribute("data-ndssb-step")===key);
    });
    // 엣지케이스(해당 화면 또는 화면 무관)
    var edges=(data.edgeCases||[]).filter(function(e){return !e.screen||e.screen===key;});
    var sec=q("edge-sec"),wrap=q("edge");
    if(wrap){wrap.innerHTML="";edges.forEach(function(e){
      var d=document.createElement("div");d.className="ndssb-edge";
      var lab=document.createElement("span");lab.className="ndssb-edge-label";lab.textContent=e.label||"";
      d.appendChild(lab);
      if(e.note){var n=document.createElement("div");n.className="ndssb-edge-note";n.textContent=e.note;d.appendChild(n);}
      wrap.appendChild(d);
    });}
    if(sec)sec.hidden=edges.length===0;
  }

  // 현재 보이는 화면 = [data-screen] 중 hidden 이 아니고 화면에 보이는 것. 없으면 flow[0].
  function currentKey(){
    var els=document.querySelectorAll("[data-screen]");
    for(var i=0;i<els.length;i++){var el=els[i];
      if(el.hasAttribute("hidden"))continue;
      var st=window.getComputedStyle(el);
      if(st.display==="none"||st.visibility==="hidden")continue;
      var k=el.getAttribute("data-screen");
      if(k in byKey)return k;
    }
    return data.flow[0].key;
  }

  // 플로우 단계 클릭 → [data-screen] 규약을 쓰는 목업이면 직접 전환(없으면 이벤트만).
  function navTo(key){
    var els=document.querySelectorAll('[data-screen="'+key+'"]');
    if(els.length){
      document.querySelectorAll("[data-screen]").forEach(function(el){el.hidden=el.getAttribute("data-screen")!==key;});
      window.scrollTo(0,0);
    }
    document.dispatchEvent(new CustomEvent("nds-scenario-nav",{detail:{screen:key}}));
    sync();
  }

  var raf=0;
  function sync(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;renderScreen(currentKey());});}

  // [data-screen] 가시성 변화를 관찰해 라이브 싱크.
  var mo=new MutationObserver(sync);
  document.querySelectorAll("[data-screen]").forEach(function(el){
    mo.observe(el,{attributes:true,attributeFilter:["hidden","style","class"]});
  });
  document.addEventListener("nds-scenario-nav",sync);

  // 토글
  var tg=document.querySelector('[data-ndssb="toggle-btn"]');
  var tgIc=q("toggle-ic"),tgTx=q("toggle-tx");
  function setOpen(open){
    root.classList.toggle("ndssb-open",open);
    if(tgIc)tgIc.textContent=open?"›":"‹";
    if(tgTx)tgTx.textContent=open?"닫기":"가이드";
  }
  if(tg)tg.addEventListener("click",function(){setOpen(!root.classList.contains("ndssb-open"));});
  setOpen(true);

  renderScreen(currentKey());
})();`;

/** 기존 보드(style + panel + toggle + driver)를 모두 제거. 재주입 멱등성의 핵심. */
export function stripScenarioBoard(html: string): string {
  return html
    .replace(/<style\b[^>]*\bdata-nds-scenario-board\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<aside\b[^>]*\bdata-nds-scenario-board\b[^>]*>[\s\S]*?<\/aside>/gi, "")
    .replace(/<button\b[^>]*\bdata-nds-scenario-board\b[^>]*>[\s\S]*?<\/button>/gi, "")
    .replace(/<script\b[^>]*\bdata-nds-scenario-board\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

/**
 * HTML 에 시나리오 보드를 주입(기존 보드는 먼저 제거 → 항상 1개). AI 가 작성한 `data-nds-scenario`
 * JSON 블록이 있을 때만 주입한다(없으면 빈 패널을 박지 않음 — 누락은 scenario-coverage 게이트가 차단).
 * </body> 직전에 삽입하고, </body> 가 없으면 끝에 덧붙인다.
 */
export function injectScenarioBoard(html: string): string {
  const cleaned = stripScenarioBoard(html);
  // 콘텐츠 블록이 없으면 셸을 박지 않는다(빈 다크 패널 방지). 게이트가 별도로 누락을 막는다.
  if (!parseScenarioFromHtml(cleaned)) return cleaned;
  const block = renderScenarioBoard();
  if (/<\/body>/i.test(cleaned)) return cleaned.replace(/<\/body>/i, `${block}</body>`);
  return cleaned + block;
}
