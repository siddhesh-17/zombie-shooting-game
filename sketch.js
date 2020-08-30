var w, h, spritemap, player, reloadingTime = 10, playerSpeed = 6, buildingMode = false;
    keys = { left: false, right: false, up: false, down: false, space: false },
    bullets = [], bulletSpeed = 20, gunDamage = 15,
    monsterWidth = 52, monsterHeight = 56, monsters = [], monsterSpeed = 3, monsterPunchTime = 10, monsterDamage = 5,
    playerWidth = 32, playerHeight = 41,
    spawnTime = 150, spawnReload = 0,
    mapWidth = 1024, mapHeight = 1012,
    wallSizeW = 32, wallSizeH = 46, wallSizeHC = 28, walls = [],
    wallCollisionRect = { w: wallSizeW, h: wallSizeH }, wallBuildCollisionRect = { w: wallSizeW, h: wallSizeHC };

var preload = function() {
  player = loadImage("ryan.jpg.png");
  monster = loadImage("zombie.jpg.gif");
}

var setup = function() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(w, h);
  noSmooth();
  init();
}

var init = function() {
  walls = [];
  initMapWalls();
  for(var i=0; i<10; i++) { 
    var newWall = { x: random(mapWidth), y: random(mapHeight),
      collisionRect: wallCollisionRect },
      collide = false;
    for(var k=0; k<walls.length; k++) {
      if(myIntersect(newWall, walls[i])) {
        collide = true;
        break;
      }
    }
    if(collide) {
      continue;
    }
    walls.push(newWall);
  }
  sortWalls();
  monsters = [];
  bullets = [];
  player = new Player(mapWidth/2, mapHeight/2);
}

var time = 0;

var draw = function() {
  if(player.hp <= 0) init();
  background(color(20, 200, 20));

  if(spawnReload%spawnTime === 0) {
    spawnEnemy();
  }
  spawnReload ++;

  player.update();
  player.draw();
  if(!buildingMode && (keys.space || mouseIsPressed) ) player.shoot();

  for(var i=0; i<walls.length; i++) {
    drawFraction(walls[i].x-player.x+(width-wallSizeW)/2, walls[i].y-player.y+(height-wallSizeH)/2, wallSizeW, wallSizeH, spritesParams.wall);
  }
  for(var i=0; i<bullets.length; i++) {
    if(bullets[i].update()) continue;
    bullets[i].draw();
  }
  for(var i=0; i<monsters.length; i++) {
    if(monsters[i].update()) continue;
    monsters[i].draw();
  }

  drawPlayersHealthBar();
  if(buildingMode) {
    writeBuildSign();
    if(mouseIsPressed) tryToBuildWall();
  }

  moveIfNeed();

  time += 1;
}

var drawPlayersHealthBar = function() {
  var healthBarW = player.hp / 100 * w * 0.8;
  fill(color(200, 20, 20));
  stroke(0);
  rect(w/2 - 0.4*w, h - 20, healthBarW, 16, 5);
}

var writeBuildSign = function() {
  fill(color(20, 20, 220));
  stroke(color(10, 10, 200));
  textAlign(CENTER);
  textSize(16);
  text("BUILD", w/2, 30);
}

var tryToBuildWall = function() {
  var newWall = { x: mouseX-width/2+player.x, y: mouseY-height/2+player.y, collisionRect: wallBuildCollisionRect };
  var can = true;
  for(var i=0; i<walls.length; i++) {
    if(myIntersect(walls[i], newWall)) {
      can = false;
      break;
    }
  }
  if(can) {
    newWall.collisionRect = wallCollisionRect;
    walls.push(newWall);
  }
}

var initMapWalls = function() {
  for(var x=0; x<=mapWidth; x+=wallSizeW) {
    walls.push({ x: x, y: -wallSizeHC-2, collisionRect: wallCollisionRect });
    walls.push({ x: x, y: mapHeight-2, collisionRect: wallCollisionRect });
  }
  for(var y=-wallSizeHC-2; y<=mapHeight; y+=wallSizeHC) {
    walls.push({ x: 0, y: y, collisionRect: wallCollisionRect });
    walls.push({ x: mapWidth, y: y, collisionRect: wallCollisionRect });
  }
}
var sortWalls = function() {
  walls = combSorting(walls);
}
function combSorting(array) {
  const factor = 1.247;
  let gapFactor = array.length / factor;

  while (gapFactor > 1) {
    const gap = Math.round(gapFactor);
    for (let i = 0, j = gap; j < array.length; i++, j++) {
      if (array[i].y >= array[j].y) {
        [ array[i], array[j] ] = [ array[j], array[i] ];
      }
    }
    gapFactor = gapFactor / factor;
  }
  return array;
}

var keyPressed = function() {
  if(keyCode === LEFT_ARROW || key.toLowerCase() === 'a' || key.toLowerCase() === 'ф') keys.left = true;
  else if(keyCode === RIGHT_ARROW || key.toLowerCase() === 'd' || key.toLowerCase() === 'в') keys.right = true;
  else if(keyCode === UP_ARROW || key.toLowerCase() === 'w' || key.toLowerCase() === 'ц') keys.up = true;
  else if(keyCode === DOWN_ARROW || key.toLowerCase() === 's' || key.toLowerCase() === 'ы') keys.down = true;
  else if(key === ' ') keys.space = true;
  else if(key.toLowerCase() === 'v' || key.toLowerCase() === 'м') buildVipRoom();
  else if(key.toLowerCase() === 'b' || key.toLowerCase() === 'и') buildingMode = !buildingMode;
}

