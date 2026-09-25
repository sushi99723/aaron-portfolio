import {useRef,useState} from 'react';
import {useFrame} from '@react-three/fiber';
import {useTexture} from '@react-three/drei';
import {Mesh,DoubleSide,MathUtils,SRGBColorSpace} from 'three';
// Curved paper lifts from the upper edge; release settles it back onto the door.
export function PeelSticker({file,width,height}:{file:string;width:number;height:number}){
 const mesh=useRef<Mesh>(null),amount=useRef(0),drag=useRef<number|null>(null);const [hover,setHover]=useState(false);const [pull,setPull]=useState(0);const texture=useTexture('art/locker/tex/'+file.replace(/\.png$/i,'.webp'));texture.colorSpace=SRGBColorSpace;
 useFrame((_,dt)=>{if(!mesh.current)return;amount.current=MathUtils.damp(amount.current,pull||(hover?.28:0),9,Math.min(dt,.05));const a=mesh.current.geometry.attributes.position;const uv=mesh.current.geometry.attributes.uv;for(let i=0;i<a.count;i++){const y=(uv.getY(i)-.5)*height;const t=Math.max(0,(uv.getY(i)-(.85-amount.current*.7)));const angle=t*amount.current*5;a.setXYZ(i,(uv.getX(i)-.5)*width,y-Math.sin(angle)*t*height*.35,(1-Math.cos(angle))*height*.45)}a.needsUpdate=true;mesh.current.geometry.computeVertexNormals()});
 return <mesh ref={mesh} onPointerOver={e=>{e.stopPropagation();setHover(true)}} onPointerOut={()=>setHover(false)} onPointerDown={e=>{e.stopPropagation();drag.current=e.clientY;(e.target as unknown as Element).setPointerCapture(e.pointerId);setPull(.5)}} onPointerMove={e=>{if(drag.current!==null){e.stopPropagation();setPull(MathUtils.clamp(.5+(drag.current-e.clientY)/100,.3,1))}}} onPointerUp={e=>{e.stopPropagation();drag.current=null;setPull(0);(e.target as unknown as Element).releasePointerCapture(e.pointerId)}} onPointerCancel={()=>{drag.current=null;setPull(0)}} castShadow receiveShadow><planeGeometry args={[width,height,12,28]}/><meshPhysicalMaterial map={texture} transparent alphaTest={.1} side={DoubleSide} roughness={.48} metalness={.05} clearcoat={.5}/></mesh>
}


