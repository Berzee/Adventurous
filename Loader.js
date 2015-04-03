Adventurous.scenes = {};
Adventurous.thingsArray = new Array();
Adventurous.thingsMap = {};
Adventurous.conversations = {};
Adventurous.interactions = {};
Adventurous.observations = {};
Adventurous.combinations = {};
Adventurous.startingScene = "";

Adventurous.Loader =
{
    init: function(gameState)
    {    
        this.initSpeeches();
        this.initConversations();
        this.initInteractions();
        this.initObservations();
        this.initCombinations();
        this.initScenesAndThings();        
    },
    
    initSpeeches: function()
    {
        var speeches = JSON.parse(game.cache.getText('speeches'));                  
        for(var i = 0; i < speeches.list.length; i++)
        {
            var speech = speeches.list[i];
            if(speech.audio == null)
            {
                speech.audio = speech.name;
            }
            Adventurous.speeches[speech.name] = new Adventurous.Speech(speech.text,game.add.audio(speech.audio));
        }
    },
    
    initConversations: function()
    {
        var obj = JSON.parse(game.cache.getText('conversations'));
        var list = obj.list;
        for(var i = 0; i < list.length; i++)
        {
            Adventurous.conversations[list[i].name] = new Adventurous.Conversation(list[i],list[i].name);
        }
    },
    
    initInteractions: function()
    {
        var obj = JSON.parse(game.cache.getText('interactions'));
        var list = obj.list;
        for(var i = 0; i < list.length; i++)
        {
            Adventurous.interactions[list[i].name] = new Adventurous.Interactions(list[i]);
        }
    },
    
    initObservations: function()
    {
        var obj = JSON.parse(game.cache.getText('observations'));
        var list = obj.list;
        for(var i = 0; i < list.length; i++)
        {
            Adventurous.observations[list[i].name] = new Adventurous.Observations(list[i]);
        }
    },
    
    initCombinations: function()
    {
        var obj = JSON.parse(game.cache.getText('combinations'));
        var list = obj.list;
        for(var i = 0; i < list.length; i++)
        {
            var itemA = list[i].itemA;
            var itemB = list[i].itemB;
            var speech = list[i].speech;
            var result = list[i].result;
            if(Adventurous.combinations[itemA] == null)
            {
                Adventurous.combinations[itemA] = {};
            }
            if(Adventurous.combinations[itemB] == null)
            {
                Adventurous.combinations[itemB] = {};
            }
            Adventurous.combinations[itemA][itemB] = {};
            Adventurous.combinations[itemA][itemB].speech = speech;
            Adventurous.combinations[itemA][itemB].result = result;
            Adventurous.combinations[itemB][itemA] = {};
            Adventurous.combinations[itemB][itemA].speech = speech;
            Adventurous.combinations[itemB][itemA].result = result;
        }
    },
    
    initScenesAndThings: function()
    {
        var obj = JSON.parse(game.cache.getText('scenes'));
        var scenes = {};
        var things = {};
        var list = obj.list;
        for(var i = 0; i < list.length; i++)
        {
            Adventurous.scenes[list[i].name] = new Adventurous.Scene(list[i]);
        }
    }
}
