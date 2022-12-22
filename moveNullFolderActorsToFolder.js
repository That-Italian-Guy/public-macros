// Moves all the actors in the sidebar not in a Folder into the Temp folder (creates the folder if it's not there)
const folder = game.folders.getName("Temp") ?? await Folder.create({name: "Temp", type: "Actor"});
const nullFolder = game.actors.filter(t => !t.folder);
const fId = folder.id;
const updates = nullFolder.map(actor => ({_id: actor.id, folder: fId}));
await Actor.updateDocuments(updates);
