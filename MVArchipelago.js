// Hi and welcome to the RPGMaker MV archipelago plugin!!




// general setup



// Make sure that you have archipelago.js (https://archipelago.js.org/stable/) as well (should go in your libs folder instead of plugins), 
// along with archipelago-global-export.js. If you can't find this one, here it is in one line. Save it as archipelago-global-export.js in your libs folder: import {     targetVersion,     slotTypes,     permissions,     libraryVersion,     itemsHandlingFlags,     itemClassifications,     defaultConnectionOptions,     defaultClientOptions,     clientStatuses,     UnauthenticatedError,     TextualMessageNode,     SocketManager,     SocketError,     RoomStateManager,     PlayersManager,     PlayerMessageNode,     Player,     PackageMetadata,     MessageManager,     LoginError,     LocationMessageNode,     ItemsManager,     ItemMessageNode,     Item,     IntermediateDataOperation,     Hint,     EventBasedManager,     DeathLinkManager,     DataStorageManager,     DataPackageManager,     ColorMessageNode,     Client,     BaseMessageNode,     ArgumentError,     API } from "./archipelago.js";window.ArchipelagoModules = {    Client: Client,    SocketManager: SocketManager,    DataPackageManager: DataPackageManager,    DataStorageManager: DataStorageManager,    RoomStateManager: RoomStateManager,    PlayersManager: PlayersManager,    ItemsManager: ItemsManager,    MessageManager: MessageManager,    DeathLinkManager: DeathLinkManager,    EventBasedManager: EventBasedManager,    Item: Item,    Hint: Hint,    Player: Player,    PackageMetadata: PackageMetadata,    IntermediateDataOperation: IntermediateDataOperation,    API: API,    slotTypes: slotTypes,    permissions: permissions,    itemsHandlingFlags: itemsHandlingFlags,    itemClassifications: itemClassifications,    clientStatuses: clientStatuses,    targetVersion: targetVersion,    libraryVersion: libraryVersion,    defaultClientOptions: defaultClientOptions,    defaultConnectionOptions: defaultConnectionOptions,    BaseMessageNode: BaseMessageNode,    ItemMessageNode: ItemMessageNode,    LocationMessageNode: LocationMessageNode,    ColorMessageNode: ColorMessageNode,    PlayerMessageNode: PlayerMessageNode,    TextualMessageNode: TextualMessageNode,    ArgumentError: ArgumentError,    LoginError: LoginError,    SocketError: SocketError,    UnauthenticatedError: UnauthenticatedError};

// If things are breaking, try updating your Node.js inside of RPGMaker: https://itch.io/blog/484532/how-to-update-nwjs-in-rpg-maker-mv-for-rpg-devs



// specific setup



// For setting up players to be able to input the archipelago link and name,
// use NameInputProcess then set the variables defined in URLVarID, codeVarID, and slotVarID to the names

// The current way item checks are handled is the following:
// Armors are IDs 0-1000, if you get a check within that range, it will try and give it as armor with that ID value.
// for example, if you get a check of ID 14, this will attempt to give armor 0014.
// Weapons are the same way, but stored 1000-2000. This code will discard that thousands place.
// so if you get check 1030, this code will give weapon 0030
// Items are 2000-3000 in the same way. 
// This code will only give one item at a time. Modify it if you want something else.
// Next is switches from 3000-4000. 
// If you get a check 3345, this code will set switch 345 to true.
// For this one, if you want in game to see what happened, you need to modify switchName.
// these names are what will be pushed to variable itemListVarID, which will be used in game to say the obtained item.
// Lastly is skills from 4000-5000.
// If you want to include skills as checks, you'll need to modify get_actor_id_skill to ensure that 
// the correct actor is getting the skill you want.
// so, for example, if you get check 4015, this code will look through get_actor_id_skill to see
// which actor skill 15 corrosponds to. Then it will give that actor skill 15
// I also have check 3000 specifically as a randomItemGet. This is for all my junk checks
// feel free to modify that as you wish. Go to around line 205 and 431 for that.

