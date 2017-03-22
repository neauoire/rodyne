function Surface(rune)
{
  Module.call(this,rune);
  
  this.element = null;
  this.settings = {"size":new Rect("200x200")};
  this.methods = [new Method("resize",[new Rect().name]),new Method("crop",[new Position().name,new Rect().name])]

  this.layers = {};
  this.active_layer = null;
  this.render_layer = null;

  this.widget_element = document.createElement("widget");
  
  this.install = function()
  {
    this.element.appendChild(this.widget_element);
    this.blink();
  }

  this.blink = function()
  {
    Object.keys(ronin.surface.layers).forEach(function (key) {
      ronin.surface.layers[key].blink();
    });
    setTimeout(function(){ ronin.surface.blink(); }, 30);
  }

  this.resize = function(params)
  {
    var rect = new Rect(params[0]);
    this.settings["size"] = rect;

    Object.keys(ronin.surface.layers).forEach(function (key) {
      ronin.surface.layers[key].resize(rect);
    });
    
    ronin.surface.element.width = rect.width * 2;
    ronin.surface.element.height = rect.height * 2;
    ronin.surface.element.style.width = rect.width+"px";
    ronin.surface.element.style.height = rect.height+"px";
    ronin.surface.element.style.marginLeft = -(rect.width/2);
    ronin.surface.element.style.marginTop = -(rect.height/2);

    ronin.on_resize();
    ronin.terminal.log(new Log(this,"Resized Surface to "+this.settings["size"].render()));
  }

  this.select = function(params)
  {
    var layer_name = params[0];
    if(!ronin.surface.layers[layer_name]){
      this.add_layer(new Layer(name));
    }
    this.select_layer(this.layers[name]);
  }

  this.select_layer = function(layer)
  {
    console.log("Selecting layer:"+layer.name);
    this.active_layer = layer;
  }

  this.select_any_layer = function()
  {
    var layer_name = Object.keys(ronin.surface.layers)[0];
    this.select_layer(ronin.surface.layers[layer_name]);    
  }

  this.add_layer = function(layer)
  {
    ronin.terminal.log(new Log(this,"Creating layer:"+layer.name+(layer.manager ? "["+layer.manager.constructor.name+"]" : ""))); 

    layer.resize(this.settings["size"]);
    this.layers[layer.name] = layer;
    this.element.appendChild(layer.element);
  }

  this.widget = function()
  {
    if(!this.active_layer){ return ""; }

    return this.rune+" "+this.settings["size"].render();
  }

  // Widget

  this.update_widget = function()
  {
    var s = "";
    
    s += "<span class='module'>";
    for (var key in ronin.modules){
      s += ronin.modules[key].widget() ? ronin.modules[key].widget()+" " : "";
    }
    s += "</span>";
  
    s += "<span class='cursor'>"+ronin.cursor.mode.mouse_mode()+"</span>";
    
    var keys = Object.keys(ronin.surface.layers);
    // var loc = keys.indexOf(this.active_layer.name);

    // if(keys.length > 1){
    //   s += "<span class='layer'>"+ronin.surface.active_layer.widget()+"("+(loc+1)+"/"+keys.length+")</span>";
    // }
    // else{
    //   s += "<span class='layer'>"+ronin.surface.active_layer.widget()+"</span>";
    // }
  
    this.widget_element.innerHTML = s;
  }

  // Commands

  this.layer_up = function()
  {
    var keys = Object.keys(ronin.surface.layers);
    var loc = keys.indexOf(this.active_layer.name);

    if(loc >= keys.length-1){ console.log("Reached end"); return false; }

    if(keys[loc+1] != null){this.select_layer(ronin.surface.layers[keys[loc+1]]);}
  }

  this.layer_down = function()
  {
    var keys = Object.keys(ronin.surface.layers);
    var loc = keys.indexOf(this.active_layer.name);

    if(keys[loc-1] != null){this.select_layer(ronin.surface.layers[keys[loc-1]]);}
  }

  this.passive = function(cmd)
  { 
    var crop = ronin.terminal.cmd().method("crop");

    if(crop && crop.params.length == 2){
      console.log(crop);  
      ronin.overlay.select_layer().clear();
      ronin.overlay.draw_rect(new Position(crop.params[0]),new Rect(crop.params[1]));
    }
    else{
      console.log("Missing params")
    }
    ronin.terminal.update_hint();
  }

  // Cursor

  this.mouse_mode = function()
  { 
    return "crop"; 
  }
  
  this.mouse_down = function(position)
  {
    ronin.overlay.select_layer().clear();
    ronin.overlay.draw_pointer(position);
  }
  
  this.mouse_move = function(position,rect)
  {      
    ronin.terminal.input_element.value = "@ crop:"+this.mouse_from.render()+":"+rect.render()+" ";
    this.passive();
  }
  
  this.mouse_up = function(position,rect)
  {
  }
}