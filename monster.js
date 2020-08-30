class roof
{
  constructor(x,y)
}
var options={
  isStatic:true
}
this.x=x;
this.y=y;
this.body=Bodies.rectangle(x,y,options)
World.add(world,this.body)



var Monster = function(x, y) {
    this.x = x;
    this.y = y;
    this.hp = 100;
    this.animationFrame = 0;
    this.collisionRect = { w: monsterWidth/5*4, h: monsterHeight/5*4 };
    this.punchTime = 0;
  }
  Monster.prototype.update = function () {
    if(this.hp <= 0) {
      monsters.splice(monsters.indexOf(this), 1);
      return true;
    }
  
    if(myIntersect(player, this) && this.punchTime%monsterPunchTime === 0) {
      player.hp -= monsterDamage;
      this.punchTime++;
    } else if(this.punchTime%monsterPunchTime != 0) {
      this.punchTime++;
    }
  
  
    var vec = createVector(player.x - this.x, player.y - this.y);
    vec.normalize();
    vec.mult(monsterSpeed);
  
    var newCollisionObjX = { x: this.x+vec.x, y: this.y+vec.y, collisionRect: { w: this.collisionRect.w, h: 10 } },
        newCollisionObjY = { x: this.x+vec.x, y: this.y+vec.y, collisionRect: { w: 10, h: this.collisionRect.h } };
  
    for(var i=0; i<walls.length; i++) {
      if(myIntersect(walls[i], newCollisionObjX)) {
        vec.x = 0;
      }
      if(myIntersect(walls[i], newCollisionObjY)) {
        vec.y = 0;
      }
      if(vec.x === 0 && vec.y === 0) break;
    }
  
    this.x += vec.x;
    this.y += vec.y;
  };
  Monster.prototype.draw = function() {
    drawFraction( this.x-player.x+(width-monsterWidth)/2, this.y-player.y+(height-monsterHeight)/2, monsterWidth, monsterHeight, spritesParams.monster[round(this.animationFrame)%3] )
    this.animationFrame += 0.2;
  
    var hprectwidth = this.hp/100 * monsterWidth;
    fill(color(250, 20, 20));
    // strokeWidth(1);
    stroke(0);
    rect(this.x-player.x+(width-monsterWidth)/2, this.y-player.y+(height-monsterHeight)/2-2, hprectwidth, 1, 0.25 );
  }
  