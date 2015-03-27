Adventurous.Thing = function (obj)
{
    this.name = obj.name;
    this.walks = obj.walks;
	this.imageName = obj.image;
    this.alias = obj.alias;
    if(this.imageName == null)
    {
        this.imageName = this.name;
    }
    
    this.sprite = game.add.sprite(parseInt(obj.x),parseInt(obj.y),this.imageName);
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE, true);
    
    if(this.sprite.width % 2 != 0)
    {
        this.sprite.x -= 0.5;
    }
    
    this.oldFrame = 0;
    this.bitmapData = game.add.bitmapData(this.sprite.width,this.sprite.height);
    this.refreshBitmapData();
    
    if(obj.anims != null)
    {
        for(var i = 0; i < obj.anims.length; i++)
        {
            var anim = obj.anims[i];
            var fps = 1;
            if(anim.fps != null)
            {
                fps = anim.fps;
            }
            var loop = false;
            if(anim.loop != null)
            {
                loop = anim.loop;
            }
            this.sprite.animations.add(anim.name,anim.frames,fps,loop);
        }
        
        if(this.walks)
        {
            this.sprite.animations.play(Adventurous.Constants.ANIM_IDLE+"S");
        }
        else
        {
            this.sprite.animations.play(Adventurous.Constants.ANIM_IDLE);
        }
    }

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 1;
    this.sprite.body.y -= this.sprite.height;
    this.sprite.body.x -= this.sprite.width/2;
    
    this.isInventoryItem = obj.isInventoryItem;
    
    this.MOVE_SPEED = Adventurous.Constants.DEFAULT_MOVE_SPEED;
    if(obj.speed != null)
    {
        this.MOVE_SPEED = obj.speed;
    }
    this.CURRENT_MOVE_SPEED = this.MOVE_SPEED;
    
    this.moveSpeed = this.MOVE_SPEED;
    
    this.observations = Adventurous.observations[this.name];
    this.interactions = Adventurous.interactions[this.name];
    
    if(this.observations == null)
    {
        this.observations = new Adventurous.Observations(null);
    }
    if(this.interactions == null)
    {
        this.interactions = new Adventurous.Interactions(null,this.name);
    }

    this.usableZone = new Array(); //list of which tiles you can stand on to use this thing
    if(obj.usableZone == "near")
    {
        var tx = Math.floor(this.sprite.body.x/Adventurous.Constants.TILE_SIZE);
        var ty = Math.floor(this.sprite.body.y/Adventurous.Constants.TILE_SIZE);
        while(ty*Adventurous.Constants.TILE_SIZE <= this.sprite.body.bottom)
        {
            while(tx*Adventurous.Constants.TILE_SIZE <= this.sprite.body.right)
            {
                this.usableZone[this.usableZone.length] = new Phaser.Point(tx,ty);
                tx += 1;
            }
            tx = Math.floor(this.sprite.body.x/Adventurous.Constants.TILE_SIZE);
            ty += 1;
        }
    }
    else if(obj.usableZone == "any")
    {
        this.usableZone = "any";
    }
    else if(obj.usableZone != null)
    {
        for(var i = 0; i < obj.usableZone.length; i++)
        {
            this.usableZone[i] = new Phaser.Point(parseInt(obj.usableZone[i].x),parseInt(obj.usableZone[i].y));
        }
    }
    
    this.waypoints;
    this.destination = null;
    this.destinationThing = null;
    
    this.dialogueLabelColor = obj.dialogueLabelColor;
    if(this.dialogueLabelColor != null)
    {
        this.dialogueLabelShadowColor = obj.dialogueLabelShadowColor;
        if(this.dialogueLabelShadowColor == null)
        {
            this.dialogueLabelShadowColor = "#000000";
        }
    }
    this.createLabel();
    this.showLabelCountdown = 0;
    
    this.talking = false;
    this.currentSpeech = null;
    
    this.tempVelocityX;
    this.tempVelocityY;
    
    this.startHidden = obj.startHidden;
    this.hasBeenHidden = false;
    this.isBackground = obj.isBackground;
    this.isForeground = obj.isForeground;
    
    this.isNoninteractive = obj.isNoninteractive;
    this.isScalable = obj.isScalable;
    
    this.routines = {};
    if(obj.routines != null)
    {
        for(var i = 0; i < obj.routines.length; i++)
        {
            if(obj.routines[i].name != null)
            {
                this.routines[obj.routines[i].name] = obj.routines[i];
            }
        }
    }
    
    this.startingRoutine = obj.startingRoutine;
    
    this.automateWalkAnimation = true;
    
    this.talkTime = 0;
    
    this.dialogueTime = Adventurous.Constants.dialogueTime;
    
    this.hide();
};

