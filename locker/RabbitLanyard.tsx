import {useEffect,useRef} from 'react';
import {RoundedBox,useTexture} from '@react-three/drei';
import {useFrame,type ThreeEvent} from '@react-three/fiber';
import {DoubleSide,Group,MathUtils,SRGBColorSpace} from 'three';

const ART='art/locker/';

export function RabbitLanyard({
 hidden=false,
 onInspect,
 frontFile='rabbit-lanyard-front.png',
 backFile='rabbit-lanyard-back.png',
 position=[-.31,1.19,.026],
 initialAngle=.12
}:{
 hidden?:boolean;
 onInspect?:(group:Group)=>void;
 frontFile?:string;
 backFile?:string;
 position?:[number,number,number];
 initialAngle?:number;
}){
 const front=useTexture(ART+frontFile),back=useTexture(ART+backFile);
 const pendulum=useRef<Group>(null),card=useRef<Group>(null);
 const restAngle=0;
 const angle=useRef(initialAngle),velocity=useRef(-initialAngle),dragging=useRef(false),moved=useRef(false),dragStart=useRef({x:0,angle:0});
 const hovered=useRef(false);
 useEffect(()=>{front.colorSpace=SRGBColorSpace;back.colorSpace=SRGBColorSpace;back.repeat.set(1,.918);back.offset.set(0,.02);front.needsUpdate=true;back.needsUpdate=true},[front,back]);
 useEffect(()=>()=>{document.body.style.cursor='auto'},[]);
 useFrame((state,delta)=>{
  const dt=Math.min(delta,.035);
  if(!dragging.current){
   const breeze=Math.sin(state.clock.elapsedTime*1.35)*.014+(hovered.current?Math.sin(state.clock.elapsedTime*4.2)*.035:0);
   const acceleration=-7.5*(angle.current-restAngle)-2.35*velocity.current+breeze;
   velocity.current+=acceleration*dt;
   angle.current+=velocity.current*dt;
  }
  if(pendulum.current)pendulum.current.rotation.z=angle.current;
  if(card.current){
   card.current.rotation.z=MathUtils.damp(card.current.rotation.z,-angle.current*.09+velocity.current*.08,7,dt);
   card.current.rotation.y=MathUtils.damp(card.current.rotation.y,velocity.current*.16,6,dt);
  }
 });
 const down=(e:ThreeEvent<PointerEvent>)=>{e.stopPropagation();dragging.current=true;moved.current=false;dragStart.current={x:e.point.x,angle:angle.current};velocity.current=0;(e.target as Element).setPointerCapture?.(e.pointerId);document.body.style.cursor='grabbing'};
 const move=(e:ThreeEvent<PointerEvent>)=>{if(!dragging.current)return;e.stopPropagation();const distance=e.point.x-dragStart.current.x;if(Math.abs(distance)>.018)moved.current=true;angle.current=MathUtils.clamp(dragStart.current.angle+distance*1.7,-.85,.85)};
 const up=(e:ThreeEvent<PointerEvent>)=>{e.stopPropagation();dragging.current=false;velocity.current=-(angle.current-restAngle)*.65;(e.target as Element).releasePointerCapture?.(e.pointerId);document.body.style.cursor=hovered.current?'grab':'auto'};
 return <group position={position} visible={!hidden}>
  <mesh position={[0,.012,.015]} rotation={[Math.PI/2,0,0]} castShadow><torusGeometry args={[.052,.009,10,32]}/><meshPhysicalMaterial color="#c8bbdc" metalness={.92} roughness={.22} clearcoat={1}/></mesh>
  <mesh position={[0,-.04,.018]} castShadow><capsuleGeometry args={[.018,.052,8,16]}/><meshPhysicalMaterial color="#827296" metalness={.85} roughness={.25}/></mesh>
  <group ref={pendulum} position={[0,-.07,.008]}>
   <RoundedBox args={[.026,.4,.012]} radius={.01} smoothness={4} position={[0,-.2,0]} castShadow><meshPhysicalMaterial color="#3a2459" metalness={.2} roughness={.58} clearcoat={.45}/></RoundedBox>
   <mesh position={[0,-.4,.012]} castShadow><torusGeometry args={[.04,.007,8,24]}/><meshPhysicalMaterial color="#b9accf" metalness={.9} roughness={.2}/></mesh>
   <group ref={card} position={[0,-.64,.02]} onClick={e=>{e.stopPropagation();if(!moved.current&&card.current)onInspect?.(card.current)}} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerOver={e=>{e.stopPropagation();hovered.current=true;document.body.style.cursor='grab'}} onPointerOut={()=>{hovered.current=false;if(!dragging.current)document.body.style.cursor='auto'}}>
    <RoundedBox args={[.29,.46,.024]} radius={.027} smoothness={5} castShadow receiveShadow><meshPhysicalMaterial color="#211532" metalness={.58} roughness={.28} clearcoat={1} clearcoatRoughness={.12}/></RoundedBox>
    <mesh position={[0,0,.014]}><planeGeometry args={[.284,.452]}/><meshPhysicalMaterial map={front} transparent alphaTest={.02} side={DoubleSide} roughness={.42} metalness={.16} clearcoat={.82}/></mesh>
    <mesh position={[0,0,-.014]} rotation={[0,Math.PI,0]}><planeGeometry args={[.284,.452]}/><meshPhysicalMaterial map={back} transparent alphaTest={.02} side={DoubleSide} roughness={.42} metalness={.16} clearcoat={.82}/></mesh>
   </group>
  </group>
 </group>
}

