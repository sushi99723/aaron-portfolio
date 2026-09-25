import {useRef} from 'react';
import {useReducedMotion} from 'framer-motion';

export function DepthName({text}:{text:string}){
 const stage=useRef<HTMLSpanElement>(null);
 const reduce=useReducedMotion();
 return <span className="name-depth" onPointerMove={e=>{
  if(reduce||e.pointerType==='touch'||!stage.current)return;
  const r=e.currentTarget.getBoundingClientRect();
  stage.current.style.transform=`rotateX(${-(e.clientY-r.top-r.height/2)/r.height*14}deg) rotateY(${(e.clientX-r.left-r.width/2)/r.width*18}deg)`;
 }} onPointerLeave={()=>stage.current?.style.removeProperty('transform')}>
 <span className="name-depth-stage" ref={stage}>{Array.from({length:18},(_,i)=>{const depth=18-i;return <span aria-hidden="true" className="name-depth-layer" key={depth} style={{transform:`translateZ(${-depth*.65}px)`,color:`color-mix(in srgb,#e9e5ef ${60-depth*2}%,#69458c)`}}>{text}</span>})}<span className="name-depth-face">{text}</span></span>
 </span>;
}
