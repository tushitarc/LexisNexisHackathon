var Botkit = require('botkit');
var Forecast = require('forecast.io');
var request=require('request');
var options = {APIKey:process.env.FORECASTTOKEN};
var forecast = new Forecast(options);

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
	  input: {'text': 'list all judges with 10 judges'},
	  context: context
	},  function(err, response) {
	  if (err)
	    console.log('error:', err);
	  else
	  	m=response;
	 	s=JSON.stringify(response, null, 2);
	 	var n=JSON.parse(s);
	    console.log(n.intents[0].intent);
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
	 'text': 'get all judges with 10 judges'
	};

	natural_language_understanding.analyze(parameters, function(err, response) {
	 if (err)
	   console.log('error:', err);
	 else
	 	m=response;
	 	s=JSON.stringify(response, null, 2);
	 	var n=JSON.parse(s);
	    console.log(n.semantic_roles[0].subject.text);//JSON.stringify(response, null, 2));
	    //console.log(JSON.stringify(response, null, 2));
  	});