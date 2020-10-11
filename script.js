//To - Do
// Upgradeable Spells
// Spells that temporary buff
// Spells that temporary debuff
// Balance the game when finish the rest of the To-Do

//Accomplished
// Workable buttons
// Alerts for dead monster/players
// Reset when player dies
// Increasing difficulty
// Upgrades!
// Spells!
// Rewarding players with gold for defeating monster
// Player in attack or defend mode
// Fixed Price Scaling in Defend and attack mode


let uuid = localStorage.getItem("uuid");
if (!uuid){
  uuid = `uuid-${Math.floor(1000000000*Math.random())}`;
  localStorage.setItem("uuid", uuid);
}

console.log(uuid);


var gameState = {
  gold: 0,
  damagePerSecond: 0,
  attack: 1,
  healthMax: 100,
  health: 100,
  healthLevel: 1,
  level: 1,
  monDPS: 1,
  monsterHealth: 25,
  position: "Neutral"
};

var getSidekickCost = function(){
  if(gameState.position == "Offensive"){
    return 25 + 3**(gameState.damagePerSecond / 2);
  }
  else if(gameState.position == "Defensive"){
    return 25 + 3**(gameState.damagePerSecond * 2);
  }
  else{
    return 25 + 3**gameState.damagePerSecond;
  }
}

var getHealthCost = function(){
  return 50 + 2**gameState.healthLevel;
}

var getClickCost = function(){
  if(gameState.position == "Defensive"){
    return 100 + 5**(gameState.attack * 2);
  }
  else if(gameState.position == "Offensive"){
    return 100 + 5**(gameState.attack / 2);
  }
  else{
  return 100 + 5**gameState.attack;
  }
}

var renderGameState = function(gameState){
  $("#uuid").html(uuid);
  $("#attack").html(gameState.attack);
  $("#dps").html(gameState.damagePerSecond);
  $("#money").html(gameState.gold.toFixed(2));
  $("#playerHealth").html(gameState.health);
  $("#playerMaxHealth").html(gameState.healthMax);
  $("#clicks_price").html(getClickCost());
  $("#sidekick_price").html(getSidekickCost());
  $("#health_price").html(getHealthCost());
  $("#level").html(gameState.level);
  $("#monHealth").html(gameState.monsterHealth);
  $("#mon_DPS").html(gameState.monDPS);
  $("#position").html(gameState.position);
}

var calculateDamagePerSecond = function(gameState){
  return gameState.damagePerSecond;
}

var calculateMonsterDamagePerSecond = function(gameState){
  return gameState.monDPS;
}

var buySidekick = function(){
 let sidekick_cost = getSidekickCost();
  if(gameState.gold < sidekick_cost){
    alert("Not enough Gold for Sidekick");
    return;
  }
  gameState.gold = gameState.gold - sidekick_cost;
  if(gameState.position == "Defensive"){
    gameState.damagePerSecond += .5;
  }
  else if(gameState.position == "Offensive"){
    gameState.damagePerSecond += 2;
  }
  else{
     gameState.damagePerSecond += 1;
  }
  gameState.damagePerSecond = calculateDamagePerSecond(gameState);
  renderGameState(gameState);
}

var buyClicks = function(){
  let attack_cost = getClickCost();
  if(gameState.gold < attack_cost){
    alert("Not enough gold for Upgrade");
    return;
  }
  gameState.gold = gameState.gold - attack_cost;
  if(gameState.position == "Defensive"){
    gameState.attack += .5;
  }
  else if(gameState.position == "Offensive"){
    gameState.attack += 2;
  }
  else{
     gameState.attack += 1;
  }
  renderGameState(gameState);
}

var buyHealth = function(){
  let health_cost = getHealthCost();
  if(gameState.gold < health_cost){
    alert("Not enough gold for Upgrade");
    return;
  }
  gameState.gold = gameState.gold - health_cost;
  gameState.healthMax += 25*gameState.healthLevel;
  gameState.health = gameState.healthMax;
  gameState.healthLevel += 1;
  renderGameState(gameState);
}

var buyFire = function(){
  console.log("fire");
  if(gameState.gold < 100){
    alert("Not enough gold for spell");
    return;
  }
  gameState.gold -= 100;
  gameState.monsterHealth -= 100;
  if(gameState.monsterHealth < 1){
    alert("The monster has been slain, you are rewarded " + 50 * gameState.level + " gold" );
    gameState.gold += 50 * gameState.level;
    gameState.level += 1;
    gameState.monsterHealth = 50 * gameState.level;
  }
  renderGameState(gameState);
}

var buyPotion = function(){
  console.log("heal");
  if(gameState.gold < 50){
    alert("Not enough gold for Spell");
    return;
  }
  gameState.gold -= 50;
  gameState.health += 50;
  if(gameState.health > gameState.healthMax){
    gameState.health = gameState.healthMax;
    renderGameState(gameState);
  }
  renderGameState(gameState);
}