Adventurous.Thing.prototype =
{
	update: function ()
    {   
        if(this.startingRoutine != null)
        {            
            this.startRoutine(this.startingRoutine);
            this.startingRoutine = null;
        }
        
        if(this.sprite.frame != this.oldFrame)
        {
            this.refreshBitmapData();
        }
        
        var label = this.dialogueLabel;
        if(label == null || !label.visible)
        {
            label = this.label;
        }
        if(label != null && label.visible)
        {
            if(this.showLabelCountdown > 0)
            {
                if(--this.showLabelCountdown == 0)
                {
                    label.alpha = 1;
                }
            }
            
            this.positionLabel(label);
            if(!this.talking)
            {
                label.visible = false;
            }
            else
            {
                if(!this.currentSpeech.audio.isPlaying)
                {
                    if(this.talkTime > this.dialogueTime)
                    {
                        this.stopTalking();
                    }
                    else
                    {
                        this.talkTime += game.time.elapsed;
                    }
                }
            }
        }
        
        if(this.destination != null)
        {
            var passedX = (this.sprite.body.velocity.x > 0 && this.sprite.x >= this.destination.x) ||
                          (this.sprite.body.velocity.x < 0 && this.sprite.x <= this.destination.x);
            
            var passedY = (this.sprite.body.velocity.y > 0 && this.sprite.y >= this.destination.y) ||
                          (this.sprite.body.velocity.y < 0 && this.sprite.y <= this.destination.y);
            
            if(passedX)
            {
                this.sprite.body.velocity.x = 0;
                this.sprite.body.prev.x = this.sprite.body.x;
                this.sprite.x = this.destination.x;
            }
            
            if(passedY)
            {
                this.sprite.body.velocity.y = 0;
                this.sprite.body.prev.y = this.sprite.body.y;
                this.sprite.y = this.destination.y;
            }
            
            if(this.sprite.body.velocity.x == 0 && this.sprite.body.velocity.y == 0)
            {
                this.destination = null;
                this.nextWaypoint();
            }
        }
        else if(this.activeRoutine != null)
        {
            this.activeRoutine.update();
        }
        
        if(this.loadFramesDelay > 0)
        {
            this.loadFramesDelay -= 1;
        }
	},
    
    followPath: function(path,thing)
    {
        this.waypoints = path;
        this.destinationThing = thing;
        this.nextWaypoint();
    },
    
    moveTo: function(point,speed)
    {
        if(typeof(speed) == "undefined")
        {
            speed = this.moveSpeed;
        }
        var dir = new Phaser.Point(point.x-this.sprite.x,point.y-this.sprite.y).normalize();
        this.sprite.body.velocity.x = dir.x*speed;
        this.sprite.body.velocity.y = dir.y*speed;
        
        if(this.automateWalkAnimation)
        {
            this.sprite.animations.play("walk"+this.getAnimationDirection());
        }
        
        this.destination = point;
    },
    
    getAnimationDirection: function()
    {
        this.dirAnim = "";
        
        if(Math.abs(this.sprite.body.velocity.x) >= Math.abs(this.sprite.body.velocity.y))
        {
            if(this.sprite.body.velocity.x > 0)
            {
                this.dirAnim += "E";
            }
            else if(this.sprite.body.velocity.x < 0)
            {
                this.dirAnim += "W";
            }    
        }
        else
        {
            if(this.sprite.body.velocity.y > 0)
            {
                this.dirAnim  = "S";
            }
            else if(this.sprite.body.velocity.y < 0)
            {
                this.dirAnim = "N";
            }
        }
        
        return this.dirAnim;
    },
    
    face: function(target)
    {
        var anim = this.sprite.animations.currentAnim.name;
        if(anim.indexOf("walk") == 0 || anim.indexOf("idle") == 0)
        {
            var x = target.sprite.x - this.sprite.x;
            var y = target.sprite.y - this.sprite.y;
            
            if(Math.abs(x) >= Math.abs(y))
            {
                if(x >= 0)
                {
                    this.dirAnim = "E";
                }
                else
                {
                    this.dirAnim = "W";
                }
            }
            else
            {
                if(y >= 0)
                {
                    this.dirAnim = "S";
                }
                else
                {
                    this.dirAnim = "N";
                }
            }
            this.sprite.play(Adventurous.Constants.ANIM_IDLE+this.dirAnim);
        }
    },
    
    getFacing: function()
    {
        var facing = "";
        if(this.dirAnim != null && this.dirAnim != "")
        {
            facing = this.dirAnim;
        }
        else
        {
            var anim = this.sprite.animations.currentAnim.name;
            if(anim != null && anim.length > 0)
            {
                switch(anim[anim.length-1]) {
                    case 'N':
                    case 'S':
                    case 'E':
                    case 'W':
                        facing = anim[anim.length-1];
                        break;
                    default:
                        facing = "";
                } 
            }
        }
        return facing;
    },
    
    nextWaypoint: function()
    {
        if(this.waypoints.length > 0)
        {
            this.moveTo(this.waypoints[0]);
            this.waypoints.splice(0,1);
        }
        else
        {
            if(this.automateWalkAnimation)
            {
                this.sprite.animations.play(Adventurous.Constants.ANIM_IDLE+this.getFacing());
            }
            else
            {
                this.automateWalkAnimation = true;
            }
        }
    },
    
    getTileX: function()
    {
        return Math.floor(this.sprite.x / Adventurous.Constants.TILE_SIZE);
    },
    
    getTileY: function()
    {
        return Math.floor(this.sprite.y / Adventurous.Constants.TILE_SIZE);
    },
    
    setScale: function(scale)
    {
        if(scale != this.sprite.scale.x)
        {
            var ratio = scale / this.sprite.scale.x;
            this.sprite.body.velocity.x *= ratio;
            this.sprite.body.velocity.y *= ratio;
        }
        
        this.sprite.scale.x = scale;
        this.sprite.scale.y = scale;
        
        this.moveSpeed = this.CURRENT_MOVE_SPEED * scale;
    },
    
    //"createInventoryIcon" is called by Game state after all objects and labels are added to the screen
    //(so the icons will be in the foreground of the game)
    createInventoryIcon: function(iconGroup)
    {
        if(this.isInventoryItem)
        {
            this.icon = game.add.sprite(0,0,this.imageName+"_inv");
            game.physics.enable(this.icon, Phaser.Physics.ARCADE, true);
            this.icon.visible = false;
        }
        else
        {
            this.icon = null;
        }
    },
    
    createLabel: function()
    {
         this.label = game.add.group();
         this.label.add(game.add.text(Adventurous.Constants.LABEL_SHADOW_OFFSET_X, Adventurous.Constants.LABEL_SHADOW_OFFSET_Y,
                                      this.getDisplayName(), Adventurous.Constants.LABEL_SHADOW_STYLE));
         this.label.add(game.add.text(0, 0, this.getDisplayName(), Adventurous.Constants.LABEL_STYLE));
         this.label.getAt(0).anchor.x = 0;
         this.label.getAt(1).anchor.x = 0;
         this.label.visible = false;
        
        if(this.dialogueLabelColor != null)
        {
            var labelStyle = { font: "17px AdventurousFont", fill: this.dialogueLabelColor, align: "center" };
            var labelShadowStyle = { font: "17px AdventurousFont", fill: this.dialogueLabelShadowColor, align: "center" };
            this.dialogueLabel = game.add.group();
            this.dialogueLabel.add(game.add.text(Adventurous.Constants.LABEL_SHADOW_OFFSET_X, Adventurous.Constants.LABEL_SHADOW_OFFSET_Y,
                                         "", labelShadowStyle));
            this.dialogueLabel.add(game.add.text(0, 0, "", labelStyle));
            this.dialogueLabel.getAt(0).anchor.x = 0;
            this.dialogueLabel.getAt(1).anchor.x = 0;
            this.dialogueLabel.visible = false;
        }
        else
        {
            this.dialogueLabel = null;
        }
    },
    
    setLabelText: function(text,label)
    {
        if(label != null && label.length == 2 && text != label.getAt(0).text)
        {
            this.showLabelCountdown = 2;
            label.alpha = 0;
            label.getAt(0).setText(text);
            label.getAt(1).setText(text);
        }
    },
    
    setLabelUseText: function(withItem)
    {
        this.setLabelText(this.interactions.getUseText(withItem,this.getDisplayName()),this.label);
    },
    
    getNearestTile: function(tiles)
    {
        var nearestDistance = -1;
        var nearest = null;
        for(var i = 0; i < tiles.length; i++)
        {
            var dist = Phaser.Math.distance(this.getTileX(),this.getTileY(),tiles[i].x,tiles[i].y);
            if(nearest == null || dist < nearestDistance)
            {
                nearestDistance = dist;
                nearest = tiles[i];
            }
        }
        
        return nearest;
    },
    
    showLabel: function(label)
    {
        label.visible = true;
        this.positionLabel(label);
    },
    
    getDepth: function()
    {
        return game.world.children.indexOf(this.sprite);
    },
    
    readyToUseSomething: function()
    {
        return this.destination == null && this.destinationThing != null;
    },
    
    useThing: function(withItem)
    {
        if(!this.destinationThing.interactions.use(this,withItem))
        {
            //fallback for when no "I CANT USE THESE OBJECTS TOGETHER" dialogue exists
            this.say(Adventurous.speeches["default_no_use"]);
        }
        this.destinationThing = null;
    },
    
    say: function(speech,anim)
    {
        this.animBeforeTalking = this.sprite.animations.currentAnim.name;
        if(anim == null)
        {
            if(this.animBeforeTalking.indexOf("idle") == -1 && this.animBeforeTalking.indexOf("walk") == -1)
            {
                anim = this.animBeforeTalking+"Talk";
            }
            else
            {
                anim = "say"+this.getFacing();
            }
        }
        this.talking = true;
        this.currentSpeech = speech;
        if(this.dialogueLabel != null)
        {
            this.setLabelText('\"'+speech.text+'\"',this.dialogueLabel);
            this.showLabel(this.dialogueLabel);
        }
        else
        {
            this.setLabelText('\"'+speech.text+'\"',this.label);
            this.showLabel(this.label);
        }
        speech.audio.play('',0,Adventurous.options.soundVolume);
        this.talkTime = 0;
        this.dialogueTime = Adventurous.Util.calculateDialogueMinTime(speech.text);
        this.destinationThing = null;
        if(anim != null && this.sprite.animations.getAnimation(Adventurous.Constants.ANIM_IDLE+this.getFacing()) != null)
        {
            this.sprite.animations.play(anim);
        }
            
    },
    
    stopTalking: function()
    {
        this.talkTime = 0;
        if(this.currentSpeech)
        {
            this.currentSpeech.audio.stop();
        }
        this.talking = false;
        if(this.dialogueLabel != null)
        {
            this.dialogueLabel.visible = false;
            this.setLabelText("",this.dialogueLabel);
        }
        this.label.visible = false;
        this.setLabelText(this.getDisplayName(),this.label);
        this.sprite.animations.play(this.animBeforeTalking);
        this.animBeforeTalking = null;
    },
    
    getDisplayName: function()
    {
        if(this.alias != null && this.alias != "")
        {
            return this.alias;
        }
        else
        {
            return this.name;
        }
    },
    
    stopMoving: function(continueCustomAnimation)
    {
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        this.sprite.x = Phaser.Math.roundTo(this.sprite.x);
        this.sprite.y = Phaser.Math.roundTo(this.sprite.y);
        this.sprite.body.prev.x = this.sprite.body.x;
        this.sprite.body.prev.y = this.sprite.body.y;
        this.waypoints = null;
        this.destination = null;
        this.destinationThing = null;
        
        var anim = this.sprite.animations.currentAnim.name;
        if(continueCustomAnimation != true || anim.indexOf("walk") == 0 || anim.indexOf("idle") == 0)
        {
            if(this.sprite.animations.getAnimation(Adventurous.Constants.ANIM_IDLE+this.getFacing()))
            {
                this.sprite.animations.play(Adventurous.Constants.ANIM_IDLE+this.getFacing());
            }
            else
            {
                this.sprite.animations.play(Adventurous.Constants.ANIM_IDLE);
            }
        }
    },
    
    positionLabel: function(label)
    {
        var align = "center";
        var x = this.sprite.body.center.x-label.getAt(0).width/2;
        var y = this.sprite.body.y - label.getAt(0).height * 1.25;
        if(x < 5)
        {
            x = 5;
            align = "left";
        }
        else if(x > game.world.width-5-label.getAt(0).width)
        {
            x = game.world.width-5-label.getAt(0).width;
            align = "right";
        }
        
        if(y < label.getAt(0).height)
        {
            y = label.getAt(0).height;
        }
        
        x = Math.floor(x);
        y = Math.floor(y);
        
        label.getAt(0).align = align;
        label.getAt(1).align = align;
        label.x = x;
        label.y = y;
    },
    
    setPosition: function(x,y)
    {
        this.sprite.x = x;
        this.sprite.y = y;
        this.positionLabel(this.label);
        if(this.dialogueLabel != null)
        {
            this.positionLabel(this.dialogueLabel);
        }
    },
    
    freeze: function()
    {
        this.tempVelocityX = this.sprite.body.velocity.x;
        this.tempVelocityY = this.sprite.body.velocity.y;
        this.sprite.body.velocity.x = 0;
        this.sprite.body.prev.x = this.sprite.body.x;
        this.sprite.body.velocity.y = 0;
        this.sprite.body.prev.y = this.sprite.body.y;
        if(!this.talking)
        {
            this.label.visible = false;
            if(this.dialogueLabel != null)
            {
                this.dialogueLabel.visible = false;
            }
        }
        if(this.currentSpeech)
        {
            this.currentSpeech.audio.pause();
        }
        if(this.sprite.animations.currentAnim)
        {
            this.sprite.animations.paused = true;
        }
    },
    
    unfreeze: function()
    {
        this.sprite.body.velocity.x = this.tempVelocityX;
        this.sprite.body.velocity.y = this.tempVelocityY;
        if(this.currentSpeech)
        {
            this.currentSpeech.audio.resume();
        }
        if(this.sprite.animations.currentAnim)
        {
            this.sprite.animations.paused = false;
        }
    },
    
    hide: function()
    {
        this.hidden = true;
        this.sprite.alpha = 0;
    },
    
    show: function()
    {
        this.hidden = false;
        this.sprite.alpha = 1;
    },
    
    isVisible: function()
    {
        return this.sprite.alpha > 0;
    },
    
    isStandingIn: function(rect)
    {
        return !(this.loadFramesDelay > 0) && rect.contains(this.sprite.body.center.x,this.sprite.body.bottom);
    },
    
    refreshBitmapData: function()
    {
        this.oldFrame = this.sprite.frame;
        this.bitmapData.clear();
        this.bitmapData.draw(this.sprite);
        this.bitmapData.update();
    },
    
    startRoutine: function(routine)
    {
        if(this.routines[routine] != null)
        {
            this.activeRoutine = new Adventurous.Effects(this,this.routines[routine].effects,this.routines[routine].name,true,true);
        }
    },
    
    stopRoutine: function()
    {
        this.stopMoving();
        if(this.talking)
        {
            this.stopTalking();
        }
        this.activeRoutine = null;
    },
    
    updateScale: function ()
    {
        if(this.isScalable)
        {
            var tileObj = currentState.scene.map.getTile(this.getTileX(),this.getTileY());
            var tile = -1;
            if(tileObj != null)
            {
                tile = tileObj.index;
            }
            
            if(Adventurous.Constants.WALKABLE_TILES.indexOf(tile) != -1)
            {
                var scale = 1 - Adventurous.Constants.SCALE_STEP * Adventurous.Constants.WALKABLE_TILES.indexOf(tile);
                
                var topTileInScaleZone = this.getTileY();
                while(topTileInScaleZone > 0 && currentState.scene.map.getTile(this.getTileX(),topTileInScaleZone - 1).index == tile)
                {
                    topTileInScaleZone--;
                }
                
                var bottomTileInScaleZone = this.getTileY();
                while(bottomTileInScaleZone < currentState.scene.map.layers[0].height-1 && currentState.scene.map.getTile(this.getTileX(),bottomTileInScaleZone + 1).index == tile)
                {
                    bottomTileInScaleZone++;
                }
                
                var scaleZoneTop = topTileInScaleZone * Adventurous.Constants.TILE_SIZE;
                var scaleZoneBottom = (bottomTileInScaleZone + 1) * Adventurous.Constants.TILE_SIZE;
                var scaleZoneHeight = scaleZoneBottom - scaleZoneTop;
                var scaleZoneMiddle = scaleZoneTop+scaleZoneHeight/2;
                
                var fractionOfScaleZoneUpOrDown = (this.sprite.y - scaleZoneMiddle)/scaleZoneHeight;
                if(fractionOfScaleZoneUpOrDown < 0)
                {
                    var nextTileObj = currentState.scene.map.getTile(this.getTileX(),Math.max(topTileInScaleZone-1,0));
                    var nextTile = -1;
                    if(nextTileObj != null)
                    {
                        nextTile = nextTileObj.index;
                    }
                    if(Adventurous.Constants.WALKABLE_TILES.indexOf(nextTile) != -1)
                    {
                        var scaleSteps = (tile - nextTile);
                        scale = scale + scaleSteps * Math.abs(fractionOfScaleZoneUpOrDown) * Adventurous.Constants.SCALE_STEP;
                    }
                }
                else if(fractionOfScaleZoneUpOrDown > 0)
                {
                    var nextTileObj = currentState.scene.map.getTile(this.getTileX(),Math.min(bottomTileInScaleZone+1,currentState.scene.map.layers[0].height-1));
                    var nextTile = -1;
                    if(nextTileObj != null)
                    {
                        nextTile = nextTileObj.index;
                    }
                    if(Adventurous.Constants.WALKABLE_TILES.indexOf(nextTile) != -1)
                    {
                        var scaleSteps = (tile - nextTile);
                        scale = scale + scaleSteps * Math.abs(fractionOfScaleZoneUpOrDown) * Adventurous.Constants.SCALE_STEP;
                    }
                }
                
                this.setScale(scale);
            }
            else
            {
                this.setScale(1);
            }
        }   
    },
    
    toSaveObject: function()
    {
        var obj = {};
        obj.name = this.name;
        obj.alias = this.alias;
        obj.waypoints = this.waypoints;
        obj.destination = this.destination;
        if(this.destinationThing != null)
        {
            obj.destinationThing = this.destinationThing.name;
        }
        obj.talking = this.talking;
        obj.tempVelocityX = this.tempVelocityX;
        obj.tempVelocityY = this.tempVelocityY;
        obj.velocityX = this.sprite.body.velocity.x;
        obj.velocityY = this.sprite.body.velocity.y;
        var x = Math.floor(this.sprite.x);
        var y = Math.floor(this.sprite.y);
        if(this.sprite.width % 2 != 0)
        {
            x += 0.5;
        }
        obj.x = x;
        obj.y = y;
        obj.automateWalkAnimation = this.automateWalkAnimation;
        obj.alpha = this.sprite.alpha;
        obj.hidden = this.hidden;
        obj.hasBeenHidden = this.hasBeenHidden;
        obj.dirAnim = this.dirAnim;
        if(this.sprite.animations.currentAnim != null)
        {
            obj.anim = this.sprite.animations.currentAnim.name;
        }
        //TODO -- obj.activeRoutine = this.activeRoutine;
        return obj;
    },
    
    loadFromObject: function(obj)
    {
        this.alias = obj.alias;
        this.waypoints = obj.waypoints;
        this.destination = obj.destination;
        if(obj.destinationThing != null)
        {
            this.destinationThing = Adventurous.thingsMap[obj.destinationThing];
        }
        this.talking = obj.talking;
        this.tempVelocityX = obj.tempVelocityX;
        this.tempVelocityY = obj.tempVelocityY;
        this.sprite.body.velocity.x = obj.velocityX;
        this.sprite.body.velocity.y = obj.velocityY;
        this.sprite.x = obj.x;
        this.sprite.y = obj.y;
        this.loadFramesDelay = 2;
        this.automateWalkAnimation = obj.automateWalkAnimation;
        this.hidden = obj.hidden;
        this.hasBeenHidden = obj.hasBeenHidden;
        this.sprite.alpha = obj.alpha;
        this.dirAnim = obj.dirAnim;
        if(obj.anim != null)
        {
            this.sprite.animations.play(obj.anim);
        }
        //TODO -- this.activeRoutine = this.activeRoutine;
    },
    
    bringLabelsToTop: function()
    {
        if(this.label != null)
        {
            game.world.bringToTop(this.label);
        }
        if(this.dialogueLabel != null)
        {
            game.world.bringToTop(this.dialogueLabel);
        }
    }
};