// If you want an event as a check, just set it to autorun on a switch, and have the switch be a check
// and if you want an enemy trap as a check... idk. Make it an event and see above?

// set up your item get event to display the name in stored in variable itemListVarID.
// have it autorun when runItemGetSwitchID is on
// Have it play once for each item in itemListVarID, .shift()-ing it after
// then have it flip off runItemGetSwitchID once itemListVarID() has run out
// same for item send

// to gain an item in game, simply run gain('item name');

// when initializing, first run Rando.openApClient()
// then you'll need to wait a moment for the server to connect. I wait 5 seconds but you can probably get away with less
// then run the following in game:
//   client.scout(client.room.allLocations).then((result) => {$gamePlayer.locationsRaw = Object.assign(result);});
//   wait 120 frames
//   Rando.initializeLocationScout();




const gameName = "In Stars and Time";
const URLVarID = 434; //archipelago URL variable ID
const codeVarID = 419; //archipelago 5 digits variable ID
const slotVarID = 420; //archipelago slot name variable ID
const itemGetEventID = 315; //display item name in game
const itemSendEventID = 316; //display item name in game
const itemListVarID = 421; //incoming item names are pushed to this vairable to display in game
const sendListVarID = 435; //outgoing item names are pushed to this vairable to display in game
const runItemGetSwitchID = 352; //if this switch is flipped, autorun event itemGetEventID.
const runItemSendSwitchID = 353; //same

switchName = { //if you want a check to flip a switch, put it in here
	362: "OpenPhrase123",
	363: "stostorage roomoom",
	364: "Tutorial Kid potions 1",
	365: "f1 armory potions",
	366: "f1 storage room potions 1",
	367: "f1 storage room potions 2",
	368: "f1 candle dorm potions",
	369: "f1 kitchen potions 1",
	370: "f1 kitchen potions 2",
	371: "f1 break room potions 1",
	372: "f1 break room potions 2",
	373: "f2 classroom potions",
	374: "f2 library potions",
	375: "f2 gardening room potions",
	376: "f2 infirmary room potions",
	377: "f3 break room potions",
	378: "f3 change room potions 1",
	379: "f3 change room potions 2",
	380: "f3 pottery room potions 1",
	381: "f3 pottery room potions 2",
	382: "f3 writing room potions",
	383: "f3 Mirabelle's dorm potions",
	384: "Miraquest",
	385: "Bonniequest",
	386: "Odilequest",
	387: "Isaquest",
	388: "f3 secret room potions",
	389: "Change openphrase",
	390: "Renewable Loving Fanmail",
	391: "Renewable Long Thingy-Thing",
	392: "Renewable Short Gizmo-Gadget",
	393: "Renewable Secret Ingredient",
	394: "Renewable Bonding Earring",
	395: "Renewable Shiny Piece of Glass",
	396: "Renewable Bright Flower",
	397: "Tutorial Kid potions 2",
	398: "f2 break room potions 1",
	399: "f2 break room potions 2"
}

get_actor_id_skill = function(id){ //if you want skills to be checks
	if ((id < 21 && id > 9) ||(id < 158 && id > 154)){
		return 1;
	} else if (id < 31){
		return 2;
	} else if (id < 41){
		return 3;
	} else if (id < 51){
		return 4;
	}
	return -1;
}


var Rando = Rando || {}
Rando.openApClient = function(){
	console.log("opening in game " + $gamePlayer);
	Rando.client = new window.ArchipelagoModules.Client();
	
	client = Rando.client;

	client.messages.on("message", (content) => {
		console.log(content);
	});

	
	client.login($gameVariables.value(URLVarID) + $gameVariables.value(codeVarID), $gameVariables.value(slotVarID), gameName)
	//client.login("archipelago.gg:57084", "Iris", "In Stars and Time")
    .then(() => console.log("Connected to the Archipelago server!"))
    .catch(console.error);
	Rando.initializeItemArray();


	Rando.client.items.on("itemsReceived", (items, index) => {
		if (!$gameParty.inBattle()){
			Rando.checkForItems();
		}
	});
	
	//Rando.client.deathEvents.on("deathReceived", (items, index) => {
	//	Rando.deathlink();
	//});
	
	
	Rando.client.items.on("hintsInitialized", (items, index) => {
		console.log('hints stuffs done uwu')
	});
	
	/*Rando.client.messages.on("itemSent", (text) => {
		var textArray = text.split(",");
		console.log(textArray);
		console.log('heya');
		$gameMessage.add(text);
		if (item.receiver.name == client.players.self.name){
			$gameVariables._data[itemListVarID].push(item.name);
		}
	});*/
}



