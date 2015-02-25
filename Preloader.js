Adventurous.Preloader = function (game)
{
	this.background = null;
	this.preloadBar = null;
	this.ready = false;
};

Adventurous.Preloader.prototype =
{
	preload: function ()
    {
		this.background = this.add.sprite(0, 0, 'preloader_background');
		this.preloadBar = this.add.sprite(0, 550, 'preloader_bar');
		this.load.setPreloadSprite(this.preloadBar);
        
        var preload = JSON.parse(game.cache.getText('preload'));
        this.loadFiles(preload.list);
	},

	create: function()
    {
        this.game.state.start('MainMenu');
	},
    
    loadFiles: function(list)
    {
        for(var i = 0; i < list.length; i++)
        {
            var name = list[i].name;
            var type = list[i].type;
            
            switch(type)
            {
                case "text":
                    this.load.text(name,"text/"+name+".txt");
                    break;
                    
                case "image":
                    this.load.image(name, "images/"+name+list[i].ext);
                    break;
                    
                case "spritesheet":
                    this.load.spritesheet(name, "images/"+name+list[i].ext, parseInt(list[i].width), parseInt(list[i].height));
                    break;
                    
                case "audio":
                    this.load.audio(name, ["audio/"+name+list[i].ext]);
                    break;
                                   
                case "tilemap":
                    this.load.tilemap(name, "maps/"+name+".json",null,Phaser.Tilemap.TILED_JSON);
                    break;
                    
                default:
                    console.debug("ERROR: Adventurous.Preloader.loadFiles(list) -- unrecognized file type " + type);
                    break;
            }
        }
    }
};
