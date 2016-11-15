function Pointer(offset = new Position(), color = new Color('000000'))
{
  this.offset = offset;
  this.mirror = null;
  this.noise  = null;
  this.position_prev = null;
  
  this.draw = function()
  {
    if(!this.position_prev){this.position_prev = this.position(); }
    if(ronin.brush.size < 0){ this.erase(); return; }
    
    var position = this.position();
    
    if(this.noise){
      position.x += (Math.random() * this.noise) - (this.noise/2);
      position.y += (Math.random() * this.noise) - (this.noise/2);
    }
    
    ronin.canvas.context().beginPath();
    ronin.canvas.context().moveTo(this.position_prev.x,this.position_prev.y);
    ronin.canvas.context().lineTo(position.x,position.y);
    ronin.canvas.context().lineCap="round";
    ronin.canvas.context().lineWidth = this.thickness();
    ronin.canvas.context().strokeStyle = ronin.brush.color.rgba();
    ronin.canvas.context().stroke();
    ronin.canvas.context().closePath();
    
    this.position_prev = position;
  }
  
  this.erase = function()
  {
    ronin.canvas.context().clearRect(this.position().x - (ronin.brush.size/2), this.position().y - (ronin.brush.size/2), ronin.brush.size, ronin.brush.size);
  }
  
  this.thickness = function()
  {
    var ratio = 10/this.position().distance_to(this.position_prev);
    ratio = ratio > 1 ? 1 : ratio;
    return ronin.brush.size * ratio;
  }
  
  this.position = function()
  {
    if(this.mirror && this.mirror.width > 0){
      return new Position(this.mirror.width - (ronin.brush.position.x + this.offset.x), 0 + (ronin.brush.position.y + this.offset.y));
    }
    else if(this.mirror && this.mirror.height > 0){
      return new Position((ronin.brush.position.x + this.offset.x), this.mirror.height - (ronin.brush.position.y + this.offset.y));
    }
    return new Position(ronin.brush.position.x + this.offset.x, ronin.brush.position.y + this.offset.y);
  }
  
  this.start = function()
  {
  }
  
  this.stop = function()
  {
    this.position_prev = null;
  }
}