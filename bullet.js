class bullet{
constructor(body1,body2,offsetX,offsetY)
}
this.offsetX=offsetX
this.offsetY=offsetY
var options={
bodyA:body1,
bodyB:body2
pointB:{x:this.offsetX,y:this.offsetY}
}
this.bullet=Constraint.create(options)
world.add(world,this.rope)
}


var Bullet = function(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.s = 1;
    this.vx = vx;
    this.vy = vy;
    this.hp = 100;
    this.collisionRect = { w: 4, h: 4 };
    this.damage = gunDamage;
  }
  Bullet.prototype.update = function () {
    if(this.hp <= 0) {
      bullets.splice(bullets.indexOf(this), 1);
      return true;
    }
    this.hp -= 1;
    for(var i=0; i<monsters.length; i++) {
      if(myIntersect(this, monsters[i])) {
        monsters[i].hp -= this.damage;
        bullets.splice(bullets.indexOf(this), 1);
        return true;
      }
    }
    this.x += this.vx;
    this.y += this.vy;
  };
  
  Bullet.prototype.draw = function () {
    stroke(0);
    fill(255);
  
    var relX = this.x-2.5 - player.x,
        relY = this.y-2.5 - player.y;
  
    var h = 2.5;
  
    rect(floor(relX/h)*h + width/2, floor(relY/h)*h + height/2, 5, 5);
  };
  