import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {CloudRain, Wind, ShieldCheck, Navigation, Droplets, Radio, MapPin, Bell, ArrowUpRight} from 'lucide-react';
import './style.css';

const signals=[
 {time:'지금',icon:Wind,title:'공기가 맑아요',desc:'미세먼지 18 · 초미세먼지 9',tone:'mint'},
 {time:'14:00',icon:CloudRain,title:'약한 비가 시작돼요',desc:'우산을 챙기는 게 좋아요',tone:'blue'},
 {time:'18:30',icon:Navigation,title:'퇴근길 정체 예상',desc:'온의사거리 · 남춘천역 주변',tone:'amber'},
 {time:'하루 종일',icon:ShieldCheck,title:'재난 신호 없음',desc:'춘천 전 지역이 평온해요',tone:'mint'}
];
function ChuncheonMap(){
 const mapEl=useRef(null);
 const [selected,setSelected]=useState(null);
 useEffect(()=>{
  const chuncheonBounds=[[127.47,37.72],[128.03,38.12]];
  const map=new maplibregl.Map({container:mapEl.current,center:[127.7300,37.8813],zoom:10.7,minZoom:9.6,maxZoom:17,maxBounds:chuncheonBounds,pitch:0,bearing:0,attributionControl:false,style:{version:8,sources:{osm:{type:'raster',tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],tileSize:256,attribution:'© OpenStreetMap contributors'}},layers:[{id:'osm',type:'raster',source:'osm',paint:{'raster-saturation':0,'raster-brightness-min':0.72,'raster-brightness-max':1,'raster-contrast':0,'raster-opacity':1}}]}});
  map.addControl(new maplibregl.NavigationControl({showCompass:false}),'top-right');
  map.addControl(new maplibregl.AttributionControl({compact:true}),'bottom-right');
  const spots=[
   {name:'춘천 시내',lng:127.7300,lat:37.8813,type:'air',icon:'◌',title:'대기 좋음',detail:'미세먼지 18 · 초미세먼지 9'},
   {name:'퇴계동',lng:127.7258,lat:37.8501,type:'rain',icon:'☂',title:'약한 비 예상',detail:'14시부터 약한 비 · 우산 권장'},
   {name:'석사동',lng:127.7449,lat:37.8585,type:'safe',icon:'✓',title:'특이사항 없음',detail:'현재 감지된 재난 신호 없음'},
   {name:'신북읍',lng:127.7505,lat:37.9657,type:'sun',icon:'☀',title:'맑음',detail:'23° · 강수확률 10%'}
  ];
  map.on('load',()=>{map.addSource('selection',{type:'geojson',data:{type:'FeatureCollection',features:[]}});map.addLayer({id:'selection-area',type:'circle',source:'selection',paint:{'circle-radius':42,'circle-color':'rgba(0,0,0,0)','circle-stroke-width':2,'circle-stroke-color':'#087f72'}})});
  spots.forEach(spot=>{const el=document.createElement('button');el.className=`signal-marker ${spot.type}`;el.title=`${spot.name} · ${spot.title}`;el.innerHTML=`<span>${spot.icon}</span><em>${spot.name}</em>`;el.addEventListener('click',()=>{setSelected(spot);const source=map.getSource('selection');if(source)source.setData({type:'Feature',geometry:{type:'Point',coordinates:[spot.lng,spot.lat]}});map.easeTo({center:[spot.lng,spot.lat],zoom:12,duration:650})});new maplibregl.Marker({element:el}).setLngLat([spot.lng,spot.lat]).addTo(map)});
  return()=>map.remove();
 },[]);
 return <div className="map actual-map"><div ref={mapEl} className="map-canvas"/>{selected&&<aside className="region-panel"><button onClick={()=>setSelected(null)}>×</button><small>SELECTED AREA</small><h3>{selected.name}</h3><strong>{selected.title}</strong><p>{selected.detail}</p></aside>}<div className="map-legend"><span><i className="rain"/>날씨</span><span><i className="safe"/>안전</span><span><i className="air"/>대기</span></div></div>
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