Rando.initializeItemArray = function(){
	if (!$gamePlayer.APItemsReceived) {
		$gamePlayer.APItemsReceived = {};
	}
	$gameVariables._data[itemListVarID] = []	
}

Rando.initializeItemGameArray = function(player){
	if (!$gamePlayer.APItemsReceived[player]) {
		$gamePlayer.APItemsReceived[player] = {};
	}
}



Rando.checkForItems = function(){
			client.items.received.forEach((item) => {
				//console.log(item);
					var playerId = item.receiver;
					Rando.initializeItemArray();
					Rando.initializeItemGameArray(playerId);
					if (!$gamePlayer.APItemsReceived[playerId][item.locationId]){
						var get = item.id;
						//console.log("Getting Item");
						$gameParty._receivedItemName = 0;
						if (get < 1000){
							$gameParty.gainItem($dataArmors[get], 1);
							$gameParty._receivedItemName = $dataArmors[get].name;
							$gameVariables._data[itemListVarID].push($dataArmors[get].name);//if you wanta symbol to appear in these, add "'[' + $dataArmors[get].iconIndex + ']' + "here 
						}
						if (get > 1000 && get < 2000){
							$gameParty.gainItem($dataWeapons[get - 1000], 1);
							$gameParty._receivedItemName = $dataWeapons[get - 1000].name;
							$gameVariables._data[itemListVarID].push($dataWeapons[get - 1000].name);
						}
						if (get > 2000 && get < 3000){
							$gameParty.gainItem($dataItems[get - 2000], 1);
							$gameParty._receivedItemName = $dataItems[get - 2000].name;
							$gameVariables._data[itemListVarID].push($dataItems[get - 2000].name);
						}
						if (get > 3000 && get < 4000){//fix also give item if switch corosponds to item
							$gameSwitches.setValue(get - 3000,true);
							$gameParty._receivedItemName = switchName[get - 3000];
							$gameVariables._data[itemListVarID].push(switchName[get - 3000]);
						}	
						if (get > 4000 && get < 5000){
							if ($gameActors.actor(get_actor_id_skill(get - 4000))){
								$gameActors.actor(get_actor_id_skill(get - 4000)).learnSkill(get - 4000);
							} else {
								console.log("aaaa"); //made this bc I got an error and was mad
							}
							$gameParty._receivedItemName = $dataSkills[get - 4000].name;
							$gameVariables._data[itemListVarID].push($dataSkills[get - 4000].name);
						} 
						if (get == 3000){
							randomItemGet();
						}
						$gameSwitches.setValue(runItemGetSwitchID,true);
						$gamePlayer.APItemsReceived[playerId][item.locationId] = true;
					} else {
						//console.log("Double checking item")
							if (get < 1000){
								if (!$gameParty.hasItem($dataArmors[get])){
									$gamePlayer.APItemsReceived[playerId][item.locationId] = false;
									Rando.itemDoubleCheck();
								}
							}
							if (get > 1000 && get < 2000){
								if (!$gameParty.hasItem($dataWeapons[get - 1000])){
									$gamePlayer.APItemsReceived[playerId][item.locationId] = false;
									Rando.itemDoubleCheck();
								}
							}
							if (get > 2000 && get < 3000){
								if (!$gameParty.hasItem($dataItems[get - 2000])){
									$gamePlayer.APItemsReceived[playerId][item.locationId] = false;
									Rando.itemDoubleCheck();
								}
							}
							if (get > 3000 && get < 4000){
								if (!$gameParty.members().contains($gameActors.actor(get - 3000))){
									$gamePlayer.APItemsReceived[playerId][item.locationId] = false;
									Rando.itemDoubleCheck();
								}
							}
							if (get > 4000 && get < 5000){
								if (!$gameParty.hasItem($dataSkills[get - 4000])){
									$gamePlayer.APItemsReceived[playerId][item.locationId] = false;
									Rando.itemDoubleCheck();
								}
							}
					}
				//}
			});
			//var blah = 0;
			var winkys = [0,0,0];
			//winkys is for progessive
			//blah is for a bunch of the same item
			client.items.received.forEach((item) => {
				var id = item.id;
				//if (id == 3000){blah++;}
				if (id == 4017){
					winkys[0] ++;
				} else if (id == 4018){
					winkys[1] ++;
				} else if (id == 4035){
					winkys[2] ++;
				}
			})
			if (!$gameParty.hasItem($dataSkills[115]) && winkys[0] > 1){
				$gameParty.hasItem($dataSkills[115]);
			}
			if (!$gameParty.hasItem($dataSkills[116]) && winkys[1] > 1){
				$gameParty.hasItem($dataSkills[116]);
			}
			if (!$gameParty.hasItem($dataSkills[39]) && winkys[2] > 1){
				$gameParty.hasItem($dataSkills[39]);
			}
			/* if ($gameParty.numItems($dataItems[40]) < blah){
				while (blah > 0){
					$gameParty.gainItem($dataItems[40], 1);
					$gameParty._receivedItemName = $dataItems[40].name;
					$gameVariables._data[itemListVarID].push('\\i[' + $dataItems[40].iconIndex + ']' + $dataItems[40].name);
					
					$gameSwitches.setValue(runItemGetSwitchID,true);
					blah -= 1;
				}
			} */
}



