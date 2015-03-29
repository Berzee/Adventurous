Adventurous.Constants =
{
    GAME_NAME: "The Secret of Gargoyle Manor",
    LOCALSTORAGE_KEY: "Adventurous_The Secret of Gargoyle Manor_localStorage",
    HAS_VOICE: true,
    
    MAIN_MENU_MUSIC: "goblinking",
    MENU_BUTTON_SOUND: "button",
    
    TILE_SIZE : 16,
    INVERSE_TILE_SIZE : 1/16,
    
    WALKABLE_TILES : [2], //1-indexed
    SCALE_STEP : 0.1,
    
    DEFAULT_MOVE_SPEED : 125,
    
    LABEL_STYLE : { font: "17px AdventurousFont", fill: "#ffffee", align: "center" },
    LABEL_SHADOW_STYLE : { font: "17px AdventurousFont", fill: "#000011", align: "center" },
    LABEL_SHADOW_OFFSET_X : 1,
    LABEL_SHADOW_OFFSET_Y : 1,
    DIALOGUE_LABEL_STYLE : { font: "17px AdventurousFont", fill: "#ffffee", align: "left", wordWrapWidth: 600, wordWrap: true },
    SELECTED_DIALOGUE_LABEL_STYLE : { font: "17px AdventurousFont", fill: "#ffff77", align: "left", wordWrapWidth: 600, wordWrap: true  },
    DISABLED_LABEL_STYLE : { font: "17px AdventurousFont", fill: "#dddddd", align: "left", wordWrapWidth: 600, wordWrap: true },
    MAIN_MENU_LABEL_STYLE : { font: "17px AdventurousFont", fill: "#000000", align: "left", wordWrapWidth: 600, wordWrap: true },
    SELECTED_MAIN_MENU_LABEL_STYLE : { font: "17px AdventurousFont", fill: "#F6F699", align: "left", wordWrapWidth: 600, wordWrap: true  },
    LINE_HEIGHT: 25,
    
    LMB : 0,
    MMB : 1,
    RMB : 2,
    
    PLAYER_NAME: "player",
    DIALOGUE_BACKGROUND_IMAGE_NAME: "dialogue_background",
    INVENTORY_BACKGROUND_IMAGE_NAME: "inventory_background",
    INVENTORY_PADDING: 65, //space between edge of inventory background image and start of item grid
    
    INVENTORY_MARGIN: 30, //how close to edge of inventory background image you must drag an item before the inventory closes
                          //(useful if your inventory background image has a partially transparent "dimmer" strip around the edge)
    
    TITLE_IMAGE_NAME: "title_background",
    
    DIALOGUE_BACKGROUND_OPACITY: 0.9,
    
    ACTION_TALK : "Talk",
    ACTION_REMARK : "Remark",
    ACTION_PICK_UP : "Pickup",
    ACTION_STOP : "Stop",
    ACTION_SOUND : "Sound",
    ACTION_MUSIC : "Music",
    ACTION_SET_ALIAS : "Alias",
    ACTION_DROP : "Drop",
    ACTION_HIDE : "Hide",
    ACTION_SHOW : "Show",
    ACTION_ANIMATE: "Animate",
    ACTION_WAIT: "Wait",
    ACTION_SCENE: "Scene",
    ACTION_WALK: "Walk",
    ACTION_MOVE: "Move",
    ACTION_FACE: "Face",
    ACTION_RELOCATE: "Relocate",
    ACTION_STOP_ROUTINE: "StopRoutine",
    ACTION_START_ROUTINE: "StartRoutine",
    ACTION_SET_FLAG: "setFlag",
    ACTION_FADEOUT : "Fade Out",
    ACTION_FADEIN : "Fade In",
    ACTION_MAIN_MENU : "MainMenu",
    ACTION_CONV_HIDE_CHOICE: "conv_hideChoice",
    ACTION_CONV_RESET_CHOICES: "conv_resetChoices",
    ACTION_CONV_QUIT: "conv_quit",
    ACTION_CONV_NODE: "conv_node",
    //TODO -- an action to relocate an item to a new location and/or new scene
    
    OFFSTAGE_SCENE: "<offstage>",
    
    ON_ENTER: "Enter",
    ON_EXIT: "Exit",
    
    ANIM_IDLE: "idle",
    
    INVENTORY_ITEM_SIZE : 75,
    
    DIALOGUE_DEFAULT_WPM : 120,
    DIALOGUE_MIN_TIME : 2000,
    
    PAUSE_MENU_FIRST_ITEM_Y_POS: 60,
    PAUSE_MENU_LINE_HEIGHT: 60,
    MAIN_MENU_FIRST_ITEM_Y_POS: 210,
    MAIN_MENU_LINE_HEIGHT: 60,
    PAUSE_MENU_WIDTH: 256,
    BROWSER_LABEL_Y_OFFSET: 0
}