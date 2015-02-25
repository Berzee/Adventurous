Adventurous.TriggerArea = function(obj)
{
    this.name = obj.name;
    this.rect = new Phaser.Rectangle(parseInt(obj.x),parseInt(obj.y),parseInt(obj.w),parseInt(obj.h));
    this.overlapsPlayer = false;
    this.conditions = obj.conditions;
    this.interactions = Adventurous.interactions[this.name];
};

Adventurous.TriggerArea.prototype =
{
	update: function () //some parts sorta copied from Interactions.js
    {        
        if(currentState.activeEffects == null && Adventurous.Util.areConditionsMet(this.conditions))
        {
            for(var i = 0; i < this.interactions.withItem[""].interactions.length; i++)
            {
                var interactionSet = this.interactions.withItem[""].interactions[i];
                switch(interactionSet.when)
                {
                    case Adventurous.Constants.ON_ENTER:
                        if(this.playerJustEntered())
                        {
                            if(Adventurous.Util.areConditionsMet(interactionSet.conditions))
                            {
                                currentState.activeEffects = new Adventurous.Effects(currentState.player,interactionSet.effects,this.name);
                                currentState.cursor.hide();
                            }
                        }
                        break;
                        
                    case Adventurous.Constants.ON_EXIT:
                        if(this.playerJustExited())
                        {
                            if(Adventurous.Util.areConditionsMet(interactionSet.conditions))
                            {
                                currentState.activeEffects = new Adventurous.Effects(currentState.player,interactionSet.effects,this.name);
                                currentState.cursor.hide();
                            }
                        }
                        break;
                }
            }
        }
	},
    
    playerJustEntered: function()
    {
        if(!this.overlapsPlayer)
        {
            this.overlapsPlayer = currentState.player.isStandingIn(this.rect);
            return this.overlapsPlayer;
        }
        else
        {
            return false;
        }
    },
    
    playerJustExited: function()
    {
        if(this.overlapsPlayer)
        {
            this.overlapsPlayer = currentState.player.isStandingIn(this.rect);
            return !this.overlapsPlayer;
        }
        else
        {
            return false;
        }
    }
};
