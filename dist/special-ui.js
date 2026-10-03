(() => {
  const special=MischiefSpecial,grid=document.getElementById('recipeGrid');
  const toggle=document.getElementById('specialEnabled'),state=document.getElementById('artworkState');
  function update(){
    const items=MischiefIngredients(),entry=special.match(items,MischiefComposition.plan(items).base),record=special.record(entry);
    state.textContent=!entry?'Standard mix':record?.state==='loading'?'Loading special artwork…':record?.state==='ready'?(entry.baseArtwork?'Expression artwork':items.length>2?'Special remix':'Special Library'):'Standard mix · artwork unavailable';
    state.dataset.special=String(record?.state==='ready');
  }
  toggle.onchange=()=>{special.enabled=toggle.checked;MischiefChoose(MischiefIngredients().map(x=>x.emoji));};
  for(const entry of special.entries){
    const card=document.createElement('article');card.className='special-card';
    const choose=document.createElement('button');choose.className='special-choice';choose.setAttribute('aria-label','Mix '+entry.name);
    const image=document.createElement('img');image.src='special/'+entry.id+'.png';image.alt='';image.width=image.height=256;image.loading='lazy';image.onerror=()=>{image.hidden=true;};
    const name=document.createElement('strong');name.textContent=entry.name;
    const formula=document.createElement('span');formula.className='special-formula';formula.textContent=entry.pair.join(' + ');
    choose.append(image,name,formula);choose.onclick=()=>{special.enabled=true;toggle.checked=true;MischiefChoose(entry.pair);document.querySelector('.workspace').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
    const description=document.createElement('p');description.textContent=entry.mood;
    card.append(choose,description);grid.append(card);
  }
  window.addEventListener('mischief:mix',update);window.addEventListener('mischief:artwork',update);update();
})();
