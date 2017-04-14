/**
 * @file Cisco Spark Main bot
 * @author guillain <guillain.sanchez@gmail.com>
 * @license LGPL-3.0
 * @features:
 * @@ Search
 * @@ AI
 * @@ Crisis room
 * @@ Service Desk
 * @@ Vote
 * @@ Translate
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
var mySearch = require('./mySearch.js');
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
/*
flint.on('message', function(bot, trigger, id) {
  flint.debug('"%s" said "%s" in room "%s"', trigger.personEmail, trigger.text, trigger.roomTitle);
});
*/
// Recall fct
flint.on('spawn', bot => {
  // Crisis Room recall fct
  myCrisisRoom.recallCrisisRoom(bot);
});

// Define express path for incoming webhooks
app.post('/flint', webhook(flint) );

// Help fct
flint.hears(/^help.*/i, function(bot, trigger) {
  tosay  = 'You should try "\\help" \n\n';
  tosay += 'In fact \\ indicates to the system that you send a command. \n\n';
  bot.say(tosay);
});

flint.hears(/^\\(help|h)$/i, function(bot, trigger) {
  var tosay = 'Main help page: \n';
  tosay += '* \\servicedesk | \\sd [*|help] \n';
  tosay += '* * \\sd How can I get my badge? \n';
  tosay += '* \\search | \\s [*|help] \n';
  tosay += '* * \\s image My car \n';
  tosay += '* * \\s video My holidays \n';
  tosay += '* * \\s hub My news \n';
  tosay += '* \\translate | \\t [lang In] [lang Out] * | [help] \n';
  tosay += '* * \\t en es I don\'t understand \n';
  tosay += '* * \\t fr en Merci beaucoup \n';
  tosay += '* \\CrisisRoom [open|close|help] \n';
  tosay += '* \\vote | \\v [res|help] \n';
  tosay += '* \\config | \\c \n';
  tosay += '* \\help | \\h \n';
  tosay += '* default: AI \n';
  bot.say(tosay);
});

// Reply the conf to the 'config'
flint.hears(/^\\(config|c)$/i, function(bot, trigger) {
  var tosay = 'Current config: \n';
  tosay += '* Server: \n';
  tosay += '* * port:'+config.port+'\n';
  tosay += '* * address:'+config.address+'\n';
  tosay += '* * debug:'+config.debug+'\n';
  tosay += '* Spark: \n';
  tosay += '* * sparkbot: '+config.sparkbot+'\n';
  tosay += '* * webhookUrl: '+config.webhookUrl+'\n';
  tosay += '* * webhookRequestJSONLocation: '+config.webhookRequestJSONLocation+'\n';
  tosay += '* * removeWebhooksOnStart: '+config.removeWebhooksOnStart+'\n';
  tosay += '* * token: '+config.token+'\n';
  bot.say(tosay);
});

// ServiceDesk$
flint.hears(/^\\(servicedesk|sd) .*/i, function(bot, trigger) {
  myServiceDesk.servicedesk(bot, trigger);
});

// CrisisRoom 
flint.hears(/^\\CrisisRoom .*/i, function(bot, trigger) {
  myCrisisRoom.CrisisRoom(bot, trigger);
});

// Import search functions
flint.hears(/^\\(search|s) .*/i, function(bot, trigger) {
  mySearch.search(bot, trigger);
});

// Import translate functions
flint.hears(/^\\(translate|t) .*/i, function(bot, trigger) {
  myTranslate.translate(bot, trigger);
});

// Vote
flint.hears(/^\\(vote|v).*/i, function(bot, trigger) {
  myVote.vote(bot, trigger);
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

