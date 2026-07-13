import React from 'react';
import {createRoot} from 'react-dom/client';
import {CloudRain, Wind, ShieldCheck, Navigation, Droplets, Radio, MapPin, Bell, ArrowUpRight} from 'lucide-react';
import './style.css';

const signals=[
 {time:'지금',icon:Wind,title:'공기가 맑아요',desc:'미세먼지 18 · 초미세먼지 9',tone:'mint'},
 {time:'14:00',icon:CloudRain,title:'약한 비가 시작돼요',desc:'우산을 챙기는 게 좋아요',tone:'blue'},
 {time:'18:30',icon:Navigation,title:'퇴근길 정체 예상',desc:'온의사거리 · 남춘천역 주변',tone:'amber'},
 {time:'하루 종일',icon:ShieldCheck,title:'재난 신호 없음',desc:'춘천 전 지역이 평온해요',tone:'mint'}
];
function App(){
 const now=new Date();
 const date=new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'long'}).format(now);
 return <main>
  <header><a className="brand"><span className="brand-mark"><Radio/></span><b>봄내시그널</b><em>BOMNAE SIGNAL</em></a><div className="header-right"><span className="live"><i/> LIVE</span><button aria-label="알림"><Bell/></button></div></header>
  <section className="hero">
   <div className="copy"><div className="eyebrow"><MapPin/> 강원특별자치도 춘천시 <span>{date}</span></div><h1>춘천은 지금<br/><strong>평온합니다</strong></h1><p>오후에 잠깐 비가 와요.<br/>나갈 때 작은 우산 하나만 챙기세요.</p><div className="summary"><div><small>현재 기온</small><b>24<sup>°</sup></b><span>체감 25°</span></div><div><small>오늘의 신호</small><b className="good">GOOD</b><span>주의 신호 1개</span></div></div></div>
  </section>
  <section className="signals"><div className="section-title"><div><span>TODAY'S FLOW</span><h2>오늘의 시그널</h2></div><button>전체 정보 <ArrowUpRight/></button></div><div className="signal-list">{signals.map((s,i)=><article key={s.title}><div className={'icon '+s.tone}><s.icon/></div><time>{s.time}</time><div><h3>{s.title}</h3><p>{s.desc}</p></div><span className="num">0{i+1}</span></article>)}</div></section>
  <footer><span>데이터 업데이트 1분 전</span><span>WEATHER · AIR · SAFETY · TRAFFIC</span></footer>
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
