import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {CloudRain, Wind, ShieldCheck, Navigation, Droplets, Radio, MapPin, Bell, ArrowUpRight} from 'lucide-react';
import './style.css';

const signals=[
 {time:'지금',icon:Wind,title:'공기가 맑아요',desc:'미세먼지 18 · 초미세먼지 9',tone:'mint'},
 {time:'14:00',icon:CloudRain,title:'약한 비가 시작돼요',desc:'우산을 챙기는 게 좋아요',tone:'blue'},
 {time:'18:30',icon:Navigation,title:'퇴근길 정체 예상',desc:'온의사거리 · 남춘천역 주변',tone:'amber'},
 {time:'하루 종일',icon:ShieldCheck,title:'재난 신호 없음',desc:'춘천 전 지역이 평온해요',tone:'mint'}
];
function ChuncheonMap(){
 const [districts,setDistricts]=useState([]);
 const [selected,setSelected]=useState(null);
 useEffect(()=>{fetch(`${import.meta.env.BASE_URL}chuncheon-districts.geojson`).then(r=>r.json()).then(d=>setDistricts(d.features))},[]);
 const types=[{type:'sun',icon:'☀',title:'맑음',detail:'현재 23° · 강수확률 10%'},{type:'rain',icon:'☂',title:'약한 비 예상',detail:'14시부터 약한 비 · 우산 권장'},{type:'air',icon:'◌',title:'대기 좋음',detail:'미세먼지 18 · 초미세먼지 9'},{type:'safe',icon:'✓',title:'특이사항 없음',detail:'현재 감지된 재난 신호 없음'}];
 const enrich=(feature,index)=>({...feature,signal:types[index%types.length]});
 const areas=districts.map(enrich);
 const openArea=feature=>setSelected({name:feature.properties.name,...feature.signal});
 return <div className="vector-map"><div className="map-panel"><div className="map-panel-title"><span>CHUNCHEON SIGNAL MAP</span><b>춘천시 읍 · 면 · 동</b></div><div className="map-help">휠로 확대 · 드래그로 이동</div><DistrictSvg features={areas} onSelect={openArea}/></div>{selected&&<div className="area-modal-backdrop" onClick={()=>setSelected(null)}><section className="area-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)}>×</button><small>LOCAL SIGNAL</small><h3>{selected.name}</h3><div className={`modal-symbol ${selected.type}`}>{selected.icon}</div><strong>{selected.title}</strong><p>{selected.detail}</p><dl><div><dt>기온</dt><dd>23°</dd></div><div><dt>미세먼지</dt><dd>좋음</dd></div><div><dt>재난</dt><dd>없음</dd></div></dl><em>현재 화면은 UI 확인용 데모 정보입니다.</em></section></div>}</div>
}
function DistrictSvg({features,onSelect}){
 const svgRef=useRef(null);
 const [view,setView]=useState({x:0,y:0,w:900,h:700});
 const drag=useRef(null);
 const suppressClick=useRef(false);
 if(!features.length)return <div className="map-loading">경계 데이터를 불러오는 중</div>;
 const collectPoints=value=>typeof value[0]==='number'?[value]:value.flatMap(collectPoints);
 const points=features.flatMap(f=>collectPoints(f.geometry.coordinates));
 const minX=Math.min(...points.map(p=>p[0])),maxX=Math.max(...points.map(p=>p[0])),minY=Math.min(...points.map(p=>p[1])),maxY=Math.max(...points.map(p=>p[1]));
 const W=900,H=700,P=38,project=([x,y])=>[P+(x-minX)/(maxX-minX)*(W-P*2),P+(maxY-y)/(maxY-minY)*(H-P*2)];
 const ringPath=ring=>ring.map((p,i)=>`${i?'L':'M'}${project(p).join(',')}`).join(' ')+'Z';
 const geometryPath=f=>(f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates).flatMap(poly=>poly.map(ringPath)).join(' ');
 const wheel=e=>{e.preventDefault();const rect=svgRef.current.getBoundingClientRect(),px=view.x+(e.clientX-rect.left)/rect.width*view.w,py=view.y+(e.clientY-rect.top)/rect.height*view.h,f=e.deltaY>0?1.22:.82,nw=Math.max(150,Math.min(900,view.w*f)),nh=nw*H/W,r=(px-view.x)/view.w,s=(py-view.y)/view.h;setView({x:px-r*nw,y:py-s*nh,w:nw,h:nh})};
 const down=e=>{svgRef.current.setPointerCapture(e.pointerId);suppressClick.current=false;drag.current={x:e.clientX,y:e.clientY,view}};
 const move=e=>{if(!drag.current)return;const rect=svgRef.current.getBoundingClientRect(),dx=(e.clientX-drag.current.x)/rect.width*drag.current.view.w,dy=(e.clientY-drag.current.y)/rect.height*drag.current.view.h;if(Math.abs(e.clientX-drag.current.x)+Math.abs(e.clientY-drag.current.y)>4)suppressClick.current=true;setView({...drag.current.view,x:drag.current.view.x-dx,y:drag.current.view.y-dy})};
 const up=()=>{drag.current=null};
 return <svg ref={svgRef} className="district-svg" viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} onWheel={wheel} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} role="img">{features.map(f=>{const [x,y]=project(f.properties.center);return <g key={f.properties.code} className={`district ${f.signal.type}`} onClick={()=>{if(!suppressClick.current)onSelect(f);suppressClick.current=false}}><path d={geometryPath(f)}/><circle cx={x} cy={y} r="12"/><text x={x} y={y-18}>{f.properties.name}</text><text className="weather-glyph" x={x} y={y+5}>{f.signal.icon}</text></g>})}</svg>
}
function App(){
 const now=new Date();
 const date=new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'long'}).format(now);
 return <main>
  <header><a className="brand"><span className="brand-mark"><Radio/></span><b>봄내시그널</b><em>BOMNAE SIGNAL</em></a><div className="header-right"><span className="live"><i/> LIVE</span><button aria-label="알림"><Bell/></button></div></header>
  <section className="hero">
   <div className="copy"><div className="eyebrow"><MapPin/> 강원특별자치도 춘천시 <span>{date}</span></div><h1>춘천은 지금<br/><strong>평온합니다</strong></h1><p>오후에 잠깐 비가 와요.<br/>나갈 때 작은 우산 하나만 챙기세요.</p><div className="summary"><div><small>현재 기온</small><b>24<sup>°</sup></b><span>체감 25°</span></div><div><small>오늘의 신호</small><b className="good">GOOD</b><span>주의 신호 1개</span></div></div></div>
   <div className="radar">
    <div className="radar-head"><span>CHUNCHEON LIVE MAP</span><span>37.8813° N · 127.7300° E</span></div>
    {/*
    <div className="map">
     <div className="grid"/><div className="sweep"/><div className="ring r1"/><div className="ring r2"/><div className="ring r3"/>
     <svg viewBox="0 0 600 600" aria-hidden="true"><path className="river" d="M-20 450C90 365 128 440 221 368s111-34 163-114 111-69 240-124"/><path className="river thin" d="M50 620c70-124 38-194 145-244"/></svg>
     <div className="place city"><i/><b>춘천 시내</b><small>24° · 맑음</small></div><div className="place soyang"><i/>소양강</div><div className="place uiam"><i/>의암호</div>
     <div className="weather-cloud"><CloudRain/><span>14시 비</span></div>
     <div className="map-status"><ShieldCheck/><span><b>안전</b> 감지된 재난 신호가 없습니다</span></div>
    </div> */}
    <ChuncheonMap/>
   </div>
  </section>
  <section className="signals"><div className="section-title"><div><span>TODAY'S FLOW</span><h2>오늘의 시그널</h2></div><button>전체 정보 <ArrowUpRight/></button></div><div className="signal-list">{signals.map((s,i)=><article key={s.title}><div className={'icon '+s.tone}><s.icon/></div><time>{s.time}</time><div><h3>{s.title}</h3><p>{s.desc}</p></div><span className="num">0{i+1}</span></article>)}</div></section>
  <footer><span>데이터 업데이트 1분 전</span><span>WEATHER · AIR · SAFETY · TRAFFIC</span></footer>
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
