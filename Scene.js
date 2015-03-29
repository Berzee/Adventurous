Adventurous.Scene = function (obj)
{
    this.name = obj.name;
    
    if(obj.scales != null)
    {
        this.scales = obj.scales;
    }
    
    if(this.name != Adventurous.Constants.OFFSTAGE_SCENE)
    {
        this.background = game.add.sprite(0,0,this.name);
        game.physics.enable(this.background, Phaser.Physics.ARCADE, true);
        this.map = game.add.tilemap(this.name);
        var graphMap = [];
        for(var i = 0 ; i < this.map.layers[0].data.length; i++)
        {
            var mapRow = this.map.layers[0].data[i];
            var arr = [];
            for(var j = 0; j < mapRow.length; j++)
            {
                arr[arr.length] = mapRow[j].index;
            }
            graphMap[i] = arr;
        }
        this.graph = new Graph(graphMap);
    }
    else
    {
        this.background = game.add.sprite(0,0);
    }
    
    this.things = new Array(); //a subset of Adventurous.Game.thingsArray
    this.triggerAreas = new Array();
    this.exits = new Array();
    this.entrances = {};
    
    this.init(obj);
    
    GraphNodeType.WALL = 1; //zone tilemap is 1-indexed
    GraphNodeType.OPEN = 2;
    
    Adventurous.scenes[this.name] = this;
    this.hide();
};

Adventurous.Scene.prototype =
{
	update: function ()
    {
        for(var i = 0; i < this.triggerAreas.length; i++)
        {
            this.triggerAreas[i].update();
        }
        for(var i = 0; i < this.exits.length; i++)
        {
            this.exits[i].update();
        }
        for(var i = 0; i < this.things.length; i++)
        {
            this.things[i].update();
        }
	},
    
    findPath: function(thing,x,y)
    {
        var endTileX = Math.floor(x / Adventurous.Constants.TILE_SIZE);
        var endTileY = Math.floor(y / Adventurous.Constants.TILE_SIZE);
        
        var start = this.graph.nodes[thing.getTileY()][thing.getTileX()];
        var end = this.graph.nodes[endTileY][endTileX];
        var result = astar.search(this.graph.nodes, start, end, true);
        result.splice(0,0,start);
        
        result = this.smoothPath(result);
        
        var pathInPixels = new Array(result.length);
        
        pathInPixels[0] = new Phaser.Point(thing.sprite.x,thing.sprite.y);
        
        if(result.length == 1)
        {
            pathInPixels[1] = new Phaser.Point(x,y);
        }
        else
        {
            for(var i = 1; i < result.length; i++)
            {            
                //Note: the X and Y on the graph seem to be mixed up (???) so it makes the code here a bit funny
                if(i != result.length - 1)
                {
                    pathInPixels[i] = new Phaser.Point((result[i].y + 0.5) * Adventurous.Constants.TILE_SIZE, (result[i].x+0.5) * Adventurous.Constants.TILE_SIZE);
                }
                else
                {
                    pathInPixels[i] = new Phaser.Point(x,y);
                }
            }
        }
        
        return pathInPixels;
    },
    
    //Removes superfluous intermediary tiles
    smoothPath: function(path)
    {
        var keepOnSmoothing = true;
        while(keepOnSmoothing)
        {
            keepOnSmoothing = false;
            
            for(var i = 1; i < path.length-1; i++)
            {
                if(this.lineOfSight(path[i-1].y,path[i-1].x,path[i+1].y,path[i+1].x))
                {
                    path.splice(i,1);
                    i--;
                    keepOnSmoothing = true;
                }
            }
        }
        return path;
    },
    
    lineOfSight: function(x1,y1,x2,y2)
    {
        var point = new Phaser.Point(x1,y1);
        
        var dir = new Phaser.Point(x2-x1,y2-y1).normalize();
        dir.x = dir.x * .25;
        dir.y = dir.y * .25;
        
        var passed = false;
        
        while(!passed)
        {
            point.x += dir.x;
            point.y += dir.y;
            
            if(Adventurous.Constants.WALKABLE_TILES.indexOf(this.map.getTile(Math.floor(point.x),Math.floor(point.y)).index) == -1)
            {
                return false;
            }
            
            passed = ( (x2==x1) || (x2 > x1 && point.x >= x2) || (x2 < x1 && point.x <= x2)) &&          
                     ((y2 == y1) || (y2 > y1 && point.y >= y2) || (y2 < y1 && point.y <= y2));
        }
        return true;
    },
    
    init: function(obj)
    {
        //things
        if(obj.things != null)
        {
            for(var i = 0; i < obj.things.length; i++)
            {
                var thing = new Adventurous.Thing(obj.things[i]);
                Adventurous.thingsMap[thing.name] = thing;
                Adventurous.thingsArray[Adventurous.thingsArray.length] = thing;
                
                if(thing.name != Adventurous.Constants.PLAYER_NAME)
                {
                    this.things[this.things.length] = thing;
                }
                else
                {
                    Adventurous.startingScene = this.name;
                }
            }
        }
        
        //triggerAreas
        if(obj.triggerAreas != null)
        {
            for(var i = 0; i < obj.triggerAreas.length; i++)
            {
                this.triggerAreas[i] = new Adventurous.TriggerArea(obj.triggerAreas[i]);
            }
        }
        
        if(obj.entrances != null)
        {
            for(var i = 0; i < obj.entrances.length; i++)
            {
                this.entrances[obj.entrances[i].name] = obj.entrances[i];
            }
        }  
    },
    
    hide: function()
    {
        this.background.visible = false;
        for(var i = 0; i < this.things.length; i++)
        {
            this.things[i].stopTalking();
        }
    },
    
    show: function()
    {
        this.background.visible = true;
    },
    
    toSaveObject: function()
    {
        var obj = {};
        obj.name = this.name;
        obj.things = [];
        for(var i = 0; i < this.things.length; i++)
        {
            obj.things[obj.things.length] = this.things[i].toSaveObject();
        }
        return obj;
    },
    
    loadFromObject: function(obj)
    {
        this.things = new Array();
        for(var i = 0; i < obj.things.length; i++)
        {
            Adventurous.thingsMap[obj.things[i].name].loadFromObject(obj.things[i]);
            this.things[this.things.length] = Adventurous.thingsMap[obj.things[i].name];
        }
    }
};
