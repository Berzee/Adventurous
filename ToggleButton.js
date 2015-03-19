Adventurous.ToggleButton = function (x,y,enabled)
{
    this.enabled = enabled;
    this.justChanged = false;
    this.sprite = game.add.sprite(x,y,"toggle_button");
    this.sprite.animations.add("off",[0]);
    this.sprite.animations.add("on",[1]);    
    if(this.enabled)
    {
        this.sprite.animations.play("on");
    }
    else
    {
        this.sprite.animations.play("off");
    }
    
    game.input.onDown.add(this.mouseDown, this);
};

Adventurous.ToggleButton.prototype =
{
    
    mouseDown: function()
    {
        if(this.sprite.visible)
        {
            if(Adventurous.Util.isMouseOverObject(this.sprite))
            {
                this.toggle();
            }
        }
    },
    
    toggle: function()
    {
        this.justChanged = true;
        this.enabled = !this.enabled;
        if(this.enabled)
        {
            this.sprite.animations.play("on");
        }
        else
        {
            this.sprite.animations.play("off");
        }
    },
    
    setEnabled: function(enabled)
    {
        this.justChanged = true;
        this.enabled = enabled;
        if(this.enabled)
        {
            this.sprite.animations.play("on");
        }
        else
        {
            this.sprite.animations.play("off");
        }
    },
    
    hide: function()
    {
        this.sprite.visible = false;
    },
    
    show: function()
    {
        this.sprite.visible = true;
    }
};
