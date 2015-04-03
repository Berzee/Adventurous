Adventurous.Cursor = function ()
{
    this.sprite = game.add.sprite(game.input.activePointer.x,game.input.activePointer.y,'cursor');
    this.item = null;
};

Adventurous.Cursor.prototype =
{
	update: function ()
    {        
        this.sprite.x = game.input.activePointer.x;
        this.sprite.y = game.input.activePointer.y;
	},
    
    setItem: function(item)
    {
        this.item = item;
        this.sprite.destroy();
        if(item != null)
        {
            this.sprite = game.add.sprite(game.input.activePointer.x,game.input.activePointer.y,this.item.imageName+'_cursor');
        }
        else
        {
            this.sprite = game.add.sprite(game.input.activePointer.x,game.input.activePointer.y,'cursor');
        }
    },
    
    hide: function()
    {
        this.sprite.visible = false;
    },
    
    show: function()
    {
        this.sprite.visible = true;
    },
    
    reload: function()
    {
        this.setItem(this.item);
    }
};
