import {useEffect,useRef,useState} from 'react';
import {ArrowDown,ArrowUpRight} from 'lucide-react';

export function Opening(){
 const root=useRef<HTMLElement>(null);
 const video=useRef<HTMLVideoElement>(null);
 const [progress,setProgress]=useState(0);
 const [ready,setReady]=useState(false);
 const [active,setActive]=useState(0);
 useEffect(()=>{
  let frame=0;
  const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(root.current){const p=Math.max(0,-root.current.getBoundingClientRect().top/window.innerHeight);setProgress(p);setActive(p<.85?0:p<1.75?1:2);if(video.current&&Number.isFinite(video.current.duration)){const time=Math.min(1,p)*Math.max(0,video.current.duration-.045);if(Math.abs(video.current.currentTime-time)>.025)video.current.currentTime=time;}}})};
  update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update)};
 },[ready]);
 const go=(index:number)=>{if(!root.current)return;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;window.scrollTo({top:window.scrollY+root.current.getBoundingClientRect().top+index*window.innerHeight,behavior:reduce?'instant':'smooth'})};
 return <section id="home" ref={root} className="opening"><div className="opening-stage">
  <nav className="opening-nav" aria-label="主导航"><a href="#home" className="opening-brand">Aaron</a><div><button onClick={()=>go(1)}>关于我</button><button onClick={()=>go(2)}>项目经历</button><a href="#projects">精选作品</a><a href="#contact">联系我 <ArrowUpRight size={14}/></a></div></nav>
  {['art/aaron-hero.webp','art/aaron-about.webp','art/aaron-tools.webp'].map((src,i)=><div key={src} className={`opening-scene scene-${i} ${active===i?'is-active':''}`} aria-hidden={active!==i}><img src={src} alt="" fetchPriority={i===0?'high':'auto'}/></div>)}
  <video ref={video} className={`opening-video ${ready&&active<2?'is-active':''}`} src="art/aaron-transition.mp4" muted playsInline preload="auto" onLoadedData={()=>setReady(true)} onError={()=>setReady(false)} aria-hidden="true"/>
  <div className={`opening-copy opening-welcome ${progress<.12?'is-active':''}`} aria-hidden={progress>=.12}><span>CONTENT · VISUAL · AI</span><h1>Aaron的创作世界</h1><p>内容有判断，创作有系统。</p></div>
  <div id="about" className={`opening-copy opening-about ${active===1?'is-active':''}`} aria-hidden={active!==1}><span>01 / ABOUT ME</span><h2>你好，我是<br/>Aaron。</h2><p>新媒体运营 · 内容与 AI 创作</p><p>从腾讯音乐的安可 Anko 项目，到独立运营个人成长赛道的思维狮与 AI 动漫情感赛道的伯克兔。我连接从 Idea 到内容，落地视觉与账号运营，把 Idea 推进到真实成果。</p><small>网络与新媒体 · 全日制本科</small></div>
  <div id="services" className={`opening-copy opening-experience ${active===2?'is-active':''}`} aria-hidden={active!==2}><span>02 / EXPERIENCE</span><h2>从团队协作，<br/>到独立创造。</h2><div className="opening-timeline"><p><b>安可 Anko</b><small>2022.08 — 2025.12 · 腾讯音乐</small><em>直播内容策划、IP 内容、视觉设计与社群运营</em></p><p><b>思维狮</b><small>2025.03 — 至今 · 独立运营</small><em>内容定位、AI 工作流与商业化</em></p><p><b>伯克兔</b><small>2026.08 — 至今 · 独立运营</small><em>AI 动漫内容与自动化生产</em></p></div></div>
  <div className="opening-bottom"><div className="opening-steps" aria-label="开场切换">{['主视觉','关于我','项目经历'].map((label,i)=><button key={label} onClick={()=>go(i)} aria-current={active===i?'step':undefined}><span>0{i+1}</span>{label}</button>)}</div><button className="opening-next" onClick={()=>active<2?go(active+1):document.getElementById('projects')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}>{active===2?'浏览作品':'向下探索'} <ArrowDown size={16}/></button></div>
 </div></section>
}


