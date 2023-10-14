/// Automates targeting in an radius around the selected token for features that require specific criteria. In the default state, targets all alive ENEMIES in a 15ft. radius semisphere centered on the selected token. 

let myToken = canvas.tokens.controlled[0];
let targets = canvas.tokens.placeables.filter(token => {

    /// Comment out the next three lines to allow targeting of defeated/dead (0 HP) tokens.
    let uuid = token.actor.uuid;
    let isDead = game.dfreds.effectInterface.hasEffectApplied('Dead', uuid);
    if (isDead) return false;
    
    /// Comment out the next three lines to disable specific name filtering. Replace the name with the desired one (must be the token's, not the actor's name!) OR replace <<<tokenName === "Demonic Hound">>> with <<<tokenName === myToken.document.name>>> to target tokens that share the selected token's name.
    ///let tokenName = token.document.name;
    ///let isName = (tokenName === "Demonic Hound");
    ///if (!isName) return false;

    /// *****NOTE: You HAVE TO comment out ONE or BOTH of the following disposition filtering, or the macro will not target ANY token. Comment BOTH out to target EVERY token.*****
    /// If the next three lines are not commented out, the macro will target ENEMIES (IE: tokens with the opposite Disposition of the selected token; it will exclude Neutral disposition tokens).
    let disposition = myToken.document.disposition;
    let isHostile = ((disposition !== token.document.disposition) && (token.document.disposition !== 0));
    if (!isHostile) return false;
    /// If the next three lines are not commented out, the macro will target ALLIES (IE: tokens with the same Disposition as the selected token; it will exclude Neutral disposition tokens).
    ///let disposition = myToken.document.disposition;
    ///let isAllied = ((disposition === token.document.disposition) && (token.document.disposition !== 0));
    ///if (!isAllied) return false;
    
    /// Comment out the next two lines to disable distance filtering. If this is enabled, only tokens within n ft. (horizontally) will be targeted. Change n in "distance >= n" to set the distance. Should be 2ft above the expected value to partially deal with diagonals (IE: if you want 30ft, set the number to 32). 
    let distance = canvas.grid.measureDistance(myToken, token);
    if (distance >= 17) return false;

    /// Comment out the next four lines to disable elevation filtering. If this is enabled, only tokens within n ft. (vertically) will be targeted.  Change n in "elevationDiff <= n" to set the elevation difference. Should be set at the correct value (IE: if you want to include targets within 15ft of elevation, set the number to 15).
    let myElevation = myToken.document.elevation;
    let tokenElevation = token.document.elevation;
    let elevationDiff = Math.abs(myElevation - tokenElevation);
    if (isNaN(elevationDiff) || elevationDiff <= 15) return true;
   
});

console.log(`Targets: ${targets.map(t => t.name)}`);

targets.forEach(token => token.setTarget(true, {releaseOthers: false}));

console.log(`Targets set to: ${targets.map(t => t.name)}`);
