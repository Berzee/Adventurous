Adventurous.Effects = function (user,effects,name,isRoutine,loop)
{
    this.user = user;
    this.name = name;
    this.effects = effects;
    this.isRoutine = isRoutine;
    this.loop = loop;
    this.start();
    if(!isRoutine)
    {
        currentState.cursor.hide();
    }
};

Adventurous.Effects.prototype =
{
    update: function()
    {
        this.processEffects();
    },
    
    start: function()
    {
        this.effectIndex = 0;
        this.applyEffect(this.effects[0]);
    },
    
    processEffects: function()
    {
        var effect = this.effects[this.effectIndex];
        if(this.effectIsFinished(effect))
        {
            if(this.effectIndex == this.effects.length - 1)
            {
                if(this.isRoutine)
                {
                    if(this.loop)
                    {
                        this.start();
                    }
                    else
                    {
                        this.user.activeRoutine = null;
                    }
                }
                else
                {
                    this.user = null;
                    this.effects = null;
                    currentState.activeEffects = null;
                    currentState.cursor.show();
                }
            }
            else
            {
                this.effectIndex++;
                this.applyEffect(this.effects[this.effectIndex]);
            }
        }
    },
    
    applyEffect: function(effect)
    {        
        switch(effect.type)
        {
            case Adventurous.Constants.ACTION_REMARK:
                this.assignTargetToEffect(effect,this.user);
                var speech = Adventurous.speeches[effect.speech];
                if(speech == null)
                {
                    console.log("ERROR: Adventurous.Interactions.applyEffects() -- missing speech '"+effect.speech+"'");
                }
                else
                {
                    var anim = null;
                    if(effect.animation != null)
                    {
                        anim = effect.animation;
                        if(effect.directional)
                        {
                            anim += effect.target.getFacing();
                        }
                    }
                    effect.target.say(speech,anim);
                }
                break;
                
            case Adventurous.Constants.ACTION_PICK_UP:
                if(effect.name != null)
                {
                    this.assignTargetToEffect(effect,Adventurous.thingsMap[effect.name]);
                }
                else
                {
                    this.assignTargetToEffect(effect,Adventurous.thingsMap[this.name]);
                }
                
                //Move item to Offstage
                var index = currentState.thingsGroup.getIndex(effect.target.sprite);
                if(index != -1)
                {
                    currentState.thingsGroup.removeChild(effect.target.sprite);
                }
                for(var key in Adventurous.scenes)
                {
                    var index = Adventurous.scenes[key].things.indexOf(effect.target);
                    if(index != -1)
                    {
                        Adventurous.scenes[key].things.splice(index,1);
                        break;
                    }
                }
                Adventurous.scenes[Adventurous.Constants.OFFSTAGE_SCENE].things[Adventurous.scenes[Adventurous.Constants.OFFSTAGE_SCENE].things.length] = effect.target;
                
                currentState.inventory.addItem(effect.target);
                break;
                
            case Adventurous.Constants.ACTION_DROP:
                if(effect.name != null)
                {
                    this.assignTargetToEffect(effect,Adventurous.thingsMap[effect.name]);
                }
                else
                {
                    this.assignTargetToEffect(effect,Adventurous.thingsMap[this.name]);
                }
                currentState.inventory.removeItem(effect.target);
                break;
                
            case Adventurous.Constants.ACTION_SOUND:
                effect.audioClip = game.add.audio(effect.name);
                effect.audioClip.volume = Adventurous.options.soundVolume;
                if(effect.loop != null)
                {
                    effect.audioClip.loop = effect.loop;
                }
                else
                {
                    effect.audioClip.loop = false;
                }
                effect.audioClip.play();
                break;
                
            case Adventurous.Constants.ACTION_MUSIC:
                if(effect.time == null)
                {
                    effect.time = 1000;
                }
                if(Adventurous.backgroundMusic != null)
                {
                    effect.startingVolume = Adventurous.backgroundMusic.volume;
                }
                break;
                
            case Adventurous.Constants.ACTION_HIDE:
                this.assignTargetToEffect(effect,this.user.destinationThing);
                effect.target.hide();
                effect.target.hasBeenHidden = true;
                break;
                
            case Adventurous.Constants.ACTION_SHOW:
                this.assignTargetToEffect(effect,this.user.destinationThing);
                effect.target.show();
                effect.target.hasBeenHidden = false;
                break;
                
            case Adventurous.Constants.ACTION_ANIMATE:
                this.assignTargetToEffect(effect,this.user.destinationThing);
                var anim = effect.animation;
                if(effect.directional)
                {
                    anim += effect.target.getFacing();
                }
                if(effect.target.sprite.animations._anims[anim] != null)
                {
                    effect.target.sprite.animations.play(anim,null);
                }
                else
                {
                    console.debug("ERROR: Interactions.applyEffect(effect) -- nonexistent animation name '" + anim + "' for Thing named '" + effect.target.name + "'.");
                }
                break;
                
            case Adventurous.Constants.ACTION_FACE:
                this.assignTargetToEffect(effect,this.user.destinationThing);
                if(effect.dir != null)
                {
                    effect.target.dirAnim = effect.dir;
                }
                else if(effect.thing != null)
                {
                    effect.target.face(Adventurous.thingsMap[effect.thing]);
                }
                if(effect.target.sprite.animations._anims["idle"+effect.dir] != null)
                {
                    effect.target.sprite.animations.play("idle"+effect.dir,null);
                }
                else
                {
                    console.debug("ERROR: Interactions.applyEffect(effect) -- no directional idle animation for Thing named '" + effect.target.name + "'.");
                }
                break;
                
            case Adventurous.Constants.ACTION_WAIT:
                effect.timer = parseFloat(effect.time);
                break;
                
            case Adventurous.Constants.ACTION_STOP:
                this.assignTargetToEffect(effect,null);
                effect.target.stopMoving();
                break;
                
            case Adventurous.Constants.ACTION_SET_ALIAS:
                this.assignTargetToEffect(effect,null);
                effect.target.alias = effect.alias;
                break;
                
            case Adventurous.Constants.ACTION_SCENE:
                currentState.switchToScene(effect.scene,effect.entrance);
                break;
                
            case Adventurous.Constants.ACTION_FADEOUT:
                this.assignTargetToEffect(effect,this.user.destinationThing);
                effect.target.show();
                effect.target.sprite.alpha = 1;
                effect.target.hasBeenHidden = true;
                break;
                
            case Adventurous.Constants.ACTION_FADEIN:
                this.assignTargetToEffect(effect,this.user.destinationThing);
                effect.target.show();
                effect.target.sprite.alpha = 0;
                break;
                
            case Adventurous.Constants.ACTION_TALK:
                if(effect.name != null)
                {
                    currentState.conversationToStart = effect.name;
                }
                else
                {
                    currentState.conversationToStart = this.name;
                }
                break;
                
            case Adventurous.Constants.ACTION_WALK:
                this.assignTargetToEffect(effect,null);
                if(effect.target != null)
                {
                    var tileClicked = currentState.scene.map.getTileWorldXY(effect.x,effect.y,Adventurous.Constants.TILE_SIZE,Adventurous.Constants.TILE_SIZE);
                        
                    if(Adventurous.Constants.WALKABLE_TILES.indexOf(tileClicked.index) != -1)
                    {
                        var path = currentState.scene.findPath(effect.target,effect.x,effect.y);
                        if(effect.speed != null)
                        {
                            effect.target.CURRENT_MOVE_SPEED = effect.speed;
                            effect.target.moveSpeed = effect.target.CURRENT_MOVE_SPEED * effect.target.sprite.scale.x;
                        }
                        effect.target.followPath(path,null);
                    }
                }
                break;
                
            case Adventurous.Constants.ACTION_MOVE:
                this.assignTargetToEffect(effect,null);
                if(effect.target != null)
                {
                    var path = [];
                    path[0] = new Phaser.Point(effect.target.sprite.x,effect.target.sprite.y);
                    path[1] = new Phaser.Point(effect.x,effect.y);
                    effect.target.automateWalkAnimation = false;
                    if(effect.speed != null)
                    {
                        effect.target.CURRENT_MOVE_SPEED = effect.speed;
                        effect.target.moveSpeed = effect.target.CURRENT_MOVE_SPEED * effect.target.sprite.scale.x;
                    }
                    effect.target.followPath(path,null);
                }
                break;
                
            case Adventurous.Constants.ACTION_RELOCATE:
                this.assignTargetToEffect(effect,this.user.destinationThing);
                if(effect.target != null)
                {
                    if(effect.scene != null)
                    {
                        for(var key in Adventurous.scenes)
                        {
                            var index = Adventurous.scenes[key].things.indexOf(effect.target);
                            if(index != -1)
                            {
                                Adventurous.scenes[key].things.splice(index,1);
                                break;
                            }
                        }
                        Adventurous.scenes[effect.scene].things[Adventurous.scenes[effect.scene].things.length] = effect.target;
                    }
                    
                    if(effect.x != null && effect.y != null)
                    {
                        effect.target.setPosition(effect.x,effect.y);
                    }
                    else if(effect.x != null)
                    {
                        effect.target.setPosition(effect.x,effect.target.sprite.y);
                    }
                    else if(effect.y != null)
                    {
                        effect.target.setPosition(effect.target.sprite.x,effect.y);
                    }
                }
                break;
                
                
            case Adventurous.Constants.ACTION_SET_FLAG:
                Adventurous.flags[effect.name] = effect.val;
                break;
                
            case Adventurous.Constants.ACTION_CONV_HIDE_CHOICE:
                if(currentState.currentConversation != null && currentState.currentConversation.latestChoice != null)
                {
                    currentState.currentConversation.latestChoice.hidden = true;
                    if(currentState.dialogueGroupStartIndex > 0)
                    {
                        currentState.dialogueUp();
                    }
                    else
                    {
                        currentState.updateDialogueOptions();
                    }
                }
                break;
            
            case Adventurous.Constants.ACTION_CONV_RESET_CHOICES:
                if(currentState.currentConversation != null)
                {
                    currentState.currentConversation.current.choices.forEach(function(choice)
                    {
                        choice.hidden = false;
                    });
                    currentState.updateDialogueOptions();
                }
                break;
                
            case Adventurous.Constants.ACTION_CONV_NODE:
                if(currentState.currentConversation != null)
                {
                    currentState.currentConversation.current = currentState.currentConversation.nodes[effect.name];
                    currentState.currentConversation.doDialogue();
                    if(currentState.currentConversation != null && currentState.currentConversation.current.choices != null)
                    {
                        currentState.updateDialogueOptions();
                    }
                }
                break;
                
            case Adventurous.Constants.ACTION_STOP_ROUTINE:
                this.assignTargetToEffect(effect,null);
                if(effect.target != null)
                {
                    effect.target.stopRoutine();
                }
                break;
                
            case Adventurous.Constants.ACTION_START_ROUTINE:
                this.assignTargetToEffect(effect,null);
                if(effect.target != null)
                {
                    effect.target.startRoutine(effect.routine);
                }
                break;
            
            case Adventurous.Constants.ACTION_CONV_QUIT:
                currentState.endConversation();
                break;
                
            case Adventurous.Constants.ACTION_MAIN_MENU:
                game.state.start('MainMenu');
                break;
        }
    },
    
    assignTargetToEffect: function(effect,defaultTarget)
    {
        if(effect.name != null && Adventurous.thingsMap[effect.name] != null)
        {
            effect.target = Adventurous.thingsMap[effect.name];
        }
        else
        {
            effect.target = defaultTarget;
        }
        
        if(this.user != effect.target)
        {
            if(effect.target.activeRoutine != null)
            {
                effect.target.stopRoutine();
            }
        }
        
        return effect.target;
    },
    
    effectIsFinished: function(effect)
    {
        if((effect.wait != false) || effect.type == Adventurous.Constants.ACTION_WAIT)
        {
            switch(effect.type)
            {
                case Adventurous.Constants.ACTION_REMARK:
                    return !effect.target.talking;
                    break;
                    
                case Adventurous.Constants.ACTION_ANIMATE:
                    if(effect.directional != true && effect.target.sprite.animations._anims[effect.animation] == null)
                    {
                        return true; //immediately declare nonexistent animations "finished"
                    }
                    else if(effect.directional && effect.target.sprite.animations._anims[effect.animation+effect.target.getFacing()] == null)
                    {
                        return true;
                    }
                    else
                    {
                        return effect.target.sprite.animations.currentAnim.loop || effect.target.sprite.animations.currentAnim.isFinished;
                    }
                    break;
                    
                case Adventurous.Constants.ACTION_WAIT:
                    effect.timer -= currentState.time.elapsed;
                    return effect.timer <= 0;
                    break;
                    
                case Adventurous.Constants.ACTION_WALK:
                    if(effect.target.destination == null)
                    {
                        effect.target.CURRENT_MOVE_SPEED = effect.target.MOVE_SPEED;
                        effect.target.moveSpeed = effect.target.CURRENT_MOVE_SPEED * effect.target.sprite.scale.x;
                    }
                    return effect.target.destination == null;
                    break;
                    
                case Adventurous.Constants.ACTION_MOVE:
                    if(effect.target.destination == null)
                    {
                        effect.target.CURRENT_MOVE_SPEED = effect.target.MOVE_SPEED;
                        effect.target.moveSpeed = effect.target.CURRENT_MOVE_SPEED * effect.target.sprite.scale.x;
                    }
                    return effect.target.destination == null;
                    break;
                    
                case Adventurous.Constants.ACTION_FADEOUT:
                    effect.target.sprite.alpha -= currentState.time.elapsed/effect.time;
                    if(effect.target.sprite.alpha <= 0)
                    {
                        effect.target.sprite.alpha = 0;
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                    break;
                    
                case Adventurous.Constants.ACTION_FADEIN:
                    effect.target.sprite.alpha += currentState.time.elapsed/effect.time;
                    if(effect.target.sprite.alpha >= 1)
                    {
                        effect.target.sprite.alpha = 1;
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                    break;
                    
                case Adventurous.Constants.ACTION_SOUND:
                    if(effect.audioClip.loop != true)
                    {
                        return !effect.audioClip.isPlaying;
                    }
                    else
                    {
                        return true;
                    }
                    break;
                    
                case Adventurous.Constants.ACTION_MUSIC:
                    if(Adventurous.backgroundMusic == null)
                    {
                        Adventurous.backgroundMusic = game.add.audio(effect.name);
                        Adventurous.backgroundMusic.volume = Adventurous.options.musicVolume;
                        Adventurous.backgroundMusic.loop = true;
                        Adventurous.backgroundMusic.play();
                        return true;
                    }
                    else if(Adventurous.backgroundMusic.name == effect.name)
                    {
                        return true;
                    }
                    else
                    {
                        Adventurous.backgroundMusic.volume -= effect.startingVolume * (currentState.time.elapsed / effect.time);
                        if(Adventurous.backgroundMusic.volume <= 0)
                        {
                            Adventurous.backgroundMusic.stop();
                            Adventurous.backgroundMusic = game.add.audio(effect.name);
                            Adventurous.backgroundMusic.volume = Adventurous.options.musicVolume;
                            Adventurous.backgroundMusic.loop = true;
                            Adventurous.backgroundMusic.play();
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                    break;
                    
                default:
                    return true;
                    break;
            }
        }
        else
        {
            return true;
        }
    }
}