
function standardEscape(s){
  return String(s ?? '').replace(/[&<>"']/g, m => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[m]));
}
function standardHasEmoji(s){
  return /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(String(s||''));
}
function standardIconForStep(step){
  const t=String(step||'');
  if(/예루살렘 함락|멸망/.test(t)) return '🏚️';
  if(/70년|포로|바벨론/.test(t)) return '⛓️';
  if(/고레스|칙령/.test(t)) return '📜';
  if(/귀환|돌아/.test(t)) return '🚶';
  if(/제단/.test(t)) return '🔥';
  if(/성전|제2성전|예배/.test(t)) return '🏛️';
  if(/학개|스가랴|선지자/.test(t)) return '📣';
  if(/에스더|왕후/.test(t)) return '👑';
  if(/하만|음모/.test(t)) return '⚠️';
  if(/모르드개/.test(t)) return '🧔';
  if(/부림절|구원/.test(t)) return '🎉';
  if(/율법|말씀|에스라/.test(t)) return '📖';
  if(/회개|언약 갱신/.test(t)) return '😭';
  if(/성벽|느헤미야/.test(t)) return '🧱';
  if(/공동체/.test(t)) return '👥';
  if(/예수|그리스도|십자가|메시아/.test(t)) return '✝️';
  if(/교회/.test(t)) return '⛪';
  if(/새창조|새 예루살렘/.test(t)) return '👑';
  return '🔹';
}
function standardVerticalFlowHtml(text){
  const raw=String(text||'').trim();
  const parts=raw.split(/\s*(?:→|↓)\s*/).map(v=>v.trim()).filter(Boolean);
  if(parts.length<2) return standardEscape(raw).replace(/\n/g,'<br>');
  return parts.map(step=>{
    const labeled=standardHasEmoji(step)?step:`${standardIconForStep(step)} ${step}`;
    return standardEscape(labeled);
  }).join('<br>↓<br>');
}
function renderStandardExplore(value){
  const labels=[
    '❓ 핵심질문','💡 한 줄 핵심','📖 사건의 의미','📖 구속사 의미',
    '🔗 연결 흐름','🌍 성경 전체 흐름','🤔 생각해보기'
  ];
  function splitItem(x){
    let raw='';
    if(typeof x==='string'){
      raw=String(x||'').trim();
    }else{
      const title=String(x?.title||x?.label||'').trim();
      const text=String(x?.text||x?.content||x?.body||'').trim();
      raw=(title+(text?' '+text:'')).trim();
    }
    raw=raw.replace(/\s*\|\s*/g,' ');
    for(const label of labels){
      if(raw.startsWith(label)){
        return {title:label, text:raw.slice(label.length).trim()};
      }
    }
    return {title:'', text:raw};
  }
  function renderItem(x){
    const item=splitItem(x);
    const isFlow=/연결\s*흐름|성경\s*전체\s*흐름/.test(item.title)||item.text.includes('→')||item.text.includes('↓');
    const body=isFlow?standardVerticalFlowHtml(item.text):standardEscape(item.text).replace(/\n/g,'<br>');
    return `<div class="exploreCard">${item.title?`<b>${standardEscape(item.title)}</b>`:''}<p>${body}</p></div>`;
  }
  return `<div class="exploreGrid">${(value||[]).map(renderItem).join('')}</div>`;
}

/* M08 question/thought cards are rendered by hubs/index.html inline script. */
let HUBS=[];let current=null;const $=id=>document.getElementById(id);const params=new URLSearchParams(location.search);async function loadData(){const res=await fetch('data/hubs.json?v=m08-v33-standard');const data=await res.json();HUBS=data.hubs||[];const slug=params.get('hub')||data.defaultHub||(HUBS[0]&&HUBS[0].slug);renderHub(slug);renderHubList()}function renderHub(slug){current=HUBS.find(h=>h.slug===slug)||HUBS[0];if(!current)return;$('appTitle').textContent=current.title;$('appSub').textContent=current.subtitle||'포로귀환 핵심사건 확장탐험';$('hero').innerHTML=`<div class="kicker">${current.kicker||''}</div><h1>${current.heroTitle||current.title}</h1><p>${current.heroText||''}</p><div class="tags">${(current.tags||[]).map(t=>`<span>${t}</span>`).join('')}</div>`;$('flowTitle').textContent=current.mainFlowTitle||'핵심 흐름';$('mainFlow').innerHTML=nodes(current.mainFlow||[]);$('mapTitle').textContent=current.mapTitle||'지도';$('mapImg').src=current.map||'';$('mapCaption').textContent=current.mapCaption||'';$('keyItems').innerHTML=(current.keyItems||[]).map(i=>`<div class="infoBox"><div class="ico">${i.icon||'•'}</div><b>${i.title}</b><p>${i.text||''}</p></div>`).join('');$('overviewFlow').innerHTML=nodes(current.overviewFlow||[]);$('timeline').innerHTML=(current.timeline||[]).map(t=>`<div class="t ${t.active?'active':''}">${t.year||''}<div class="dot"></div>${t.label||''}</div>`).join('');const linkItems=[...(current.links||[])].filter(l=>!(current.nextUrl&&l.url===current.nextUrl));$('links').innerHTML=linkItems.map((l,i)=>`<button class="${i===1?'primary':''}" data-url="${l.url||''}" data-hub="${l.hub||''}">${l.label}</button>`).join('');$('prevBtn').textContent=current.prevLabel||'이전 허브';$('nextBtn').textContent=current.nextLabel||'다음 허브'}function nodes(items){return items.map(i=>`<div class="node"><div class="ico">${i.icon||'•'}</div><b>${i.title||''}</b><small>${i.text||''}</small></div>`).join('')}function goHub(slug){if(!slug){alert('다음 단계에서 연결됩니다.');return}history.pushState(null,'',`?hub=${slug}`);renderHub(slug);window.scrollTo(0,0)}function openUrl(url){if(!url)return;if(url.startsWith('#'))alert('다음 단계에서 연결됩니다.');else window.open(url,'_self')}function renderHubList(){$('hubList').innerHTML=HUBS.map(h=>`<button class="hubItem" data-hub="${h.slug}"><b>${h.title}</b><span>${h.year||''} · ${h.short||''}</span></button>`).join('')}document.addEventListener('click',e=>{const hub=e.target.closest('[data-hub]');if(hub&&hub.dataset.hub){e.preventDefault();$('drawer').classList.remove('show');goHub(hub.dataset.hub);return}const url=e.target.closest('[data-url]');if(url){e.preventDefault();openUrl(url.dataset.url)}});$('prevBtn').onclick=()=>current&&current.prev?goHub(current.prev):null;$('nextBtn').onclick=()=>{if(!current)return;if(current.nextUrl)return openUrl(current.nextUrl);if(current.next)return goHub(current.next);};$('matrixBtn').onclick=()=>openUrl('../index.html');$('backBtn').onclick=()=>openUrl('../index.html');$('hubListBtn').onclick=()=>$('drawer').classList.add('show');$('drawerClose').onclick=()=>$('drawer').classList.remove('show');$('drawer').onclick=e=>{if(e.target.id==='drawer')$('drawer').classList.remove('show')};if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});loadData();