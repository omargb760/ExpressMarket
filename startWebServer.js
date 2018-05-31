/*
Editors: Omar Gonzalez, Jade Richardson
file Type: js file type
Purpose: The purpose of this file is to serve as our server for our whole project and Database
*/


//-------------------- User Database----------------------------//
var TAFFY = require('taffy');
var users = TAFFY([
	{
		Username: "jade022",
		// Emphasizing Secruity issue of saving Plain Text Passwords
		PlainTextPassword: "SuperSecret123",
		Stocks: ["Tesla","Apple","CalAmp"],
		price: 999999.99
	},
	{
		Username: "Omar026",
		// Emphasizing Secruity issue of saving Plain Text Passwords
		PlainTextPassword: "SuperSecret026",
		Stocks: ["Tesla", "Apple", "Google"],
		price: 12345.99
	}
]);


// Notes: We should have throw and catch cases within simular functions for better err cases
// 		Callback functions need to be made when time is available
function hasAccount(username, password) {
	var loginStatus = {Exist: false, Auth: false};
	// User Found
	if (users({ Username: username }).count()) {
		console.log('User already in database!');
		loginStatus.Exist = true;
		// Creating temp array object with one index object of the current user
		var loginUser = users({ Username: username }).get();
		console.log("User Found: %s", loginUser[0].Username);
		// Emphasizing Secruity issue of saving Plain Text Passwords
		if (loginUser[0].PlainTextPassword == password) {
			loginStatus.Auth = true;
			console.log("Password Entered: %s", password);
			console.log("User has correct password and username combo");
			console.log("Go For Dashboard");
			// Successful Login
			return loginStatus;
		}
		// Failed password entry
		return loginStatus;
	}
	// Logic block should be changed to ask for a sign up
	else {
		console.log("Go For Sign Up Page");
		console.log("Adding \"%s\" to Userbase.", username);
		// Emphasizing Secruity issue of saving Plain Text Passwords
		keywords.insert({ Username: username, PlainTextPassword: password });
		// Displaying last entry that was just added
		console.log(users().last());
		// Failed User Lookup
		return loginStatus;
	}
};

// Looked into seperating and joining files, it doesn't look worth getting into right now

// Algorthm script
//--------------------Algorthm Database----------------------------//
var keywords = TAFFY([
	// Sample words (see addKeywords())
	{ Word: "TestWord", Weight: 0 }
]);

var keyphrases = TAFFY([
	// Sample Phrases (see addPhrases())
	{ Phrase: "Phrase", Weight: 0 }
]);

function addKeywords(wordForInsert, weightofWord) {
	// Word Found
	if (keywords({ Word: wordForInsert }).count()) {
		console.log('Word already in database:');
		// Not the greatest way to find it but it works
		// Creating and calling a function that looks for the record
		if (keywords(function () {
			return (this.Word == wordForInsert) ? true : false;
		})) {
			console.log("Word Found: %s", wordForInsert);
		};
		// Failure
		return false;
	}
	else {
		console.log("Adding \"%s\" to wordbase.", wordForInsert);
		keywords.insert({ Word: wordForInsert, Weight: weightofWord });
		// Displaying last entry that was just added
		console.log(keywords().last());
		// console.log(keywords().select("Weight",weightofWord));
		// Success
		return true;
	}
};

function addTestWords() {
	addKeywords('good', 7);
	addKeywords('great', 8);
	addKeywords('bad', 2);
	addKeywords('poor', 3);
	addKeywords('changing', 8);
	addKeywords('oppertunity', 10);
	addKeywords('fatal', 1);
	addKeywords('concern', 5);
	addKeywords('losing', 3);
	addKeywords('new', 5);
	addKeywords('absence', 2);
	addKeywords('rumors', 5);
	addKeywords('prepared', 7);
	addKeywords('reorganization', 2);
	addKeywords('success', 7);
	addKeywords('trimming', 2);
	addKeywords('crashes', 1);
	addKeywords('cheaper', 8);
	addKeywords('new', 8);
	addKeywords('buying', 10);
	addKeywords('invest', 10);
	addKeywords('buying', 10);
	addKeywords('buying', 10);
	addKeywords('buying', 10);

	return true;
};

