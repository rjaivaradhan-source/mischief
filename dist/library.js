(() => {
  const catalog=MischiefCatalog.items,byEmoji=new Map(catalog.map(x=>[x.emoji,x]));
  const effects=[['👑','Crown'],['❄️','Frozen'],['🔥','Fire'],['🌧️','Rain'],['⚡','Lightning'],['☀️','Heat'],['🌊','Water'],['🌬️','Wind'],['🌫️','Fog'],['☁️','Cloud'],['🌈','Rainbow'],['🌙','Night'],['✨','Sparkle'],['💤','Sleep'],['❤️','Love']];
  const $=id=>document.getElementById(id),collection=$('collection'),element=$('element'),search=$('subjectSearch'),partner=$('partner');
  for(const category of [...new Set(catalog.map(x=>x.category))])collection.add(new Option(category,category));
  for(const [emoji,name] of effects)element.add(new Option(emoji+' '+name,emoji));
  for(const item of catalog){const option=document.createElement('option');option.value=item.emoji+' '+item.name;$('partners').append(option);}
  let page=0,generation=0;
  async function render(){
    const ticket=++generation,query=search.value.trim().toLowerCase(),custom=partner.value.trim();
    const modifier=custom?(byEmoji.get(custom)||catalog.find(x=>custom===x.emoji+' '+x.name||custom.toLowerCase()===x.name.toLowerCase())):byEmoji.get(element.value);
    if(!modifier){$('libraryStatus').textContent='Choose a matching emoji from the suggestions.';$('mixLibrary').replaceChildren();return;}
    const filtered=catalog.filter(x=>x.emoji!==modifier.emoji&&(collection.value==='all'||collection.value==='smileys'&&/^(face-|cat-face|monkey-face)/.test(x.subgroup)||x.category===collection.value)&&(!query||(x.name+' '+x.emoji).toLowerCase().includes(query)));
    const pages=Math.max(1,Math.ceil(filtered.length/24));page=Math.min(page,pages-1);
    $('libraryStatus').textContent=filtered.length+' combinations with '+modifier.emoji+' '+modifier.name;
    $('pageStatus').textContent=(page+1)+' / '+pages;$('previous').disabled=page===0;$('next').disabled=page===pages-1;
    $('mixLibrary').replaceChildren();
    await Promise.all(filtered.slice(page*24,page*24+24).map(async subject=>{
      const items=[subject,modifier],card=document.createElement('article'),canvas=document.createElement('canvas');canvas.width=canvas.height=512;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',subject.name+' mixed with '+modifier.name);
      const title=document.createElement('h2');title.textContent=subject.emoji+' '+modifier.emoji+' · '+subject.name;
      const note=document.createElement('p'),button=document.createElement('button');button.textContent='Preparing…';button.disabled=true;card.append(canvas,title,note,button);$('mixLibrary').append(card);
      await MischiefSpecial.ensure(items);if(ticket!==generation)return;
      MischiefComposition.draw(canvas,items);
      const plan=MischiefComposition.plan(items),entry=MischiefSpecial.match(items,plan.base);
      note.textContent=entry&&!entry.baseArtwork?'Signature artwork':Object.values(plan.effects).some(Boolean)?'Shared element treatment':'Layered composition';
      button.textContent='Download PNG';button.disabled=false;button.onclick=()=>canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='mischief-'+Array.from(subject.emoji+modifier.emoji).map(x=>x.codePointAt(0).toString(16)).join('-')+'.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    }));
  }
  for(const input of [collection,element,search,partner])input.addEventListener('input',()=>{page=0;if(input===element)partner.value='';render();});
  $('previous').onclick=()=>{page--;render();};$('next').onclick=()=>{page++;render();};render();
})();
