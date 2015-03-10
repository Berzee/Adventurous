Adventurous.Slider = function (x,y,value)
{
    this.dragging = false;
    this.value = value;
    this.prevX = -1;
    this.sliderGroup = game.add.group();
    this.background = game.add.sprite(x,y,"slider_bg");
    
    this.slider = game.add.sprite(this.background.x+value*this.background.width,y,"slider");
    this.slider.x -= Math.floor(this.slider.width/2);
    this.slider.x = Math.min(this.background.x + this.background.width - this.slider.width,Math.max(this.slider.x,this.background.x));
    
    this.sliderGroup.add(this.background);
    this.sliderGroup.add(this.slider);
    
    game.input.onDown.add(this.mouseDown, this);
    game.input.onUp.add(this.mouseUp, this);
};

Adventurous.Slider.prototype =
{
	update: function()
    {   
        if(this.dragging)
        {
            this.slider.x += (game.input.mousePointer.x-this.prevX);
            this.slider.x = Math.min(this.background.x + this.background.width - this.slider.width,Math.max(this.slider.x,this.background.x));

            this.prevX = game.input.mousePointer.x;
        }
	},
    
    mouseDown: function()
    {
        if(this.sliderGroup.visible)
        {
            if(Adventurous.Util.isMouseOverObject(this.slider))
            {
                this.dragging = true;
                this.prevX = game.input.mousePointer.x;
            }
            else
            {
                this.dragging = false;
            }
        }
    },
    
    mouseUp: function()
    {
        this.dragging = false;
        this.value = (this.slider.x - this.background.x)/(this.background.width-this.slider.width);
    },
    
    hide: function()
    {
        this.sliderGroup.visible = false;
    },
    
    show: function()
    {
        this.sliderGroup.visible = true;
    },
    
    setValue: function(value)
    {
        this.slider.x = this.background.x+value*this.background.width;
        this.slider.x -= Math.floor(this.slider.width/2);
        this.slider.x = Math.min(this.background.x + this.background.width - this.slider.width,Math.max(this.slider.x,this.background.x));
    }
};