Rando.itemDoubleCheck = function(){ //This is ran for when an item error is detected I think
	client.items.received.forEach((item) => {
		var playerId = item.receiver;
		var get = (item.id);
		if (get < 1000){
			if (!$gameParty.hasItem($dataArmors[get]) && !$gameParty.isAnyMemberEquipped($dataArmors[get])){
				$gameParty.gainItem($dataArmors[get], 1);
				$gamePlayer.APItemsReceived[playerId][item.locationId] = true;
			}
		}
		if (get > 1000 && get < 2000){
			if (!$gameParty.hasItem($dataWeapons[get - 1000]) && !$gameParty.isAnyMemberEquipped($dataWeapons[get - 1000])){
				$gameParty.gainItem($dataWeapons[get - 1000], 1);
				$gamePlayer.APItemsReceived[playerId][item.locationId] = true;
			}
		}
		if (get > 2000 && get < 3000){
			if (!$gameParty.hasItem($dataItems[get - 2000])){
				$gameParty.gainItem($dataItems[get - 2000], 1);
				$gamePlayer.APItemsReceived[playerId][item.locationId] = true;
			}
		}
		if (get > 3000 && get < 4000){
			if (!$gameSwitches.value(get - 3000)){
				$gameSwitches.setValue(get - 3000,true);
				$gamePlayer.APItemsReceived[playerId][item.locationId] = false;
			}
		}
		if (get > 4000 && get < 5000){
			if (!$gameParty.hasItem($dataSkills[get - 4000]) && !$gameParty.isAnyMemberEquipped($dataSkills[get - 4000])){
				$gameActors.actor(get_actor_id_skill(get - 4000)).learnSkill(get - 4000);
				$gamePlayer.APItemsReceived[playerId][item.locationId] = true;
			}
		}
	})
}




