Adventurous.Button = function (x,y,text,buttonImage,normalStyle,hightlightStyle)
{
    this.buttonGroup = game.add.group();
    this.background = game.add.sprite(x,y,buttonImage);
    this.background.animations.add("normal",[0]);
    this.background.animations.add("highlight",[1]);
    this.background.x -= Math.floor(this.background.width/2);
    
    this.normalStyle = normalStyle;
    this.highlightStyle = hightlightStyle;
    
    this.label = game.add.text(x, y+Adventurous.Constants.BROWSER_LABEL_Y_OFFSET, text, normalStyle);
    this.label.x -= Math.floor(this.label.width/2);
    this.label.x += 3;
    this.label.y += 3;
    
    this.buttonGroup.add(this.background);
    this.buttonGroup.add(this.label);
};

Adventurous.Button.prototype =
{
	updateLabel: function()
    {   
        if(Adventurous.Util.isMouseOverObject(this.background))
        {
            this.label.setStyle(this.highlightStyle);
            this.background.animations.play("highlight");
        }
        else
        {
            this.label.setStyle(this.normalStyle);
            this.background.animations.play("normal");
        }
	}
};
