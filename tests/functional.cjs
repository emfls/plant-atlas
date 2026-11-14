const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
class El{constructor(tag='div'){this.tagName=tag;this.value='';this.checked=false;this.hidden=false;this.textContent='';this.children=[];this.handlers={};}addEventListener(t,f){this.handlers[t]=f;}append(...els){this.children.push(...els)}replaceChildren(...els){this.children=els;}}
const ids=['search','group','season','environment','leaf','filters','count','empty','compare-hint','comparison'];const els=Object.fromEntries(ids.map(id=>[id,new El()]));
const context={console,globalThis:null};context.globalThis=context;vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/data.v2.js'),'utf8'),context);const plants=context.PLANTS;
const cards=Object.fromEntries(plants.map(p=>[p.id,new El('article')]));const boxes=plants.map(p=>Object.assign(new El('input'),{value:p.id}));const queue=[];
context.setTimeout=fn=>queue.push(fn);context.document={getElementById:id=>els[id],querySelector:q=>cards[q.match(/data-id="([^"]+)"/)[1]],querySelectorAll:q=>{assert.equal(q,'.compare');return boxes},createElement:tag=>new El(tag)};
vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/app.v2.js'),'utf8'),context);
const visible=()=>plants.filter(p=>!cards[p.id].hidden).map(p=>p.id);const trigger=id=>els[id].handlers.input();
assert.equal(visible().length,6);
for(const p of plants){els.search.value=p.latin;trigger('search');assert.equal(visible().join(','),p.id);}
els.search.value=' Ｇｉｎｋｇｏ   ｂｉｌｏｂａ ';trigger('search');assert.equal(visible().join(','),'ginkgo');
els.search.value='';
for(const env of ['',...new Set(plants.map(p=>p.environment))])for(const leaf of ['',...new Set(plants.map(p=>p.leaf))]){els.environment.value=env;els.leaf.value=leaf;trigger('environment');assert.equal(visible().join(','),plants.filter(p=>(!env||p.environment===env)&&(!leaf||p.leaf===leaf)).map(p=>p.id).join(','));}
for(const group of ['',...new Set(plants.map(p=>p.group))])for(const season of ['',...new Set(plants.map(p=>p.season))])for(const env of ['',...new Set(plants.map(p=>p.environment))])for(const leaf of ['',...new Set(plants.map(p=>p.leaf))]){const actual=plants.filter(p=>context.matches(p,'',group,season,env,leaf)).map(p=>p.id).join(',');const expected=plants.filter(p=>(!group||p.group===group)&&(!season||p.season===season)&&(!env||p.environment===env)&&(!leaf||p.leaf===leaf)).map(p=>p.id).join(',');assert.equal(actual,expected);}
els.environment.value='';els.leaf.value='';els.search.value='없는 식물';trigger('search');assert.equal(visible().length,0);assert.equal(els.empty.hidden,false);
els.search.value='';trigger('search');assert.equal(els.empty.hidden,true);
for(let i=0;i<3;i++){boxes[i].checked=true;boxes[i].handlers.change();}assert.equal(els.comparison.children[0].tagName,'table');assert.equal(els.comparison.children[0].children.length,6);assert.equal(els.comparison.children[0].children[1].children.length,4);
boxes[3].checked=true;boxes[3].handlers.change();assert.equal(boxes[3].checked,false);assert.match(els['compare-hint'].textContent,/최대 3종/);
boxes[0].checked=false;boxes[0].handlers.change();boxes[3].checked=true;boxes[3].handlers.change();assert.equal(boxes[3].checked,true);
els.search.value='zz';trigger('search');assert.equal(els.comparison.children.length,1,'Hidden selections remain comparable');
els.filters.handlers.reset();for(const id of ['search','group','season','environment','leaf'])els[id].value='';queue.shift()();assert.equal(visible().length,6);assert.equal(els.comparison.children.length,0);assert(boxes.every(b=>!b.checked));assert.equal(els['compare-hint'].textContent,'0종 선택됨 · 최대 3종');
els.filters.handlers.reset();queue.shift()();assert.equal(visible().length,6);let prevented=false;els.filters.handlers.submit({preventDefault(){prevented=true}});assert(prevented);
console.log('PASS Plant: six Latin searches; Unicode/spacing; all environment/leaf combinations; empty state; max-three comparison table; deselection; hidden selection; deferred/repeated reset; submit prevention.');