var keyReleased = function() {
  if(keyCode === LEFT_ARROW || key.toLowerCase() === 'a' || key.toLowerCase() === 'ф') keys.left = false;
  else if(keyCode === RIGHT_ARROW || key.toLowerCase() === 'd' || key.toLowerCase() === 'в') keys.right = false;
  else if(keyCode === UP_ARROW || key.toLowerCase() === 'w' || key.toLowerCase() === 'ц') keys.up = false;
  else if(keyCode === DOWN_ARROW || key.toLowerCase() === 's' || key.toLowerCase() === 'ы') keys.down = false;
  else if(key === ' ') keys.space = false;
}

var spawnEnemy = function() {
  for(var attempt=0; attempt<30; attempt++) {
    var x = random(wallSizeW, mapWidth-wallSizeW),
        y = random(wallSizeH, mapHeight-wallSizeHC-monsterHeight/2),
        mon = new Monster(x, y),
        collide = false;
    for(var i=0; i<monsters.length; i++) {
      if(myIntersect(mon, monsters[i])) {
        collide = true;
        break;
      }
    }
    if(collide || dist(x, y, player.x, player.y) < 200) {
      continue;
    }
    collide = false;
    for(var i=0; i<walls.length; i++) {
      if(myIntersect(mon, walls[i])) {
        collide = true;
        break;
      }
    }
    if(collide) {
      continue;
    }
    monsters.push(mon);
    break;
  }
}

var buildVipRoom = function() {
  walls.push({ x: wallSizeW, y: 3*wallSizeHC, collisionRect: wallCollisionRect });
  walls.push({ x: 2*wallSizeW, y: 3*wallSizeHC, collisionRect: wallCollisionRect });
  walls.push({ x: 3*wallSizeW, y: 3*wallSizeHC, collisionRect: wallCollisionRect });
  walls.push({ x: 3*wallSizeW, y: 2*wallSizeHC, collisionRect: wallCollisionRect });
  walls.push({ x: 3*wallSizeW, y: 2*wallSizeHC, collisionRect: wallCollisionRect });
  walls.push({ x: 3*wallSizeW, y: wallSizeHC, collisionRect: wallCollisionRect });

  player.x = 50;
  player.y = 50;
  sortWalls();
}

var moveIfNeed = function() {
  var vx = 0,
      vy = 0;
  if(keys.up) vy = -1;
  if(keys.down) vy += 1;
  if(keys.left) vx = -1;
  if(keys.right) vx += 1;

  var vec = createVector(vx, vy);
  vec.normalize();
  vec.mult(playerSpeed);

  var newCollisionObjX = { x: player.x+vec.x, y: player.y+vec.y, collisionRect: { w: player.collisionRect.w, h: 10 } },
      newCollisionObjY = { x: player.x+vec.x, y: player.y+vec.y, collisionRect: { w: 10, h: player.collisionRect.h } };

  for(var i=0; i<walls.length; i++) {
    if(myIntersect(walls[i], newCollisionObjX)) {
      vec.x = 0;
    }
    if(myIntersect(walls[i], newCollisionObjY)) {
      vec.y = 0;
    }
    if(vec.x === 0 && vec.y === 0) break;
  }

  player.x += vec.x;
  player.y += vec.y;
}

var intersect = function(a,b){
  return(
    (
      (
        ( a.x>=b.x && a.x<=b.x1 )||( a.x1>=b.x && a.x1<=b.x1  )
      ) && (
        ( a.y>=b.y && a.y<=b.y1 )||( a.y1>=b.y && a.y1<=b.y1 )
      )
    )||(
      (
        ( b.x>=a.x && b.x<=a.x1 )||( b.x1>=a.x && b.x1<=a.x1  )
      ) && (
        ( b.y>=a.y && b.y<=a.y1 )||( b.y1>=a.y && b.y1<=a.y1 )
      )
    )
  )||(
    (
      (
        ( a.x>=b.x && a.x<=b.x1 )||( a.x1>=b.x && a.x1<=b.x1  )
      ) && (
        ( b.y>=a.y && b.y<=a.y1 )||( b.y1>=a.y && b.y1<=a.y1 )
      )
    )||(
      (
        ( b.x>=a.x && b.x<=a.x1 )||( b.x1>=a.x && b.x1<=a.x1  )
      ) && (
        ( a.y>=b.y && a.y<=b.y1 )||( a.y1>=b.y && a.y1<=b.y1 )
      )
    )
  );
}
var myIntersect = function(o1, o2) {
  return intersect(
    { x: o1.x-o1.collisionRect.w/2, y: o1.y-o1.collisionRect.h/2, x1: o1.x+o1.collisionRect.w/2, y1: o1.y+o1.collisionRect.h/2 },
    { x: o2.x-o2.collisionRect.w/2, y: o2.y-o2.collisionRect.h/2, x1: o2.x+o2.collisionRect.w/2, y1: o2.y+o2.collisionRect.h/2 });
}
