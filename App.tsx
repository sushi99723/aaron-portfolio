import React, {useEffect, useRef, useState, type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import {motion, useScroll, useTransform, useReducedMotion, type MotionValue} from 'framer-motion';
import {ArrowUpRight, ArrowDown, X, Download} from 'lucide-react';
import {assets} from './assets';
import {PrismaOpening} from './PrismaOpening';
import {AnkoGallery} from './AnkoGallery';
import {evidence} from './evidence';
import './index.css';

function FadeIn({children,delay=0,x=0,y=30,className=''}:{children:ReactNode;delay?:number;x?:number;y?:number;className?:string}){
 const reduce=useReducedMotion();
 return <motion.div className={className} initial={reduce?false:{opacity:0,x,y}} whileInView={{opacity:1,x:0,y:0}} viewport={{once:true,margin:'50px',amount:0}} transition={{delay,duration:.7,ease:[.25,.1,.25,1]}}>{children}</motion.div>;
}
function ContactButton(){return <a className="contact-pill" href="#contact">一起聊聊 <ArrowUpRight size={18}/></a>}
function Magnet({children}:{children:ReactNode}){
 const ref=useRef<HTMLDivElement>(null);
 const [position,setPosition]=useState({x:0,y:0,active:false});
 const reduce=useReducedMotion();
 useEffect(()=>{
  if(reduce||!matchMedia('(pointer:fine)').matches)return;
  const move=(e:PointerEvent)=>{const r=ref.current?.getBoundingClientRect();if(!r)return;const x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;const active=Math.abs(x)<r.width/2+150&&Math.abs(y)<r.height/2+150;setPosition({x:active?x/3:0,y:active?y/3:0,active});};
  const reset=()=>setPosition({x:0,y:0,active:false});
  window.addEventListener('pointermove',move,{passive:true});window.addEventListener('blur',reset);
  return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('blur',reset)};
 },[reduce]);
 return <div ref={ref}><div style={{transform:`translate3d(${position.x}px,${position.y}px,0)`,transition:position.active?'transform .3s ease-out':'transform .6s ease-in-out',willChange:'transform'}}>{children}</div></div>;
}
function Hero(){return <section id="home" className="hero relative flex h-screen flex-col">
 <FadeIn y={-20}><nav aria-label="主导航" className="flex justify-between px-6 pt-6 md:px-10 md:pt-8">{[['关于我','#about'],['我的能力','#services'],['精选项目','#projects'],['联系我','#contact']].map(([label,url])=><a key={url} href={url} className="text-sm font-medium uppercase tracking-wider transition-opacity hover:opacity-70 md:text-lg lg:text-[1.4rem]">{label}</a>)}</nav></FadeIn>
 <div className="overflow-hidden"><FadeIn delay={.15} y={40}><h1 className="hero-heading hero-name">HI, I'M AARON</h1></FadeIn></div>
 <div className="hero-portrait"><FadeIn delay={.6} y={30}><Magnet><img src={assets.portrait} alt="3D 创作者角色装饰" fetchPriority="high"/></Magnet></FadeIn></div>
 <div className="hero-bottom relative z-20 mt-auto flex items-end justify-between gap-5 px-6 pb-7 md:px-10 md:pb-10">
  <FadeIn delay={.35} y={20}><div className="hero-intro"><span className="mb-4 block text-xs tracking-[.15em] opacity-60">CONTENT · VISUAL · AI</span><p>你好，我是Aaron。<br/>让内容被看见，<br/>让创意发生。</p><span className="mt-5 block text-xs opacity-50">2022 — 2026 / PORTFOLIO</span></div></FadeIn>
  <FadeIn delay={.5} y={20}><ContactButton/></FadeIn>
 </div>
 <span className="portrait-note">3D 角色为模板视觉素材</span>
 </section>}
