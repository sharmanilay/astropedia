function ShootingStar (width) {
  this.type = 'shooting'
  this.reset(width)
}


ShootingStar.prototype.reset = function(width) {
  this.x = Math.random()*width;
  this.y = 0;
  this.len = (Math.random()*80)+10;
  this.speed = (Math.random()*10)+6;
  this.size = (Math.random()*1)+0.1;

  this.waitTime =  new Date().getTime() + (Math.random()*3000)+500;
  this.active = false;
}

ShootingStar.prototype.update = function(bgCtx, height, width){
  if (this.active) {
    this.x-=this.speed;
    this.y+=this.speed;
    if(this.x<0 || this.y >= height){
      this.reset(width);
    }else{
    bgCtx.lineWidth = this.size;
      bgCtx.beginPath();
      bgCtx.moveTo(this.x,this.y);
      bgCtx.lineTo(this.x+this.len, this.y-this.len);
      bgCtx.stroke();
    }
  } else{
    if(this.waitTime < new Date().getTime()){
      this.active = true;
    }			
  }
}

export default ShootingStar