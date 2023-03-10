// Thanks to Zhell and to the rest of #macro-polo for the assist!

// In Foundry, press F12 and go to console tab; 
// Type game.packs.keys() to get a list of compendia. 
// You are going to need your Actors compendium name and add replace "world.dod" on line 264

// Tokens that do not have an actor. Add Actors to the excludeTokens array to have them skipped by the process.
const excludeTokens = ["Prefab", "prefab", "cannon_effects", "Firepit", "Faction Tracker"];
const broken = canvas.scene.tokens.filter(t => !t.actor && !excludeTokens.includes(t.name));

// Unique names of broken tokens.
const names = new Set(broken.map(t => t.name));

// Broken tokens that do not have an actor in the sidebar.
const toImport = new Set();

// Update broken tokens whose actors exist in the sidebar.
const updates = broken.map(t => {
  const id = game.actors.getName(t.name)?.id;
  if(!id) { toImport.add(t.name); return {_id: t.id}; }
  return {_id: t.id, actorId: id};
});
await canvas.scene.updateEmbeddedDocuments("Token", updates);

// Import missing Actors from the Compendiumg pack in line 26
const pack = game.packs.get("world.dod");
for(const name of toImport){
  const actorId = pack.index.getName(name)?._id;
  if(!actorId) continue;
  const actor = await game.actors.importFromCompendium(pack, actorId);
  await canvas.scene.tokens.getName(name).update({actorId: actor.id});
}

game.macros.getName('moveNullFolderActorsToFolder.js').execute()
