import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {ArrowLeft,ArrowRight} from 'lucide-react';
const cards=[['badge','Q2 纪念徽章'],['q1-ticket','Q1 镭射票'],['january','一月纪念卡'],['disc','BW 纪念徽章'],['bw-ticket','BW 镭射票'],['postcard','Q2 镭射明信片'],['merch-0','2024年bw工卡'],['merch-1','2024年bw纸袋'],['merch-2','bw 刺绣徽章'],['merch-3','bw无料小扇子'],['merch-4','明信片 夏'],['merch-5','明信片 冬'],['merch-6','明信片 秋'],['merch-7','明信片 春'],['merch-8','便利贴'],['merch-9','周年纪念 浴火重生明信片'],['merch-10','安可日历'],['merch-11','十二星座典藏卡'],['merch-12','音乐会吧唧'],['merch-13','周年纪念 南洋晚风典藏卡'],['merch-14','周年纪念 南洋晚风立体亚克力'],['merch-15','周年纪念 浴火生长吧唧'],['merch-16','周年纪念 浴火生长小卡'],['merch-17','星座票'],['merch-18','南洋晚风镭射票'],['merch-19','南洋晚风会员小卡']];
export function AnkoGallery(){
 const [position,setPosition]=useState(0);const [paused,setPaused]=useState(false);const drag=useRef<number|null>(null);const root=useRef<HTMLElement>(null);
 const step=(n:number)=>setPosition(p=>p+n);
 useEffect(()=>{if(paused||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=setInterval(()=>{const r=root.current?.getBoundingClientRect();if(r&&r.top<innerHeight&&r.bottom>0)step(1)},3000);return()=>clearInterval(timer)},[paused]);
 const active=((position%cards.length)+cards.length)%cards.length;
 return <section ref={root} className="anko-gallery" aria-label="安可镭射物料轮播" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setPaused(false)}}>
 <div className="anko-depth" tabIndex={0} aria-label="左右拖动或按方向键切换" onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowRight'?1:-1)}}} onPointerDown={e=>{drag.current=e.clientX;e.currentTarget.setPointerCapture(e.pointerId)}} onPointerUp={e=>{if(drag.current!==null&&Math.abs(e.clientX-drag.current)>30)step(e.clientX<drag.current?1:-1);drag.current=null}} onPointerCancel={()=>{drag.current=null}}>
 {cards.map(([file,label],i)=>{let d=(i-active+cards.length)%cards.length;if(d>3)d=-1;const src=`art/anko/${file}-foil.webp?v=20260922-merch-26`;return <div key={file} className={`anko-depth-card ${d===0?'is-current':''}`} data-compact={file==='badge'||file==='disc'} aria-hidden={d!==0} style={{'--depth':d,opacity:d<0?0:1-d*.24,zIndex:10-d, pointerEvents:d===0?'auto':'none'} as CSSProperties} onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--light-x',`${(e.clientX-r.left)/r.width*100}%`);e.currentTarget.style.setProperty('--light-y',`${(e.clientY-r.top)/r.height*100}%`)}}><img src={src} alt={label} draggable={false}/><span className="anko-spotlight" style={{maskImage:`url("${src}")`,WebkitMaskImage:`url("${src}")`}}/></div>})}
 </div><div className="anko-controls"><span aria-live="polite">{cards[active][1]} · {active+1} / {cards.length}</span><div><button onClick={()=>step(-1)} aria-label="上一张"><ArrowLeft size={18}/></button><span>左右拖动</span><button onClick={()=>step(1)} aria-label="下一张"><ArrowRight size={18}/></button></div></div>
 </section>
}


