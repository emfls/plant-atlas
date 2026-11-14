'use strict';
const normalize = text => String(text).normalize('NFKC').toLowerCase().replace(/\s+/g,'');
function matches(p,query,group,season){return (!group||p.group===group)&&(!season||p.season===season)&&normalize([p.name,p.latin,p.leaf,p.family,p.summary].join(' ')).includes(normalize(query));}
if(typeof module!=='undefined') module.exports={normalize,matches};
if(typeof document!=='undefined'){
 const plants=globalThis.PLANTS, selected=new Set(), $=id=>document.getElementById(id);
 function filter(){let count=0;for(const p of plants){const visible=matches(p,$('search').value,$('group').value,$('season').value);document.querySelector(`[data-id="${p.id}"]`).hidden=!visible;if(visible)count++;} $('count').textContent=`${count}종의 기록`;$('empty').hidden=count!==0;}
 $('filters').addEventListener('submit',e=>e.preventDefault());for(const id of ['search','group','season'])$(id).addEventListener('input',filter);
 $('filters').addEventListener('reset',()=>{setTimeout(()=>{selected.clear();document.querySelectorAll('.compare').forEach(el=>{el.checked=false;});$('compare-hint').textContent='0종 선택됨 · 최대 3종';renderCompare();filter();},0);});
 function renderCompare(){const root=$('comparison');root.replaceChildren();if(!selected.size)return;const table=document.createElement('table');const caption=document.createElement('caption');caption.textContent='선택한 식물의 특징 비교';table.append(caption);for(const [label,key] of [['이름','name'],['학명','latin'],['잎 형태','leaf'],['잎 변화','season'],['서식·재배 환경','habitat']]){const row=document.createElement('tr');const th=document.createElement('th');th.scope='row';th.textContent=label;row.append(th);for(const id of selected){const td=document.createElement('td');td.textContent=plants.find(p=>p.id===id)[key];row.append(td);}table.append(row);}root.append(table);}
 document.querySelectorAll('.compare').forEach(el=>el.addEventListener('change',()=>{if(el.checked&&selected.size>=3){el.checked=false;$('compare-hint').textContent='최대 3종까지 비교할 수 있습니다. 다른 선택을 해제해 주세요.';return;}if(el.checked)selected.add(el.value);else selected.delete(el.value);$('compare-hint').textContent=`${selected.size}종 선택됨 · 최대 3종` ;renderCompare();}));filter();
}
