Adventurous.Conversation = function (obj,name)
{
    this.name = name;
    this.parent = null;
    this.nodes = {};
    for(var i = 0; i < obj.nodes.length; i++)
    {
        this.nodes[obj.nodes[i].name] = obj.nodes[i].conversation;
        this.addParentReferences(obj.nodes[i].conversation);
    }
    this.root = this.nodes.start;
    this.current = this.nodes.start;
    this.latestChoice = null;
};

Adventurous.Conversation.prototype =
{ 
    //recursive function to give each "conversation" sub-object a reference to its parent conversation
    addParentReferences: function(obj)
    {
        if(obj.choices != null)
        {
            for(var i = 0; i < obj.choices.length; i++)
            {
                var choice = obj.choices[i];
                if(choice.conversation != null)
                {
                    choice.conversation.parent = obj;
                    this.addParentReferences(choice.conversation);
                }
            }
        }
    },
    
    choose: function(index)
    {
        if(this.current.choices != null && this.current.choices.length > index)
        {
            currentState.dialogueGroup.visible = false;
            this.latestChoice = this.getChoice(index);
            this.current = this.latestChoice.conversation;
        }
        else
        {
            console.debug("ERROR: Adventurous.Conversation.choose(index) -- index out of range");
        }
    },
    
    doDialogue: function()
    {
        if(this.current.dialogues != null)
        {
            for(var i = 0; i < this.current.dialogues.length; i++)
            {
                var dialogue = this.current.dialogues[i];
                
                if(Adventurous.Util.areConditionsMet(dialogue.conditions))
                {
                    currentState.activeEffects = new Adventurous.Effects(currentState.player,dialogue.effects,this.name);
                    break;
                }
            }
        }
        else
        {
            
        }
    },
    
    getChoices: function() //get all choices that aren't hidden
    {
        var choices = new Array();
        
        if(this.current.choices == null)
        {
            this.current = this.current.parent;
        }
        
        for(var i = 0; i < this.current.choices.length; i++)
        {
            var choice = this.current.choices[i];
            
            if(choice.hidden != true)
            {
                if(Adventurous.Util.areConditionsMet(choice.conditions))
                {
                    choices[choices.length] = this.current.choices[i];
                }
            }
        }
        
        return choices;
    },
    
    getChoice: function(index) //get index-th choice, ignoring hidden choices
    {
        var choices = this.getChoices();
        if(index < choices.length)
        {
            return choices[index];
        }
        else
        {
            console.debug("ERROR: Adventurous.Conversation.getChoice(index) -- index out of range");
            return null;
        }
    },
    
    quit: function()
    {
        this.current = this.root;
    }
};