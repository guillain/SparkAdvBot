/**
 * @file Cisco Spark Main bot
 * @author guillain guillain@gmail.com
 * @license GPL-3.0
 * @features:
 * @@ Search
 * @@ AI
 * @@ Bot mgr
 * @@ Crisis room
 * @@ Service Desk
 * @@ Vote
 * @@ Translate
 * @@ Reporter
 * @@ Config
 */

// Import module
var Flint = require('node-flint');
var webhook = require('node-flint/webhook');
var RedisStore = require('node-flint/storage/redis'); // load driver
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();
app.use(bodyParser.json());

// Load config
var config = require('./config');

// Init flint
var flint = new Flint(config);

// My additionnal features
var myAI = require('./myAI.js');
var myVote = require('./myVote.js');
var myAlert = require('./myAlert.js');
var myBotMgr = require('./myBotMgr.js');
var mySearch = require('./mySearch.js');
var myConfig = require('./myConfig.js');
var myReporter = require('./myReporter.js');
var myTranslate = require('./myTranslate.js');
var myCrisisRoom = require('./myCrisisRoom.js');
var myServiceDesk = require('./myServiceDesk.js');

// Use redis storage
flint.storageDriver(new RedisStore('redis://127.0.0.1')); // select driver

// Start flint
flint.start();

// Set default messages to use markdown globally for this flint instance...
flint.messageFormat = 'markdown';

// Debug echo
flint.on('initialized', function() {
  flint.debug('initialized %s rooms', flint.bots.length);
});
flint.on('message', function(bot, trigger, id) {
  flint.debug('"%s" said "%s" in room "%s"', trigger.personEmail, trigger.text, trigger.roomTitle);
});

// Recall fct
flint.on('spawn', bot => {
  // Crisis Room recall fct
  myCrisisRoom.recallCrisisRoom(bot);
});

// Define express path for incoming webhooks
app.post('/flint', webhook(flint) );

// Help fct
flint.hears(/^help.*/i, function(bot, trigger) {
  var tosay = 'You should try **@ help** or **@ [feature] help** \n\n';
  tosay += 'In fact **@** indicates to the system that you send a command. \n\n';
  bot.say(tosay);
});

flint.hears(/^(@|SparkBotAdv) (help|h)$/i, function(bot, trigger) {
  var help = '**Spark Bot Advanced** \n\n';
  help += '_Description_ : Cisco Spark Chat Bot to provide demo and global overview of existing features \n\n';
  help += '_Commands_ : [@|@SparkBotAdv] [feature] [help|option] \n\n';
  help += '* **For 1:1 usage** : @ [feature] [option] \n\n';
  help += '* **For group usage** : @SparkBotAdv vote help \n\n';
  help += '_Examples_ : \n\n';
  help += '* **1:1** : @ search help \n\n';
  help += '* **Group** : @SparkBotAdv search help \n\n';
  help += '_Features_ : \n\n';
  help += '* AI \n';
  help += '* Vote \n';
  help += '* Alert \n';
  help += '* Search \n';
  help += '* Config \n';
  help += '* BotMgr \n';
  help += '* Reporter \n';
  help += '* Translate \n';
  help += '* CrisisRoom \n\n';
  help += '* ServiceDesk \n';
  bot.say(help);
});

// Test
flint.hears(/^(@|SparkBotAdv) test .*/i, function(bot, trigger) {
  console.log('>>> trigger.args:' + trigger.args);
  //bot.say(trigger.args);
});

// Alert
flint.hears(/^(@|SparkBotAdv) alert .*/i, function(bot, trigger) {
  myAlert.alert(bot, trigger);
});

// Config
flint.hears(/^(@|SparkBotAdv) (config|c) .*/i, function(bot, trigger) {
  myConfig.config(bot, trigger);
});

// ServiceDesk$
flint.hears(/^(@|SparkBotAdv) (servicedesk|sd) .*/i, function(bot, trigger) {
  myServiceDesk.servicedesk(bot, trigger);
});

// CrisisRoom 
flint.hears(/^(@|SparkBotAdv) (crisisroom|cr) .*/i, function(bot, trigger) {
  myCrisisRoom.CrisisRoom(bot, trigger);
});

// Import search functions
flint.hears(/^(@|SparkBotAdv) (search|s) .*/i, function(bot, trigger) {
  mySearch.search(bot, trigger);
});

// Import translate functions
flint.hears(/^(@|SparkBotAdv) (translate|t) .*/i, function(bot, trigger) {
  myTranslate.translate(bot, trigger);
});

// Vote
flint.hears(/^(@|SparkBotAdv) (vote|v).*/i, function(bot, trigger) {
  myVote.vote(bot, trigger);
});

// BotMgr
flint.hears(/^(@|SparkBotAdv) (botmgr|bm).*/i, function(bot, trigger) {
  myBotMgr.botMgr(bot, trigger);
});

// Reporter
flint.hears(/^(@|SparkBotAdv) (reporter|r).*/i, function(bot, trigger) {
  myReporter.reporter(bot, trigger);
});

// Default for unrecognized commands is AI
flint.hears(/.*/, function(flint, bot, trigger) {
  myAI.AI(flint, bot, trigger);
});

// Start expess server
var server = app.listen(config.port, function () {
  flint.debug('Flint listening on port %s', config.port);
});

// Gracefully shutdown (ctrl-c)
process.on('SIGINT', function() {
  flint.debug('stoppping...');
  server.close();
  flint.stop().then(function() {
    process.exit();
  });
});