function Marquee(){
 const ref=useRef<HTMLElement>(null);const [offset,setOffset]=useState(0);const reduce=useReducedMotion();
 useEffect(()=>{if(reduce)return;let frame=0;const update=()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;if(ref.current)setOffset((window.innerHeight-ref.current.getBoundingClientRect().top)*.3)});};update();window.addEventListener('scroll',update,{passive:true});return()=>{window.removeEventListener('scroll',update);cancelAnimationFrame(frame)}},[reduce]);
 return <section ref={ref} className="marquee overflow-hidden pb-10 pt-24 sm:pt-32 md:pt-40" aria-label="项目概念与成果展示"><div className="mb-5 flex justify-between px-6 text-xs uppercase tracking-widest opacity-50 md:px-10"><span>IDEAS INTO IMPACT</span><span>项目主题 · AI 概念视觉</span></div>{[assets.marquee.slice(0,3),assets.marquee.slice(3)].map((row,index)=><div key={index} className="marquee-track" style={{transform:`translateX(${index===0?offset-200:-(offset-200)-1296}px)`}}>{[...row,...row,...row].map((url,i)=><a key={`${url}-${i}`} href="#projects" className="marquee-tile"><img src={url} alt={evidence[i%3].art} loading="lazy" width={420} height={270}/><span><b>{["安可 Anko","思维狮","伯克兔"][i%3]}</b><small>{evidence[i%3].title}</small></span></a>)}</div>)}</section>
}
function Character({char,progress,range}:{char:string;progress:MotionValue<number>;range:[number,number]}){const opacity=useTransform(progress,range,[.2,1]);return <span className="relative"><span aria-hidden="true" className="opacity-0">{char}</span><motion.span aria-hidden="true" className="absolute left-0 top-0" style={{opacity}}>{char}</motion.span></span>}
function AnimatedText({text}:{text:string}){const ref=useRef<HTMLParagraphElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:['start 0.8','end 0.2']});const reduce=useReducedMotion();return <p ref={ref} aria-label={text} className="about-copy">{reduce?text:[...text].map((char,i)=><Character key={i} char={char} progress={scrollYProgress} range={[i/text.length,(i+1)/text.length]}/>)}</p>}
function About(){return <section id="about" className="about relative flex min-h-screen items-center justify-center px-5 py-20 sm:px-8 md:px-10">{assets.decor.map((src,i)=><FadeIn key={src} delay={.1+i*.05} x={i<2?-80:80} y={0} className={`decoration decoration-${i}`}><img src={src} alt="" loading="lazy"/></FadeIn>)}<div className="relative z-10 flex flex-col items-center gap-10 text-center sm:gap-14 md:gap-16"><FadeIn y={40}><p className="mb-6 text-xs tracking-[.2em] opacity-50">从团队协作，到独立创造。</p><h2 className="hero-heading section-title">ABOUT ME</h2></FadeIn><AnimatedText text="从团队里的 IP 项目，到一个人的 AI 创作系统。连接内容、视觉与运营，把想法推进到真实成果。自 2022 年开始将 AI 应用于内容生产，以成熟的内容判断和流程化的生产系统，独立完成定位、内容、制作与发布。"/><FadeIn delay={.2} className="mt-6 sm:mt-10"><ContactButton/></FadeIn></div></section>}
const services=[
 ['内容策划','CONTENT STRATEGY','从用户共性、账号定位与平台反馈出发，确定内容主题和表达方向。完成文案创作、脚本编写与镜头规划，建立可复用的内容结构。'],
 ['视觉表达','VISUAL DESIGN','具备视频制作与平面设计能力，覆盖品牌宣传、IP 视觉物料、封面和粉丝回馈礼物设计，让内容拥有一致的识别度。'],
 ['IP 运营','IP OPERATION','从内容建立认知，到社群承接关系、直播内容策划与线下体验，参与 IP 完整成长链路。'],
 ['AI 自动化','AI WORKFLOW','以 Coze 工作流、Codex Skill 和生产脚本串联步骤，形成标准化生产流程。思维狮单人 3 小时内完成全流程。'],
 ['增长验证','GROWTH & ITERATION','多平台发布内容，结合播放、互动、社群反馈与转化数据持续调整，让工作流服务表达，让时间回到创作。']
];
function Services(){return <section id="services" className="services rounded-t-[40px] bg-white px-5 py-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"><FadeIn><h2 className="section-title mb-16 text-center sm:mb-20 md:mb-28">WHAT I DO</h2></FadeIn><div className="mx-auto max-w-5xl">{services.map(([title,label,description],i)=><FadeIn key={title} delay={i*.1}><div className="service-row"><span className="service-number">0{i+1}</span><div><h3>{title} <span>{label}</span></h3><p>{description}</p></div></div></FadeIn>)}</div></section>}
type Project={name:string;category:string;date:string;summary:string;metrics:[string,string][];details:[string,string][]};
const projects:Project[]=[
 {name:'安可 Anko',category:'腾讯音乐 / VIRTUAL IP',date:'2022.08 — 2025.12',summary:'让虚拟角色，走进真实的关系。在团队中，把项目做成。',metrics:[['10 万','B 站累计粉丝'],['TOP 1','虚拟区单日流水排名'],['20 万+','最高单日流水'],['3 届','BilibiliWorld 线下落地']],details:[['不止一条视频，而是一整条链路。','负责全部视频及衍生 IP 内容，并参与社群服务、直播策划和视觉物料落地，让内容、用户关系与付费场景相互支撑。'],['内容建立认知','产出「黄豆安可」等热门内容，执行 UP 主联动。5 个月内播放破 200 万，条均播放 4.5 万+。'],['社群承接关系','搭建 1,600+ 粉丝社群与反馈服务号，维护付费用户；单笔付费过百用户月均 120+。'],['直播内容策划','策划日常及关键节点直播，开展直播 3 个月内登顶虚拟区单日流水，多次进入 Top 3。'],['视觉延伸体验','设计品牌宣传、IP 视觉与粉丝月度回馈礼物，落地 3 届 BW，场均销售额过万元。']]},
 {name:'思维狮',category:'独立运营 / CONTENT IP',date:'2025.03 — 至今',summary:'把思考，变成日常。从账号定位到商业化，独立搭建内容 IP。',metrics:[['30 万','抖音累计粉丝'],['20%','私域付费转化率'],['3 小时内','单人全流程生产']],details:[['从 0 到 1 独立运营','前 4 个月涨粉 20 万+，几十条百万级爆款；小红书 1.8 万粉、B 站 1.9 万粉，小红书单篇最高浏览 40 万+。搭建 500+ 粉丝社群与 200+ 私域用户池。'],['AI 全链路生产','独立完成账号定位、内容规划、文案创作、脚本编写、视频生成及封面制作；通过 Coze 将内容生产流程化，单人 3 小时内完成全流程。'],['商业化落地','搭建付费知识库及小红书店铺，与北京科学技术出版社、觉晓法考等品牌合作，推广曝光均达 5 万+，私域付费转化率 20%。']]},
 {name:'伯克兔',category:'独立运营 / AI ANIMATION',date:'2026.08 — 至今',summary:'以 AI 动漫视频探索新的内容表达，独立完成从内容规划到制作发布。',metrics:[['5 万','半个月抖音粉丝'],['100 万级','运营首周爆款'],['万赞','小红书首篇']],details:[['冷启动成果','半个月抖音累计 5 万粉丝；运营一周产出百万级爆款。9 月初启动小红书，首篇即获万赞。'],['AI 内容生产','借助 Codex 编写 Skill 与生产脚本，完成 AI 动漫视频内容及封面设计。将 AI 动漫内容生产与封面设计串联，通过可复用的 Skill 和脚本支持独立运营。']]}
];
function ProjectCard({project,index,onOpen}:{project:Project;index:number;onOpen:()=>void}){
 const ref=useRef<HTMLElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']});const scale=useTransform(scrollYProgress,[0,1],[1,1-(projects.length-1-index)*.03]);const reduce=useReducedMotion();
 return <article id={`project-${index}`} ref={ref} className="project-sticky" style={{top:`${96+index*28}px`}}><motion.div className="project-card" style={{scale:reduce?1:scale}}>
 <div className="project-top"><span className="project-number">0{index+1}</span><div className="project-heading"><p>{project.category}</p><h3>{project.name}</h3><span>{project.date}</span></div><button className="ghost-button" onClick={onOpen}>查看项目 <ArrowUpRight size={18}/></button></div>
 <div className="project-showcase"><div className="evidence-column"><div className="evidence-primary"><span className="evidence-kicker">IMPACT / 0{index+1}</span><strong>{evidence[index].primary[0]}</strong><p>{evidence[index].primary[1]}</p><small>{evidence[index].source}</small></div><div className="evidence-secondary"><strong>{evidence[index].secondary[0]}</strong><p>{evidence[index].secondary[1]}</p><div>{evidence[index].facts.map(([value,label])=><span key={label}><b>{value}</b><small>{label}</small></span>)}</div></div></div>{index===0?<AnkoGallery/>:<figure className="project-artwork"><img src={assets.projects[index]} alt={evidence[index].art} loading="lazy" width={1536} height={1024}/><figcaption><span>{evidence[index].title}</span><small>AI CONCEPT / 2026</small></figcaption></figure>}</div>
 <div className="card-caption"><p>{project.summary}</p></div>
 <div className="project-metrics">{project.metrics.map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
 </motion.div></article>
}
function ProjectDialog({project,onClose}:{project:Project|null;onClose:()=>void}){const ref=useRef<HTMLDialogElement>(null);useEffect(()=>{if(project)ref.current?.showModal();else ref.current?.close()},[project]);return <dialog ref={ref} onClose={onClose} onClick={e=>{if(e.target===ref.current)onClose()}} aria-labelledby="case-title"><div className="dialog-inner"><button className="dialog-close" aria-label="关闭项目详情" onClick={onClose}><X/></button>{project&&<><span className="text-xs tracking-widest opacity-50">{project.category} · {project.date}</span><h2 id="case-title">{project.name}</h2><p className="mb-8 opacity-70">{project.summary}</p>{project.details.map(([title,body])=><div className="detail-block" key={title}><h3>{title}</h3><p>{body}</p></div>)}<div className="detail-block"><h3>数据来源与统计口径</h3><p>{evidence[projects.indexOf(project)].detail}</p></div><p className="mt-8 text-xs opacity-50">{project===projects[0]?"海报、票根与周边视觉设计":"项目主视觉为 AI 新创作；不作为原始活动、作品或后台数据截图。"}</p></>}</div></dialog>}
const flow=[['定位与选题','先理解人，再生产内容。','从用户共性、账号定位与平台反馈出发，确定内容主题和表达方向。'],['文案与脚本','把观点变成可执行的叙事。','完成文案创作、脚本编写与镜头规划，建立可复用的内容结构。'],['视觉与视频','让内容拥有一致的识别度。','通过 AI 生成、视频制作与封面设计，将脚本转化为完整的视觉内容。'],['流程与交付','把重复操作交给工作流。','以 Coze 工作流、Codex Skill 和生产脚本串联步骤，形成标准化生产流程。'],['发布与迭代','让真实反馈回到下一次创作。','多平台发布内容，结合播放、互动、社群反馈与转化数据持续调整。']];
function Workflow(){const [active,setActive]=useState(0);return <section id="workflow" className="workflow px-6 py-24 md:px-10"><FadeIn><h2 className="hero-heading section-title">THE SYSTEM</h2><p className="mb-12 mt-6 text-lg opacity-70">创意靠判断，重复交给系统。</p></FadeIn><div role="tablist" aria-label="AI 工作流" className="flow-tabs">{flow.map(([name],i)=><button role="tab" id={`flow-${i}`} aria-selected={active===i} aria-controls="flow-panel" onClick={()=>setActive(i)} key={name}><span>0{i+1}</span>{name}</button>)}</div><div role="tabpanel" id="flow-panel" aria-labelledby={`flow-${active}`} className="flow-panel"><div><h3>{flow[active][1]}</h3><p>{flow[active][2]}</p></div><aside><strong>3 小时内</strong><p>思维狮单人全流程生产</p><span>Coze / Codex / Skill / 脚本</span></aside></div><p className="mt-6 text-xs opacity-50">流程为基于简历的能力归纳；3 小时指标来自思维狮项目。</p></section>}
function App(){return <main className="prisma-site min-h-screen" style={{overflowX:'clip'}}><PrismaOpening/></main>}
createRoot(document.getElementById('root')!).render(<App/>);


