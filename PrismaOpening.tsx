import {SofaHero} from './SofaHero';
import {DepthName} from './DepthName';
import {ProfileTicket} from './ProfileTicket';
import {motion,useReducedMotion} from 'framer-motion';
import {ArrowUpRight,Check,Clapperboard,Layers,Sparkles} from 'lucide-react';
const detailVideo='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4';
export function PrismaOpening(){
 const reduce=useReducedMotion();
 const reveal={initial:reduce?false:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:true},transition:{duration:.8}} as const;
 return <>
 <SofaHero/>
 <section id="about" className="profile-section">
 <motion.div {...reveal} className="profile-layout">
 <ProfileTicket/>
 <div className="profile-information"><header className="profile-header"><div><small>NAME / 姓名</small><h2 className="profile-depth-name"><DepthName text="Aaron"/><DepthName text="程高阳"/></h2></div><div><small>FOCUS / 创作方向</small><strong>内容 × 视觉 × AI</strong></div></header>
 <div className="profile-meta"><span>联系 <a href="mailto:susuhi0723@163.com">susuhi0723@163.com</a></span><span>学历 <b>网络与新媒体 · 全日制本科</b></span></div>
 <div className="profile-history">
 <article><p className="profile-date">2022.08 — 2025.12</p><h3><span>腾讯音乐</span>安可 Anko <small>虚拟 IP 项目</small></h3><p>负责视频与衍生 IP 内容、直播内容策划，参与社群运营、品牌视觉与周边物料设计，串联内容、用户关系与线下体验。</p><p className="profile-result">B 站累计 10 万粉丝 · 虚拟区单日流水 TOP 1 · 3 届 BW 线下落地</p></article>
 <article><p className="profile-date">2026.08 — 至今</p><h3><span>伯克兔</span>个人 IP <small>AI 动漫 · 情感表达</small></h3><p>独立完成内容规划、AI 动漫视频制作与账号发布，以可复用的创作流程探索情感内容表达。</p><p className="profile-result">半个月抖音 5 万粉丝 · 运营首周百万级爆款 · 小红书首篇万赞</p></article>
 <article><p className="profile-date">2025.03 — 至今</p><h3><span>思维狮</span>个人 IP <small>个人成长 · 内容运营</small></h3><p>从账号定位、选题文案到视觉制作、发布与商业化，独立搭建个人成长内容 IP，并用 AI 工作流支持全流程生产。</p><p className="profile-result">抖音累计 30 万粉丝 · 单人 3 小时内完成全流程</p></article>
 </div></div></motion.div></section>
 <section id="services" className="prisma-services"><motion.h2 {...reveal}>有想法，也有实现它的方法。<br/><span>从第一笔灵感，到被看见的作品。</span></motion.h2><div className="prisma-features"><motion.a {...reveal} href="#home" className="prisma-film">{!reduce&&<video src={detailVideo} autoPlay loop muted playsInline aria-hidden="true"/>}<span>让创作发生。<ArrowUpRight/></span></motion.a>{[
 {title:'内容与叙事',icon:Clapperboard,items:['账号定位与内容选题','直播内容策划','文案、脚本与镜头规划']},
 {title:'视觉与 IP',icon:Layers,items:['品牌与 IP 视觉表达','视频与周边物料设计','社群与账号运营']},
 {title:'AI 创作系统',icon:Sparkles,items:['AI 图像与动漫内容制作','Coze 与 Codex 工作流','从制作、发布到复盘']}
 ].map(({title,icon:Icon,items},i)=><motion.article {...reveal} transition={{duration:.7,delay:i*.1}} key={title}><Icon className="prisma-feature-icon" size={32}/><h3><small>0{i+1}</small>{title}</h3><ul>{items.map(item=><li key={item}><Check size={15}/>{item}</li>)}</ul><a href="#home">查看柜中内容 <ArrowUpRight size={18}/></a></motion.article>)}</div></section>
 </>;
}
