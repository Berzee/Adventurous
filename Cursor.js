Adventurous.Cursor = function ()
{
    this.sprite = game.add.sprite(game.input.mousePointer.x,game.input.mousePointer.y,'cursor');
    this.item = null;
};

Adventurous.Cursor.prototype =
{
	update: function ()
    {        
        this.sprite.x = game.input.mousePointer.x;
        this.sprite.y = game.input.mousePointer.y;
	},
    
    setItem: function(item)
    {
        this.item = item;
        this.sprite.destroy();
        if(item != null)
        {
            this.sprite = game.add.sprite(game.input.mousePointer.x,game.input.mousePointer.y,this.item.imageName+'_cursor');
        }
        else
        {
            this.sprite = game.add.sprite(game.input.mousePointer.x,game.input.mousePointer.y,'cursor');
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
