//Set-PSReadlineOption -BellStyle None //I'm just gonna leave this here for now. it's to turn of the fucking beeping in powershell (bckspace).
var tmi = require('tmi.js');
var fs = require('fs');
var request = require('request');
var oauth = require('./NotTodayFucker.js'); 		//imports oauth key from NotTodayFucker.js file for security in github upload (like anyone gives a shit)
var mode = 'initialised';							//sets specific game mode
var gmStatus = 'NULL';								//game status
var messageTracker = [];
messageTracker.length = 19;
messageTracker.fill(0);
var trackerIndex = 0;

var playerQueue = [];
var playerNum = 0;

var temp = [];

var currGame = [];
currGame.length = 2;
currGame.fill('NULL');

var options = {
	options: {
		debug: true
	},
	connection: {
		reconnect: true
	},
	identity: {
		username: "LAS_bot",
		password: oauth.password  						//see above
	},
	channels: ["#longawkwardsilence"]
};

var client = new tmi.client(options);

client.connect();
client.on("connected", function(address, port) {
	console.log('Address: ' + address + ' Port: ' + port);
	//client.action("longawkwardsilence", "Bitch, wasgood!"); //sends a /me
});

client.on("chat", function(channel, userstate, message, self){
	if (self)
		return;
	var msg = message;

		//UNIQUE CHATTER COUNT
	/*if (temp.indexOf(userstate.username) == -1){
		temp.push(userstate.username);
		console.log(temp + "\n" + temp.length);
		
		fs.writeFile("./uniquechatters.txt", temp.length.toString(), function(err) {
    	if(err) {
        	return console.log(err);
    	}    	
		}); 
	};*/
		//end unique chatter counter
	
	if (msg.indexOf(' ') == -1){
		msg = msg.concat(' NULL'); //this seems exploitable but...eh
	};
	switch (msg.substring(0, msg.indexOf(' '))){
		case '!hi':
		console.log('said hi');
		//sendMessage(longawkwardsilence, "hi");
		break; 

		case '!XO_mode':
			if (userstate['user-id'] == '90137836'){
				mode = 'XO';
				console.log('XO');
				//sendMessage("longawkwardsilence", "Noughts and Crosses time biiiiiiitttccchhh");
			};
		break;
		case '!uniquechatters':
			var tempnum = temp.length.toString();
			sendMessage('longawkwardsilence', tempnum);
		break;
		case '!uniquechatterspriv':
			console.log(temp.length.toString());
		break;
		//this is where the XO game logic is
		case '!JoinSingle':
			if (mode == 'XO'){  
			//console.log('single player joined')
				playerQueue[playerNum] = userstate.username;
				playerNum++
				console.log(playerQueue);
				console.log(playerNum);
					if (playerNum == 2){
						playerNum = 0;
						console.log('startgame');
						//START GAME
						currGame = playerQueue.slice(0,1);
						if (playerQueue.length>2 && gmStatus != 'ongoing'){
							playerQueue = playerQueue.shift();
							playerQueue = playerQueue.shift();
						}else{
							playerQueue = playerQueue.fill('NULL');
						}
					};
			};
		break;

		case '!JoinDouble':
			if (mode == 'XO'){
				switch(playerNum){
					case 0:
					playerQueue[playerNum] = userstate.username;
					playerNum++;
					var tempName = msg.substring(msg.indexOf('@')+1,msg.indexOf(' ', msg.indexOf('@')));
					playerQueue[playerNum] =  tempName;
					playerNum++;
					if (playerNum == 2){
						playerNum = 0;
						console.log('startgame');
						//START GAME
						currGame = playerQueue.slice(0,1);
						if (playerQueue.length>2 && gmStatus != 'ongoing'){
							playerQueue = playerQueue.shift();
							playerQueue = playerQueue.shift();
						}else{
							playerQueue = playerQueue.fill('NULL');
						};
					};

					break;

					case 1:
					//START GAMME
					break;

					case 2:
					break;
				};

			};
		break;

	};
	//console.log(userstate);
	//console.log(userstate['user-id']); 							// remember this shit
	//client.say("longawkwardsilence", "oh shit boys");	
});

function sendMessage(username, message){
 //-Function to check that messages are not exceeding sending limits (I learned this the hard way)
 //-Failing to use this function results in 30 min sitewide IP ban (possibly)
 //-Extra time/fewer messages (AKA THIS IS JANKY AS SHIT BECAUSE I DONT WANT TO THINK ABOUT IT RN) 
 //	are used as a precaution because tbh I dont wanna fuck with twitch.....I might fix it later

 //....im not super confident of how well this works
	var d = new Date();
	var n = d.getTime();
	messageTracker[trackerIndex] = n;
	trackerIndex++;
 	console.log(messageTracker);

	if(trackerIndex>=18){
		if(messageTracker[18] - messageTracker[0] < 32000){
			console.log('ERROR:TOO MUCH, YOU WANNA GET BANNED IDIOT!!!!')
			return;
		}else{
			messageTracker.shift();
			console.log(messageTracker);
			messageTracker.push(n);
			trackerIndex = 18;
			client.say(username, message);
		};
	
	}else{
		client.say(username, message);
	};
};


//console.log('fuck oath');

	//GENERATES VIEWER LIST
/*
client.api({
    url: "http://tmi.twitch.tv/group/user/longawkwardsilence/chatters"
}, function(err, res, body) {
    console.log(body);
});
*/
