import {useEffect,useState} from 'react';
import {ArrowUpRight,Menu,X,AudioLines} from 'lucide-react';
import {useReducedMotion} from 'framer-motion';
import {RippleBackground} from './RippleBackground';
import {LockerHero} from './LockerHero';

const links=[['首页','home'],['个人介绍','about'],['我的能力','services']];
export function SofaHero(){
 const [open,setOpen]=useState(false);
 const [intro,setIntro]=useState<'clear'|'prompt'|'started'>('clear');
 const reduce=useReducedMotion();
 useEffect(()=>{const waterTimer=window.setTimeout(()=>setIntro('prompt'),reduce?0:1000);const cabinetTimer=window.setTimeout(()=>setIntro('started'),reduce?0:2700);return()=>{window.clearTimeout(waterTimer);window.clearTimeout(cabinetTimer)}},[reduce]);
 useEffect(()=>{const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};const resize=()=>{if(innerWidth>720)setOpen(false)};window.addEventListener('keydown',close);window.addEventListener('resize',resize);return()=>{window.removeEventListener('keydown',close);window.removeEventListener('resize',resize)}},[]);
 return <section id="home" className={`sofa-hero sofa-intro-${intro}`}>
 <div className="sofa-bg" style={{backgroundImage:`url(${import.meta.env.BASE_URL}art/aaron-sofa-hero.png)`}}><RippleBackground/></div><div className="sofa-shade"/>
 <header className="sofa-header"><a className="sofa-logo" href="#home" aria-label="Aaron 首页"><AudioLines size={26}/></a><nav aria-label="主导航" className="sofa-nav">{links.map(([label,id],i)=><a key={id} href={`#${id}`} aria-current={i===0?'page':undefined}>{label}</a>)}</nav><a className="sofa-contact" href="#contact">一起聊聊 <ArrowUpRight size={15}/></a><button className="sofa-menu-button" aria-label={open?'关闭菜单':'打开菜单'} aria-expanded={open} aria-controls="sofa-menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header>
 {open&&<div className="sofa-menu-backdrop" onClick={()=>setOpen(false)}><nav id="sofa-menu" aria-label="移动导航" onClick={e=>e.stopPropagation()}>{links.map(([label,id])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{label}</a>)}</nav></div>}
 <LockerHero active={intro==='started'}/>
 </section>;
}
