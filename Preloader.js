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
		this.preloadBar = this.add.sprite(0, 0, 'preloader_bar');
        this.preloadBar.y = game.height - this.preloadBar.height;
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
                    var formats = [];
                    for(var j = 0; j < list[i].ext.length; j++)
                    {
                        formats[j] = "audio/"+name+list[i].ext[j];
                    }
                    this.load.audio(name, formats);
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