function fortuneTeller(article) {
	var articleEval = {
		grade: 0,
		source: 'Copyright',
		date: 'Updated: '
	};
	// It is unsafe to access string indexes like arrays
	var articleArr = article.split(" ");
	var articleWords;
	addTestWords();
	var keywordCount = 0;
	for (let index = 0; index < articleArr.length; index++) {
		console.log(articleArr[index]);
		articleArr[index].toLowerCase();
		if(articleArr[index] == 'Updated') {
			index+=1;
			for (let dateindex = 0; dateindex != 6; dateindex++) {
				articleEval.date = articleEval.date + ' ' +articleArr[index];
				index++;
			}
		}
		if (articleArr[index] == 'Copyright') {
			index += 1;
			for (let dateindex = 0; dateindex != 6; dateindex++) {
				articleEval.source = articleEval.source + ' ' + articleArr[index];
				index++;
			}
		}
		if (keywords({ Word: articleArr[index] }).count()) {
			// Better way to do this so we don't have create an array to parse through
			let arrWordDB = keywords({ Word: articleArr[index] }).get();
			// Adding up the weights of the found word
			articleEval.grade += arrWordDB[0].Weight;
			keywordCount++;
		}
	}
	if (!keywordCount) {
		keywordCount = 1;
		articleEval.source  = "No KeyWords Found";
		articleEval.date = "No KeyWords Found";

	}
	if (articleEval.source == "Copyright") {
		articleEval.source = "Google.com";
	}
	articleEval.grade = (articleEval.grade / keywordCount) * 10;
	console.log(articleEval);
	return (articleEval);
};

// Debug to console
// console.log("Final Grade: %i", fortuneTeller());

// Required Modules
var
http = require('http'),
path = require('path'),
fs = require('fs'),
express = require('express'),
bodyParser =require('body-parser');

var app = express();

// Running out expresses server starter

// Using express to render CSS
app.use(express.static(__dirname + '/clientSide'));

// Using the bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Using ejs for View Engine, vroom vroom
app.set('view engine', 'ejs');
// Setting folder for views
app.set('views', path.join(__dirname, 'views'))

// Public folder for static resources (such as CSS) [The second param is the name of the ' ' folder]
// By defult this looks for 'index.html' - to just have all html file in this folder would make this more of a clientside app
// Futhermore, we want to render views from the server
app.use(express.static(path.join(__dirname, 'clientSide')));

// Testing a pass of a json to html view using render below
var recentUsers = [
	{
		userName: "jade022",
		mostViewedStock: "Tesla"
	},
	{
		userName: "Omar026",
		mostViewedStock: "Apple"
	}
];

// If you place the get before the logger, the logger will not run
app.get('/', function(req,res){
	// send() sends a string etc to the client
	res.render('index', {
		recentUsers: recentUsers
	});
});

var dashboardInfo = {
	userName: "Tedster827!",
	article0Name: "Tesla",
	article0Eval: 0,
	advice: "Wait for the market to change more"
}

app.post('/', function(req,res) {
	// Calling the Database to check to see if the user has an account aleady
	// Creating a an object to catch return object
	var loginQuery = hasAccount(req.body.username, req.body.password);
	var currentUserName = req.body.username;
	if (req.body.articleText) {
		var articleEvalReturn = fortuneTeller(req.body.articleText);
		if (articleEvalReturn.grade < 70) {
			advice = 'Buy';
			console.log(articleEvalReturn.grade);
		}
		else {
			advice = 'Sell ASAP!'
			console.log(articleEvalReturn.grade);
		}
		dashboardInfo = {
			article0Name: req.body.articlesStock,
			article0Eval: Math.round(articleEvalReturn.grade),
			article0Source: articleEvalReturn.source,
			article0Date: articleEvalReturn.date,
			article0Option: advice
		}
		console.log("Trace");
		res.render(path.join(__dirname + '/views/dynamic_user_with_info.ejs'), {
			dashboardInfo: dashboardInfo
		})
		return;
	}
	else if (loginQuery.Exist && loginQuery.Auth) {
		console.log("\"%s\" just successfully logged in", req.body.username);
		dashboardInfo = {
			userName: req.body.username,
		};
		res.render(path.join(__dirname + '/views/dynamic_user.ejs'), {
			dashboardInfo: dashboardInfo
		})
		return;
	}
	// Database Password Lookup Failed
	else if (!loginQuery.Auth) {
		console.log("Incorrect Password");
		res.redirect('../index');
		return;
	}
});

app.get('/About', function(req, res) {
	res.render(path.join(__dirname + '/views/About.ejs'));
});

app.get('/contactUs', function (req, res) {
	res.render(path.join(__dirname + '/views/contactUs.ejs'),{
		recentUsers: recentUsers
	});
});

app.get('/index', function (req, res) {
	res.render(path.join(__dirname + '/views/index.ejs'), {
		recentUsers: recentUsers
	});
});

app.listen(3000, function(){
	console.log("Yes, we're still here on port 3000?");
})
