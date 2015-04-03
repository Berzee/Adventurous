Adventurous.ToggleButton = function (x,y,selected)
{
    this.selected = selected;
    this.justChanged = false;
    this.sprite = game.add.sprite(x,y,"toggle_button");
    this.sprite.animations.add("off",[0]);
    this.sprite.animations.add("on",[1]);    
    if(this.selected)
    {
        this.sprite.animations.play("on");
    }
    else
    {
        this.sprite.animations.play("off");
    }
    
    game.input.onDown.add(this.mouseDown, this);
    
    this.enabled = true;
};

Adventurous.ToggleButton.prototype =
{
    
    mouseDown: function()
    {
        if(this.sprite.visible && this.sprite.parent.visible && this.enabled)
        {
            if(Adventurous.Util.isMouseOverObject(this.sprite))
            {
                this.toggle();
            }
        }
    },
    
    toggle: function()
    {
        var clickSound = game.add.audio(Adventurous.Constants.MENU_BUTTON_SOUND);
        clickSound.volume = Adventurous.options.soundVolume;
        clickSound.play();
        
        this.justChanged = true;
        this.selected = !this.selected;
        if(this.selected)
        {
            this.sprite.animations.play("on");
        }
        else
        {
            this.sprite.animations.play("off");
        }
    },
    
    setSelected: function(selected,ignoreJustChanged)
    {
        if(ignoreJustChanged != true)
        {
            this.justChanged = true;
        }
        this.selected = selected;
        if(this.selected)
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
