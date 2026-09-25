import {useEffect,useRef} from 'react';

export function RippleBackground(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false});if(!gl)return;
  const shader=(type:number,source:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,source);gl.compileShader(s);return s};
  const vertex=shader(gl.VERTEX_SHADER,'attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}');
  const fragment=shader(gl.FRAGMENT_SHADER,`precision mediump float;
   varying vec2 uv;uniform sampler2D image;uniform vec2 size;uniform vec2 imageSize;uniform vec3 waves[12];uniform float time;uniform vec3 pointer;
   void main(){
    vec2 shift=vec2(0.);float trail=0.;
    for(int i=0;i<12;i++){float age=time-waves[i].z;if(waves[i].z>0.&&age>=0.&&age<3.){
     vec2 delta=(uv-waves[i].xy)*size;float d=length(delta);float ring=d-age*190.;
     float force=sin(ring*.05)*exp(-abs(ring)*.014)*exp(-age*1.6)*13.;
     shift+=normalize(delta+vec2(.001))*force/size;
     trail=max(trail,exp(-d*d/18000.)*exp(-age*1.4));
    }}
    vec2 cursor=(uv-pointer.xy)*size;
    float clear=max((1.-smoothstep(55.,210.,length(cursor)))*pointer.z,trail);
    vec2 flow=uv*5.;float t=time*.24;
    float liquid=sin(flow.x*2.+sin(flow.y*2.5+t)+t)*cos(flow.y*2.-sin(flow.x+t));
    shift+=vec2(sin(flow.y*3.+t+liquid),cos(flow.x*3.-t+liquid))*.003*(.3+clear);
    vec2 scaled=imageSize*max(size.x/imageSize.x,size.y/imageSize.y);
    vec2 point=((uv+shift)*size+(scaled-size)*.5)/scaled;
    vec2 radius=vec2(9.*(1.-clear))/scaled;
    vec3 color=vec3(0.);float total=0.;
    for(int x=-2;x<=2;x++){for(int y=-2;y<=2;y++){float weight=exp(-float(x*x+y*y)*.5);color+=texture2D(image,point+vec2(float(x),float(y))*radius).rgb*weight;total+=weight;}}
    color/=total;
    float mist=pow(.5+.5*liquid,3.)*(.045+clear*.12);
    color=mix(color,vec3(.24,.21,.30),.12*(1.-clear))+vec3(.43,.29,.68)*mist;
    gl_FragColor=vec4(color,1.);
   }`);
  const program=gl.createProgram()!;gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);return}
  gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const p=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const size=gl.getUniformLocation(program,'size'),imageSize=gl.getUniformLocation(program,'imageSize'),waveLocation=gl.getUniformLocation(program,'waves[0]'),time=gl.getUniformLocation(program,'time'),pointer=gl.getUniformLocation(program,'pointer');
  const waves=new Float32Array(36);let index=0,raf=0,ready=false,disposed=false,last=0;
  const render=()=>{raf=0;if(!ready||disposed)return;gl.uniform1f(time,performance.now()/1000);gl.uniform3fv(waveLocation,waves);gl.drawArrays(gl.TRIANGLES,0,6);if(canvas.getBoundingClientRect().bottom>0&&!document.hidden)raf=requestAnimationFrame(render)};
  const resize=()=>{const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(size,r.width,r.height);if(!raf)render()};
  const observer=new ResizeObserver(resize);observer.observe(canvas);
  const image=new Image();image.onload=()=>{if(disposed)return;gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.uniform2f(imageSize,image.width,image.height);ready=true;resize()};image.src='art/aaron-sofa-hero.png';
  const move=(e:PointerEvent)=>{const now=performance.now();const r=canvas.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){gl.uniform3f(pointer,0,0,0);return;}const x=(e.clientX-r.left)/r.width,y=1-(e.clientY-r.top)/r.height;gl.uniform3f(pointer,x,y,1);if(!raf)raf=requestAnimationFrame(render);if(now-last<70)return;waves[index*3]=x;waves[index*3+1]=y;waves[index*3+2]=now/1000;index=(index+1)%12;last=now;};
  const leave=()=>gl.uniform3f(pointer,0,0,0);
  const resume=()=>{if(!raf&&canvas.getBoundingClientRect().bottom>0)raf=requestAnimationFrame(render)};
  document.addEventListener('pointerleave',leave);window.addEventListener('blur',leave);window.addEventListener('scroll',resume,{passive:true});document.addEventListener('visibilitychange',resume);
  window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerdown',move,{passive:true});
  return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('pointerleave',leave);window.removeEventListener('blur',leave);window.removeEventListener('scroll',resume);document.removeEventListener('visibilitychange',resume);window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',move);gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment)};
 },[]);
 return <canvas ref={ref} className="sofa-ripple" aria-hidden="true"/>;
}

