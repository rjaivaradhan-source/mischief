// Authored suggestions, not a claim to infer a person's feelings.
globalThis.MischiefMeaning = function(items,intent='auto',personal='') {
  const has=(...names)=>names.every(name=>items.some(item=>item.name===name));
  const any=(...names)=>names.some(name=>has(name));
  const contexts={celebrate:['This is our moment','Celebrate a win and invite someone to share your excitement.'],affection:['You mean a lot to me','Send warmth, admiration, or affection to someone you care about.'],comfort:["I'm here with you",'Offer company and care without asking someone to feel better immediately.'],frustration:['A lot to handle','Express frustration while keeping the conversation open.'],sarcasm:['Of course. Perfect.','A playful, ironic reaction—best with someone who knows your tone.'],tired:['Running on empty','Ask for a little patience, space, or rest.'],apology:['Let me make it right','Express regret and open the door to a real apology.']};
  let pair,confidence='suggestion';
  if(contexts[intent]){pair=contexts[intent];confidence='chosen-intention';}
  else if(items.some(x=>['🌧️','🌦️','☔','💦'].includes(x.emoji))){const subject=items.find(x=>!['🌧️','🌦️','☔','💦','👑','❄️','✨','🔥','⚡','💤'].includes(x.emoji))||items[0];pair=[subject.name==='Happy'?'Smiling through the downpour':subject.name==='Crying'?'When it all pours out':subject.name==='Thinking'?'Lost in rainy thoughts':subject.name==='Angry'?'Stormy feelings':'Drenched '+subject.name.toLowerCase(),'Rain drenches '+subject.name.toLowerCase()+' while preserving the emotion: '+subject.meaning+'.'];}
  else if(has('Crown')||items.some(x=>x.emoji==='👑')){const subject=items.find(x=>!['👑','❄️','✨','🔥','⚡','💤'].includes(x.emoji))||items[0];pair=[has('Snowflake')?'The frozen king':subject.name==='Thinking'?'The thinking king':subject.name==='Happy'?'The happy king':subject.name==='Angry'?'The furious king':subject.name==='Crying'?'The tearful king':subject.name==='Heart'?'King of hearts':subject.name+' royalty','The crown gives '+subject.name.toLowerCase()+' a royal identity: '+subject.meaning+'.'];}
  else if(has('Snowflake')||items.some(x=>x.emoji==='❄️')){const subject=items.find(x=>x.emoji!=='❄️')||items[0];pair=[subject.name==='Happy'?'Frozen smile':subject.name==='Thinking'?'Brain freeze':subject.name==='Heart'?'A frozen heart':'Frozen '+subject.name.toLowerCase(),'The icy treatment transforms '+subject.name.toLowerCase()+' into a frozen version, carrying '+subject.meaning+' into the cold.'];}
  else if(items.some(x=>['⚡','🌩️','⛈️'].includes(x.emoji)))pair=['Struck by a feeling','A jolt of surprise or energy, with the original expression still visible.'];
  else if(items.some(x=>['☀️','🌞','🌡️'].includes(x.emoji)))pair=['Feeling the heat','Warmth, intensity, or pressure, expressed through heat and perspiration.'];
  else if(items.some(x=>['🌬️','💨','🌪️'].includes(x.emoji)))pair=['Swept up','A feeling carried away by a gust of wind.'];
  else if(items.some(x=>x.emoji==='🌊'))pair=['A wave of emotion','The original feeling washed over by water.'];
  else if(items.some(x=>x.emoji==='🌫️'))pair=['In a haze','A feeling softened by fog or uncertainty.'];
  else if(has('Happy','Fire','Heart','Sparkles'))pair=['Glowing, lovestruck energy','Happy, on fire, and a little too in love to hide it.'];
  else if(any('Happy','Laughing','Party')&&any('Crying','Heartbreak','Rain'))pair=['Happy and hurting','For a bittersweet moment: there is joy here, but something still hurts.'];
  else if(has('Heart','Snowflake'))pair=['Warming up to you','For affection that is growing slowly, with a little shyness.'];
  else if(has('Heart','Fire'))pair=['Love, turned up','For a crush—or a passion—that refuses to cool down.'];
  else if(has('Happy','Fire'))pair=['On a happy streak',"For when you're feeling good and absolutely on fire."];
  else if(has('Crying','Sparkles'))pair=['Dramatically okay','A little emotional. Still finding a reason to shine.'];
  else if(any('Sleepy','Sleep')&&has('Coffee'))pair=['Running on coffee','When you need rest but the day still needs you.'];
  else if(has('Cool','Snowflake'))pair=['Professionally unbothered','A calm response when everything around you is a little too much.'];
  else if(any('Heart','Kiss')&&any('Crying','Heartbreak','Rain'))pair=['Love through the hard part','For missing someone, or offering affection on a difficult day.'];
  else if(any('Angry')&&any('Heart','Blossom'))pair=['Upset, but I still care','For making room for frustration without losing affection.'];
  else if(any('Angry','Lightning','Fire')&&has('Melting'))pair=['At my limit','For feeling overwhelmed and needing a moment to recover.'];
  else if(any('Party','Confetti','Hundred','Crown'))pair=['You earned this','For cheering someone on and making their win feel seen.'];
  else if(any('Heart','Kiss','Butterfly'))pair=['A little lovestruck','For affection, anticipation, and the butterflies that come with it.'];
  else if(any('Sleepy','Sleep','Coffee'))pair=['Low battery, still here','For wanting to show up, even when your energy is running low.'];
  else if(any('Crying','Heartbreak','Rain'))pair=['Feeling it all','For a tender or difficult moment when words feel hard to find.'];
  else if(any('Angry'))pair=['Trying to keep my cool','For frustration that needs to be acknowledged.'];
  else if(any('Thinking','Mind blown'))pair=['Let me take that in','For surprise, curiosity, or needing a moment to process.'];
  else if(any('Happy','Laughing','Sparkles','Rainbow'))pair=['A little brighter','For sharing a moment of joy or a small spark of hope.'];
  else pair=['A mood of my own','An unusual mix. Add your own words so the feeling is clear.'];
  const personalText=String(personal).trim().slice(0,140);
  if(personalText){pair=[personalText,'Your words set the meaning. The emojis and motion carry the feeling.'];confidence='user-authored';}
  const traits=items.map(item=>item.meaning);
  return {title:pair[0],description:pair[1],intent,confidence,traits,alt:`${pair[0]}. ${items.map(item=>item.name).join(' + ')}.`,note:'A suggested reading, not a universal meaning. Context and culture can change interpretation.'};
};
