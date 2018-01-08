
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


var intent;
var subject1;
var subject2;
var query;
var row;
//var childProcess = require("child_process");
function getWeather(callback)
{
	var latitude = "48.208579"
	var longitude = "16.374124"
	forecast.get(latitude, longitude, function (err, res, data) 
	{
      //if (err) throw err;
      //console.log('res: ' + JSON.stringify(res));
      //console.log('data: ' + JSON.stringify(data));
      var w = data.currently.summary + " and feels like " + data.currently.apparentTemperature;
      callback(w);
    });
	
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
	    console.log(n.intents[0].intent);
	    intent=n.intents[0].intent;
	    bot.reply(message, n.intents[0].intent);
	    //console.log(JSON.stringify(response, null, 2));
	});

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
	   console.log(n.semantic_roles[0].subject.text);
	   subject1=n.semantic_roles[0].subject.text;
	   //JSON.stringify(response, null, 2));
	   console.log(n.semantic_roles[0].object.text);
	   subject2=n.semantic_roles[0].object.text;
	   console.log(JSON.stringify(response, null, 2));
	   bot.reply(message, n.semantic_roles[0].subject.text);
	   bot.reply(message, n.semantic_roles[0].object.text);
  	});
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

controller.hears('weather',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message);
  getWeather(function (abc)
  {
  	 console.log(abc);
  	 bot.reply(message,abc);
  });

  //var w = getWeather();
  
  //bot.reply(message,"The weather is great");

});



	//var n=JSON.parse(s);
	//console.log(s)
