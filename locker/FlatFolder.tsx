import './FlatFolder.css';
// React Bits Folder's flat front, paper fan and hover interaction, controlled by extraction.
export function FlatFolder({name,logo,subtitle,expanded,onClick}:{name:string;logo:string;subtitle:string;expanded:boolean;onClick:()=>void}){
 return <button className={`flat-folder ${expanded?'expanded':''}`} onClick={e=>{e.stopPropagation();onClick()}} aria-label={`${expanded?'收回':'打开'}${name}文件夹`} aria-expanded={expanded}><span className="flat-folder-back"/>{[0,1,2].map(i=><span className={`flat-paper paper-${i}`} key={i}>{i===2&&<span className="flat-paper-copy"><strong>{name}</strong><small>{subtitle}</small></span>}</span>)}<span className="flat-folder-front"><img src={`art/locker/tex/${logo.replace(/\.png$/i,'.webp')}`} alt={`${name} Logo`}/></span></button>
}

