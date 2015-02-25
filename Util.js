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
    
    isMouseOverLabel: function(label)
    {
        return (game.input.mousePointer.x >= label.x-label.width*label.anchor.x && game.input.mousePointer.x <= label.x + label.width - label.width*label.anchor.x &&
                game.input.mousePointer.y >= label.y && game.input.mousePointer.y <= label.y + label.height);
    },
    
    save: function(name)
    {
        var savegame = {};
        savegame.flags = Adventurous.flags;
        savegame.data = currentState.toSaveObject();
        
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
                currentState.loadFromObject(savegame);
            }
        }    
    }
}