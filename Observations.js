Adventurous.Observations = function (obj)
{
    if(obj != null)
    {
        this.list = obj.list;
        for(var i = 0; i < this.list.length; i++)
        {
            this.list[i].i = 0;
        }
    }
    else
    {
        this.list = new Array();
        this.list[0] = {};
        this.list[0].i = 0;
        this.list[0].speeches = ["default_observation"];
    }
};

Adventurous.Observations.prototype =
{ 
    next: function()
    {
        for(var i = 0; i < this.list.length; i++)
        {
            var observationSet = this.list[i];
            if(Adventurous.Util.areConditionsMet(observationSet.conditions))
            {
                var name = observationSet.speeches[observationSet.i];
                observationSet.i = (observationSet.i + 1) % observationSet.speeches.length;
                var speech = Adventurous.speeches[name];
                if(speech == null)
                {
                    console.log("ERROR: Adventurous.Observations.next() -- missing speech '"+name+"'");
                }
                return speech;
            }
        }
        return null;
    }
};