gain = function(item) {//Run this as a script in game with the location name as the parameter.
		foundLocations.push(item)
		var get = -1;
		for(const i of $gamePlayer.locationsRaw){
			if (i.locationName == item){
				get = i.locationId;
				break;
			}
		}
		console.log("sent location " + item + " with ID " + get);
		//Sawer notes here
		//Ask the client to send the item in question; If it's a Silver Daze item, the client will send it to us.
		//We can do this by storing all of the items that are received by the player in an array, then checking every couple frames if that item has been sent/received.
		//This will prevent duplicates, as well as "duds" that don't send, if the player loses connection with the client.
		//If the game isn't Archipelago, then we'll give the item to the player through normal means.
		//We should also error log if the game isn't connected to the client.
		Rando.client.check(get);
		if ($gamePlayer.locationScout[get].receiver.name !== client.players.self.name && $gamePlayer.locationScout[get].receiver.name !== undefined || 
		    $gamePlayer.locationScout[get].game !== gameName){
			if ($gamePlayer.locationScout[get].receiver.name == undefined){
				$gameVariables._data[sendListVarID].push($gamePlayer.locationScout[get].name + ' for ' + 'someone else');
			}else{
				$gameVariables._data[sendListVarID].push($gamePlayer.locationScout[get].name + ' for ' + $gamePlayer.locationScout[get].receiver.name);
			}
			$gameSwitches.setValue(runItemGetSwitchID,true);
			
		}
		if ($gamePlayer.locationScout[get].offline){
			var id = $gamePlayer.locationScout[get].id;
				$gameParty._receivedItemName = 0;
				if (id < 1000){
					$gameParty.gainItem($dataArmors[id], 1);
					$gameParty._receivedItemName = $dataArmors[id].name;
					$gameVariables._data[itemListVarID].push($dataArmors[id].name);
				}
				if (id > 1000 && id < 2000){
					$gameParty.gainItem($dataWeapons[id - 1000], 1);
					$gameParty._receivedItemName = $dataWeapons[id - 1000].name;
					$gameVariables._data[itemListVarID].push($dataWeapons[id - 1000].name);
				}
				if (id > 2000 && id < 3000){
					$gameParty.gainItem($dataItems[id - 2000], 1);
					$gameParty._receivedItemName = $dataItems[id - 2000].name;
					$gameVariables._data[itemListVarID].push($dataItems[id - 2000].name);
				}
				if (id > 3000 && id < 4000){
					$gameSwitches.setValue(id - 4000,true);
					$gameParty._receivedItemName = switchName[id - 4000];
					$gameVariables._data[itemListVarID].push(switchName[id - 4000]);
				}	
				if (id > 4000 && id < 5000){
					$gameParty.gainItem($dataSkills[id - 4000], 1);
					$gameParty._receivedItemName = $dataSkills[id - 4000].name;
					$gameVariables._data[itemListVarID].push($dataSkills[id - 4000].name);
				}
				if (id > 5000){//this is for errors I think?? Ask Sawer about it
					console.log('Archipelago');
					if (Archipelago[id - 5000]){
						$gameVariables._data[itemListVarID].push('\\i[193]' + Archipelago[id - 5000].name);
					} else {
						$gameVariables._data[itemListVarID].push('\\i[193] Archipelago Item');
					}
				}
				$gameTemp.reserveCommonEvent(itemGetEventID);
			}
}
Rando.initializeLocationScout = function(){ //locationScout is basically a way to get all info from any check.
	$gamePlayer.locationScout = $gamePlayer.locationScout || []
	$gamePlayer.locationsRaw.forEach((item) => {
         $gamePlayer.locationScout[item.locationId] = {};
         $gamePlayer.locationScout[item.locationId]['id'] = item.id;
         $gamePlayer.locationScout[item.locationId]['locationGame'] = item.locationGame;
         $gamePlayer.locationScout[item.locationId]['locationId'] = item.locationId;
         $gamePlayer.locationScout[item.locationId]['locationName'] = item.locationName;
         $gamePlayer.locationScout[item.locationId]['name'] = item.name;
         $gamePlayer.locationScout[item.locationId]['filler'] = item.filler;
         $gamePlayer.locationScout[item.locationId]['flags'] = item.flags;
         $gamePlayer.locationScout[item.locationId]['game'] = item.game;
         $gamePlayer.locationScout[item.locationId]['progression'] = item.progression;
         $gamePlayer.locationScout[item.locationId]['receiver'] = item.receiver;
         $gamePlayer.locationScout[item.locationId]['sender'] = item.sender;
         $gamePlayer.locationScout[item.locationId]['trap'] = item.trap;
         $gamePlayer.locationScout[item.locationId]['useful'] = item.useful;
})
	Object.entries(Location).forEach((place) => {
		if (!$gamePlayer.locationScout[place[1]]) {
			$gamePlayer.locationScout[place[1]] = {};
			$gamePlayer.locationScout[place[1]]['id'] = randoItem.id;
			$gamePlayer.locationScout[place[1]]['locationGame'] = gameName;
			$gamePlayer.locationScout[place[1]]['locationId'] = place[1];
			$gamePlayer.locationScout[place[1]]['locationName'] = place[0];
			$gamePlayer.locationScout[place[1]]['name'] = randoItem.name;
			$gamePlayer.locationScout[place[1]]['filler'] = true;
			$gamePlayer.locationScout[place[1]]['flags'] = [];
			$gamePlayer.locationScout[place[1]]['game'] = gameName;
			$gamePlayer.locationScout[place[1]]['progression'] = false;
			$gamePlayer.locationScout[place[1]]['receiver'] = client.name;
			$gamePlayer.locationScout[place[1]]['sender'] = client.name;
			$gamePlayer.locationScout[place[1]]['trap'] = false;
			$gamePlayer.locationScout[place[1]]['useful'] = false;
			$gamePlayer.locationScout[place[1]]['offline'] = true;
		} else {
		}
	})
	Object.freeze($gamePlayer.locationScout);
};

