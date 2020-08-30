class Player {
  consructor(){
    this.index = null;
    this.distance = 0;
    this.name = null;
  }
}


var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.lookDir = 0;
    this.collisionRect = { w: playerWidth/5*4, h: playerHeight/5*4 };
    this.hp = 100;
    this.animationFrame = 0;
    this.reload = 0;
  }
  Player.prototype.update = function() {
    this.angle = atan2(mouseY-height/2, mouseX-width/2);
    if( abs(this.angle) <= PI/4 ) this.lookDir = "right";
    else if( this.angle > PI/4 && this.angle <= PI/4*3 ) this.lookDir = "down";
    else if( abs(this.angle) > PI/4*3 ) this.lookDir = "left";
    else this.lookDir = "up";
    point(width/2, height/2);
  
    if(this.reload % reloadingTime != 0) this.reload ++;
  }
  Player.prototype.draw = function () {
    drawFraction( (width-playerWidth)/2, (height-playerHeight)/2, playerWidth, playerHeight, spritesParams.player[this.lookDir][round(this.animationFrame)%4] )
    this.animationFrame += 0.1;
  };
  Player.prototype.shoot = function () {
    if(this.reload % reloadingTime != 0) return;
  
    bullets.push(new Bullet(this.x, this.y+10, cos(this.angle)*bulletSpeed, sin(this.angle)*bulletSpeed));
    this.reload ++;
  };
  
