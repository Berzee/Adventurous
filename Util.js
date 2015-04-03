Adventurous.Util =
{
    areConditionsMet: function(conditions)
    {
        if(conditions)
        {
            for(var i = 0; i < conditions.length; i++)
            {
                if(!this.isConditionMet(conditions[i]))
                {
                    return false;
                }
            }
        }
        return true;
    },
    
    isConditionMet: function(condition)
    {
        switch(condition.type)
        {
                case 'flagTrue':
                    return (Adventurous.flags[condition.name] == true);
                    break;
                
                case 'flagFalse':
                    return(Adventurous.flags[condition.name] != true);
                    break;
                
                case 'hasNotItem':
                    return (!currentState.inventory.hasItem(condition.name));
                    break;
                
                case 'hasItem':
                    return (currentState.inventory.hasItem(condition.name));
                    break;
        }
    },
    
    isMouseOverObject: function(obj)
    {
        return (game.input.mousePointer.x >= obj.x-obj.width*obj.anchor.x && game.input.mousePointer.x <= obj.x + obj.width - obj.width*obj.anchor.x &&
                game.input.mousePointer.y >= obj.y && game.input.mousePointer.y <= obj.y + obj.height);
    },
    
    calculateDialogueMinTime: function(text)
    {
        var multiplier = Adventurous.options.textSpeed + 0.5;
        var wpm = multiplier * Adventurous.Constants.DIALOGUE_DEFAULT_WPM;
        if(text == null)
        {
            return 0;
        }
        else
        {
            return Math.max(text.split(" ").length * 60 * 1000 / wpm,Adventurous.Constants.DIALOGUE_MIN_TIME);
        }
    },
    
    save: function(name)
    {
        var savegame = {};
        savegame.flags = Adventurous.flags;
        savegame.options = Adventurous.options;
        savegame.data = currentState.toSaveObject();
        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        var date = new Date();
        var timestamp = days[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if(minutes < 10)
        {
            minutes = "0" + minutes;
        }
        var ampm = "am";
        if(hours > 11)
        {
            ampm = "pm";
        }
        if(date.getHours() > 12)
        {
            hours -= 12;
        }
        timestamp += "\n" + hours + ":" + minutes + ampm;
        
        savegame.timestamp = timestamp;
        
        if(Adventurous.backgroundMusic != null)
        {
            savegame.backgroundMusic = Adventurous.backgroundMusic.name;
        }
        
        var storage = localStorage.getItem(Adventurous.Constants.LOCALSTORAGE_KEY);
        if(storage == null)
        {
            storage = {};
            storage.saves = {};
            storage.options = {};
        }
        else
        {
            storage = JSON.parse(storage);
        }
        
        storage.saves[name] = savegame;
        
        localStorage.setItem(Adventurous.Constants.LOCALSTORAGE_KEY,JSON.stringify(storage));
    },
    
    load: function(name)
    {
        var storage = localStorage.getItem(Adventurous.Constants.LOCALSTORAGE_KEY);
        if(storage != null)
        {
            storage = JSON.parse(storage);
            if(storage != null && storage.saves != null && storage.saves[name] != null)
            {
                var savegame = storage.saves[name];
                if(savegame.backgroundMusic != null)
                {
                    if(Adventurous.backgroundMusic == null || Adventurous.backgroundMusic.name != savegame.backgroundMusic)
                    {
                        if(Adventurous.backgroundMusic != null)
                        {
                            Adventurous.backgroundMusic.stop();
                        }
                        Adventurous.backgroundMusic = game.add.audio(savegame.backgroundMusic);
                        Adventurous.backgroundMusic.volume = Adventurous.options.musicVolume;
                        Adventurous.backgroundMusic.loop = true;
                        Adventurous.backgroundMusic.play();   
                    }
                }
                currentState.loadFromObject(savegame);
            }
        }    
    }
}
