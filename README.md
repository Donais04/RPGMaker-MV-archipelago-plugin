# Hi and welcome to the RPGMaker MV archipelago plugin!!


## general setup



Make sure that you have archipelago.js (https://archipelago.js.org/stable/) as well (should go in your libs folder instead of plugins), along with archipelago-global-export.js.

If things are breaking, try updating your Node.js inside of RPGMaker: https://itch.io/blog/484532/how-to-update-nwjs-in-rpg-maker-mv-for-rpg-devs



## specific setup


### connection
For setting up players to be able to input the archipelago link and name, use NameInputProcess then set the variables defined in URLVarID, codeVarID, and slotVarID to the names

### item checks
The current way item checks are handled is the following:
Armors are IDs 0-1000, if you get a check within that range, it will try and give it as armor with that ID value. For example, if you get a check of ID 14, this will attempt to give armor 0014.

Weapons are the same way, but stored 1000-2000. This code will discard that thousands place. So if you get check 1030, this code will give weapon 0030

Items are 2000-3000 in the same way. This code will only give one item at a time. Modify it if you want something else.

Next is switches from 3000-4000. If you get a check 3345, this code will set switch 345 to true. For this one, if you want in player to see what they got, you need to modify switchName. these names are what will be pushed to variable itemListVarID, which will be used in game to say the obtained item.

Lastly is skills from 4000-5000. If you want to include skills as checks, you'll need to modify get_actor_id_skill to ensure that the correct actor is getting the skill you want. So, for example, if you get check 4015, this code will look through get_actor_id_skill to see which actor skill 15 corrosponds to. Then it will give that actor skill 15.

I also have check 3000 specifically as a randomItemGet. This is for all my junk checks. feel free to modify that as you wish. Go to around line 205 and 431 for that.

If you want an event as a check, just set it to autorun on a switch, and have the switch be a check. And if you want an enemy trap as a check... idk. Make it an event and see above?

### display in game
set up your item get event to display the name in stored in variable itemListVarID.
have it autorun when runItemGetSwitchID is on
Have it play once for each item in itemListVarID, .shift()-ing it after
then have it flip off runItemGetSwitchID once itemListVarID() has run out
same for item send

### get a check
to gain an item in game, simply run gain('item name');

### in game initialization
when initializing, first run Rando.openApClient(). Then you'll need to wait a moment for the server to connect. I wait 5 seconds but you can probably get away with less. Then run the following in game:
```javascript
client.scout(client.room.allLocations).then((result) => {
  $gamePlayer.locationsRaw = Object.assign(result);
});
```
wait 120 frames
```javascript
Rando.initializeLocationScout();
```
