import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
// Explicit model IDs from the preview catalogue; never infer from a filename.
export const modelNames=['Comfort Essential','Comfort Plus','Comfort Premium','Orthopedic Classic','Orthopedic Support','Orthopedic Advanced','Memory Foam Cloud','Memory Foam Contour','Memory Foam Serenity','Latex Natural','Latex Balance','Latex Luxe','Hybrid Flex','Hybrid Elite','Hybrid Royal','Cooling Breeze','Cooling Chill','Cooling Arctic','Serenity Plus','Grand','Imperial'];
export function prepareConcept({id,model,source,approved,bytes}){
 if(!Number.isInteger(id)||modelNames[id-1]!==model||approved!==true||typeof source!=='string'||!source.trim())throw Error('Explicit matching model, approval and provenance required');
 if(!Buffer.isBuffer(bytes)||bytes.length<20||bytes.length>10*1024*1024)throw Error('Invalid image size');
 const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 const webp=bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP';
 const jpg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 if(!png&&!webp&&!jpg)throw Error('Unsupported image signature');
 const sha256=createHash('sha256').update(bytes).digest('hex');
 return {id,model,source,sha256,sourceKind:'ai_concept',illustrative:true,approved:true,path:'media/concepts/'+id+'-'+sha256+'.'+(png?'png':webp?'webp':'jpg')};
}
export async function importConcept(input,root=process.cwd()){
 const bytes=await readFile(input.file);
 const record=prepareConcept({...input,bytes});
 const manifestPath=resolve(root,'media/concepts.json');
 let entries=[];try{entries=JSON.parse(await readFile(manifestPath,'utf8'))}catch(e){if(e.code!=='ENOENT')throw e}
 if(!Array.isArray(entries))throw Error('Invalid manifest');
 const existing=entries.find(x=>x.id===record.id);
 if(existing&&existing.sha256!==record.sha256)throw Error('Existing model image requires explicit reviewed replacement');
 if(entries.some(x=>x.id!==record.id&&x.sha256===record.sha256))throw Error('Image already assigned to another model');
 const path=resolve(root,record.path);await mkdir(dirname(path),{recursive:true});await writeFile(path,bytes);
 await writeFile(manifestPath,JSON.stringify([...entries.filter(x=>x.id!==record.id),record].sort((a,b)=>a.id-b.id),null,2)+'\n');
 return record;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const [id,model,file,source,approval]=process.argv.slice(2);
 console.log(await importConcept({id:Number(id),model,file,source,approved:approval==='--approved'}));
}
