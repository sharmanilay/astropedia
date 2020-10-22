function Star(options) {
  this.size = Math.random()*2;
  this.speed = Math.random()*.1;
  this.x = options.x;
  this.y = options.y;
  this.type = 'star';
}

Star.prototype.reset = function(height, width){
  this.size = Math.random()*2;
  this.speed = Math.random()*.1;
  this.x = width;
  this.y = Math.random()*height;
}

Star.prototype.update = function(bgCtx){
  this.x-=this.speed;
  if(this.x<0){
    this.reset();
  }else{
    bgCtx.fillRect(this.x,this.y,this.size,this.size); 
  }
}

export default Star;