var gameTick = function(){
  gameState.monsterHealth -= gameState.damagePerSecond;
  gameState.health -= gameState.monDPS;
  gameState.gold += gameState.damagePerSecond;
  if(gameState.health <= 0){
    alert("You are dead, Game Over");
    gameState.health = 100;
    gameState.healthMax = 100;
    gameState.healthLevel = 1;
    gameState.damagePerSecond = 0;
    gameState.attack = 1;
    gameState.gold = 0;
    gameState.level = 1;
    gameState.monDPS = 1;
    gameState.monsterHealth = 25;
    gameState.monsterDamagePerSecond = 1;
    gameState.position = "Neutral";
    document.getElementById("shield").disabled = false;
    document.getElementById("sword").disabled = false;
    document.getElementById("normal").disabled = true;
  }
  if(gameState.monsterHealth < 1){
    alert("The monster has been slain, you are rewarded " + 50 * gameState.level + " gold" );
    gameState.gold += 50 * gameState.level;
    gameState.level += 1;
    if(gameState.position == "Defensive"){
      gameState.monDPS += .5;
    }
    if(gameState.position == "Offensive"){
      gameState.monDPS += 2;
    }
    if(gameState.position == "Neutral"){
      gameState.monDPS += 1;
    }
    gameState.monsterHealth = 50 * gameState.level;
  }
  renderGameState(gameState);
}

var clickHandler = function(){
  console.log("attack");
  gameState.gold = gameState.gold + gameState.attack;
  gameState.monsterHealth = gameState.monsterHealth - gameState.attack;
  if(gameState.monsterHealth < 1){
    alert("The monster has been slain, you are rewarded " + 50 * gameState.level + " gold" );
    gameState.gold += 50 * gameState.level;
    gameState.level += 1;
    gameState.monsterHealth = 50 * gameState.level;
    if(gameState.position == "Defensive"){
      gameState.monDPS += .5;
    }
    if(gameState.position == "Offensive"){
      gameState.monDPS += 2;
    }
    if(gameState.position == "Neutral"){
      gameState.monDPS += 1;
    }
  }
  renderGameState(gameState);
}

var clickNeutral = function(){
  console.log("Neutral");
  if(gameState.position == "Defensive"){
    gameState.attack = gameState.attack * 2;
    gameState.damagePerSecond = gameState.damagePerSecond * 2;
    gameState.monDPS = gameState.monDPS * 2;
  }
  if(gameState.position == "Offensive"){
    gameState.attack = gameState.attack / 2;
    gameState.damagePerSecond = gameState.damagePerSecond / 2;
    gameState.monDPS = gameState.monDPS / 2;
  }
  gameState.position = "Neutral";
  document.getElementById("shield").disabled = false;
  document.getElementById("sword").disabled = false;
  document.getElementById("normal").disabled = true;
}

var clickOffense = function(){
  console.log("charge");
  if(gameState.position == "Neutral"){
    gameState.attack = gameState.attack * 2;
    gameState.damagePerSecond = gameState.damagePerSecond * 2;
    gameState.monDPS = gameState.monDPS * 2;
  }
  if(gameState.position == "Defensive"){
    gameState.attack = gameState.attack * 4;
    gameState.damagePerSecond = gameState.damagePerSecond * 4;
    gameState.monDPS = gameState.monDPS * 4;
  }
  gameState.position = "Offensive";
  document.getElementById("shield").disabled = false;
  document.getElementById("sword").disabled = true;
  document.getElementById("normal").disabled = false;
}

var clickDefend = function(){
  console.log("defend");
  if(gameState.position == "Neutral"){
    gameState.attack = gameState.attack / 2;
    gameState.damagePerSecond = gameState.damagePerSecond / 2;
    gameState.monDPS = gameState.monDPS / 2;
  }
  if(gameState.position == "Offensive"){
    gameState.attack = gameState.attack / 4;
    gameState.damagePerSecond = gameState.damagePerSecond / 4;
    gameState.monDPS = gameState.monDPS / 4;
  }
  gameState.position = "Defensive";
  document.getElementById("shield").disabled = true;
  document.getElementById("sword").disabled = false;
  document.getElementById("normal").disabled = false;
}

$("#slash").on("click", clickHandler);
$("#shield").on("click", clickDefend);
$("#sword").on("click", clickOffense);
$("#normal").on("click", clickNeutral);
$("#buy_sidekick").on("click", buySidekick);
$("#buy_health").on("click", buyHealth);
$("#buy_clicks").on("click", buyClicks);
$("#buy_fire").on("click", buyFire);
$("#buy_potion").on("click", buyPotion);
renderGameState(gameState);

let func = setInterval(gameTick, 1000);
