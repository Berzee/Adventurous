Adventurous.Interactions = function (obj,name)
{
    this.user = null;
    this.effects = null;
    this.effectIndex = null;
    this.withItem = {};
    
    if(obj != null)
    {
        this.name = obj.name;
        
        for(var i = 0; i < obj.list.length; i++)
        {
            var itemName = "";
            if(obj.list[i].withItem != null)
            {
                itemName = obj.list[i].withItem;
            }
            this.withItem[itemName] = obj.list[i];
        }
    }
    else
    {
        this.name = name;
    }
};

Adventurous.Interactions.prototype =
{
    update: function()
    {
        this.processEffects();
    },
    
    getUseText: function(withItem,targetName)
    {
        var verb = "Use";
        var preposition = "With";
        
        if(withItem != null && withItem.length > 0)
        {
            if(this.withItem[withItem] != null)
            {
                if(this.withItem[withItem].verb != null)
                {
                    verb = this.withItem[withItem].verb;
                }
                if(this.withItem[withItem].preposition != null)
                {
                    preposition = this.withItem[withItem].preposition;
                }
            }
            
            return verb + " " + withItem + " " + preposition + " " + targetName;
        }
        else
        {
            return targetName;
        }
    },
    
    use: function(user,withItem)
    {        
        if(withItem == null)
        {
            withItem = "";
        }
        
        if(this.withItem[withItem] != null)
        {
            var interactions = this.withItem[withItem].interactions;
            
            for(var i = 0; i < interactions.length; i++)
            {
                var interactionSet = interactions[i];
                if(Adventurous.Util.areConditionsMet(interactionSet.conditions))
                {
                    currentState.activeEffects = new Adventurous.Effects(user,interactionSet.effects,this.name);
                    return true;
                }
            }
        }
        return false;
    }
}
