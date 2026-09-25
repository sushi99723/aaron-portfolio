import {useRef,type PointerEvent} from 'react';
import {useReducedMotion} from 'framer-motion';

export function ProfileTicket(){
 const reduce=useReducedMotion();
 const frame=useRef<HTMLDivElement>(null);
 const photo=useRef<HTMLDivElement>(null);
 const reset=(element:HTMLDivElement|null)=>{if(element){element.style.removeProperty('transform');element.removeAttribute('data-active')}};
 const move=(event:PointerEvent<HTMLDivElement>,layer:'photo'|'frame')=>{
  if(reduce||event.pointerType==='touch')return;
  const element=layer==='photo'?photo.current:frame.current;
  reset(layer==='photo'?frame.current:photo.current);
  if(!element)return;
  const bounds=event.currentTarget.getBoundingClientRect();
  const x=Math.max(0,Math.min(1,(event.clientX-bounds.left)/bounds.width));
  const y=Math.max(0,Math.min(1,(event.clientY-bounds.top)/bounds.height));
  const angle=layer==='photo'?10:7;
  element.style.transform=`perspective(900px) rotateX(${(.5-y)*angle}deg) rotateY(${(x-.5)*angle}deg) translateZ(${layer==='photo'?18:8}px)`;
  element.style.setProperty('--shine-x',`${x*100}%`);
  element.style.setProperty('--shine-y',`${y*100}%`);
  element.dataset.active='true';
 };
 return <figure className="profile-ticket interactive-ticket" onPointerLeave={()=>{reset(frame.current);reset(photo.current)}}>
  <div className="profile-frame-hit" onPointerMove={e=>move(e,'frame')} onPointerLeave={()=>reset(frame.current)}>
   <div ref={frame} className="profile-frame-layer"><div className="profile-ticket-spine">AARON <small>CONTENT · VISUAL · AI</small></div><span className="profile-ticket-note">从 IDEA 到真实成果。</span><span className="profile-foil"/></div>
  </div>
  <div className="profile-photo-hit" onPointerMove={e=>move(e,'photo')} onPointerLeave={()=>reset(photo.current)}>
   <div ref={photo} className="profile-photo"><img src="art/aaron-profile-photo.png" alt="Aaron 的耳机角色肖像" draggable={false}/><div className="profile-photo-caption">CREATIVE PROFILE <span>2026</span></div><span className="profile-foil"/></div>
  </div>
 </figure>;
}