//stuff for my own game.
Rando.spoilRandomCheck = function() {//this is for getting a random useful item and spoiling it
	var ret = -1;
	for (var i = 1; i < 10000; i++) {
		if ($gamePlayer.locationScout[i] && $gamePlayer.locationScout[i]['useful']){
			ret = $gamePlayer.locationScout[i]
		}
	}
	return [temp['name'],temp['locationName'],temp['sender']]
}

foundLocations = []

Rando.hasBeenFound = function(name) { //this is self explanitory. You don't need me for this not
	for (const i of foundLocations) {
		if (name == i) {
			return true;
		}
	}
	return false;
}

randomItemGet = function() {//gives random thing from list
	var temp = Math.random()
	if (temp > 0.8){
		if (!$gameParty.hasItem($dataItems[63])){//gag item. You can delete
			$gameParty.gainItem($dataItems[63],1);
			$gameParty._receivedItemName = $dataItems[63].name;
			$gameVariables._data[itemListVarID].push($dataItems[63].name);
		} else {
			$gameSwitches.setValue(323,true);
			$gameParty._receivedItemName = "Extra Memories";
			$gameVariables._data[itemListVarID].push("Extra Memories");
		}
	}
	if (temp<0.2){
		$gameSwitches._data[405] = 0;
		$gameTemp.reserveCommonEvent(321);
		$gameParty._receivedItemName = "Random Siffrin EXP";
		$gameVariables._data[itemListVarID].push("Random Siffrin EXP");
	}else if (temp<0.4){
		$gameSwitches._data[405] = 1;
		$gameTemp.reserveCommonEvent(321);
		$gameParty._receivedItemName = "Random Party EXP";
		$gameVariables._data[itemListVarID].push("Random Siffrin EXP");
	} else if (temp<0.6){
		const randItem = $dataItems[Math.floor((Math.random()*6+2))];
		$gameParty.gainItem(randItem,1)
		$gameParty._receivedItemName = randItem.name;
		$gameVariables._data[itemListVarID].push(randItem.name);
	}
}

win = function(winCon) { //at every possible win, run this with the win index. 
	//TODO make game switches 403 a variable and wincon a string for readability
	if (!$gameSwitches._data[403]&&winCon==0){
		Rando.client.goal()
	}
	if ($gameSwitches._data[403]&&winCon==1){
		Rando.client.goal()
	}
}