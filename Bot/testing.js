
var Botkit = require('botkit');
var Forecast = require('forecast.io');
var request=require('request');
var options = {APIKey:process.env.FORECASTTOKEN};
var forecast = new Forecast(options);
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./judges.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  // console.log('Connected to the in-memory SQlite database.');
});


var intent="list";
var subject1;
var subject2;
var query;
var row;
var rows1;
var i=0;
var msg="";

function sleep(milliseconds) {
 var start = new Date().getTime();
 for (var i = 0; i < 1e7; i++) {
   if ((new Date().getTime() - start) > milliseconds){
     break;
   }
 }
}

/*function startBot(message)
{
	getIntent(message, function (abc)
	{
		console.log(abc);
	  	bot.reply(message,abc);
	});

	getSubject(message, function (abc)
	{
		console.log(abc);
	  	bot.reply(message,abc);
	});
	extractDb(function (abc)
	{
		console.log(abc);
		bot.reply(message,abc);
	});
}*/
//var childProcess = require("child_process");


function getIntent(message, bot, callback)
{
	console.log(message.match.input);
  	var watson = require('watson-developer-cloud');
	var a;
	var b;
	var c;
	var conversation = watson.conversation({
	  username: '7e80da21-b068-4532-a26b-97893a7f90e9',
	  password: 'IXnLAlgk1V1D',
	  version: 'v1',
	  version_date: '2017-05-26'
	});

	// Replace with the context obtained from the initial request
	var context = {};

	conversation.message({
	  workspace_id: '89937771-c30e-4428-a004-c833fc90602c',
	  input: {'text': message.match.input},
	  context: context
	},  function(err, response) {
	  if (err)
	    console.log('error:', err);
	  else
	  	m=response;
	 	s=JSON.stringify(response, null, 2);
	 	var n=JSON.parse(s);
	 	console.log(n);
	    console.log(n.intents[0].intent);
	    intent=n.intents[0].intent;
	    getSubject(message,bot,callback);

	    callback(intent);
	    //bot.reply(message, n.intents[0].intent);
	    //console.log(JSON.stringify(response, null, 2));
	});
}


function getSubject(message, bot, callback)
{

	var s;
	var m;
	var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
	var natural_language_understanding = new NaturalLanguageUnderstandingV1({
	 'username': '9e48cf5b-4424-4324-992b-4dfa9d9ed25f',
	 'password': 'kaQLmRkMqyVw',
	 'version_date': '2017-02-27'
	});

	var parameters = {
	 'features': {
	   'semantic_roles': {}
	 },
	 'text': message.match.input
	};

	natural_language_understanding.analyze(parameters, function(err, response) {
	 if (err)
	   console.log('error:', err);
	 else
	 	m=response;
	 	s=JSON.stringify(response, null, 2);
	 	var n=JSON.parse(s);
	 	console.log(JSON.stringify(response, null, 2));
	   console.log(n.semantic_roles[0].subject.text);
	   subject1=n.semantic_roles[0].subject.text;
	   
	   //JSON.stringify(response, null, 2));
	   console.log(n.semantic_roles[0].object.text);
	   subject2=n.semantic_roles[0].object.text;
	   var pos=subject2.search('name');
	   var len=subject2.length;
	   subject2=subject2.substring(pos+5,len);

	   console.log("last name:  ",subject2);
	   
	   extractDb(bot,message);
	   //bot.reply(message, n.semantic_roles[0].subject.text);
	   //bot.reply(message, n.semantic_roles[0].object.text);
	   callback(subject1);
  	});
}



function extractDb(bot,message)
{
	sleep(8000);
	//await sleep(2000);
	if(intent == "list"){
  		console.log(intent);
		query = "SELECT First_Name from judges WHERE Last_Name='"+subject2+"'";
		}
		// query = "SELECT First_Name from judges where Last_Name='Sparks'";
		//QUERY DB
		db.all(query, [], (err, rows) => {
		  if (err) {
		    throw err;
		  }
		  msg="";
		  rows.forEach((row) => {
		  	//rows1[i]=row;
		  	//i++;
		  	msg=msg+JSON.stringify(row['First_Name'])+"\n";
		    console.log(row);
		  });
		  bot.reply(message,msg);
		});

		//CLOSE DB CONNECTION
		//db.close((err) => {
		//  if (err) {
		 //   console.error(err.message);
		 // }
		//callback(rows1);
		//console.log('Close the database connection.');
		
		//callback(query);
	//});
}

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACKTOKEN,
}).startRTM()

// give the bot something to listen for.
//controller.hears('string or regex',['direct_message','direct_mention','mention'],function(bot,message) {
controller.hears('get',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
	//startBot(message);
	getIntent(message, bot, function (abc)
	{
		console.log(abc);
	  	//bot.reply(message,abc);
	});

	/*getSubject(message, bot, function (abc)
	{
		console.log(abc);
		console.log("Hello");
	  	bot.reply(message,abc);
	});*/
	
	

	//console.log("test");
	console.log("hello:");
		//console.log(rows);
		//console.log(rows[0]);
	//	bot.reply(message,msg);
	


	
  	/*if(intent == "list"){
  		console.log(intent);
		query = "SELECT * from judges";
		}
		// query = "SELECT First_Name from judges where Last_Name='Sparks'";
		//QUERY DB
		db.all(query, [], (err, rows) => {
		  if (err) {
		    throw err;
		  }
		  rows.forEach((row) => {
		  	rows1=row;
		    console.log(row);
		  });
		});

		//CLOSE DB CONNECTION
		db.close((err) => {
		  if (err) {
		    return console.error(err.message);
		  }
		  // console.log('Close the database connection.');
	});*/

})

controller.hears('fetch',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
	//startBot(message);
	
  		//console.log(intent);
  		console.log(message.text);
		var strs=message.text;
		var pos=strs.search('judge');
	   var len=strs.length;
	   strs=strs.substring(pos+6,len);
	   console.log(strs);
	   var name=strs.split(" ");
		
		query = "select  c.name from judges j, cases c, case_judge cj where c.case_id = cj.case_id and j.judge_id = cj.judge_id and j.first_name ='"+name[0]+"' and j.last_name ='"+name[1]+"'";
		
		// query = "SELECT First_Name from judges where Last_Name='Sparks'";
		//QUERY DB
		db.all(query, [], (err, rows) => {
		  if (err) {
		    throw err;
		  }
		  msg="";
		  rows.forEach((row) => {
		  	//rows1[i]=row;
		  	//i++;
		  	msg=msg+JSON.stringify(row['NAME'])+"\n";
		    console.log(row);
		  });
		  bot.reply(message,msg);
		});

		//CLOSE DB CONNECTION
		//db.close((err) => {
		//  if (err) {
		 //   console.error(err.message);
		 // }
		//callback(rows1);
		//console.log('Close the database connection.');
		
		//callback(query);
	//});

	

})

controller.hears('weather',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message);
  getWeather(function (abc)
  {
  	 console.log(abc);
  	 bot.reply(message,abc);
  });

  
});

controller.hears('girlfriend',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message);
  	 bot.reply(message,'I am still here');

  
});

controller.hears('hi',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message);
  	 bot.reply(message,'Hi, my name is Judgemental. I can help you with anything as long as its legal');

  
});



	//var n=JSON.parse(s);
	//console.log(s)
