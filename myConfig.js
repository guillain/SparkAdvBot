/**
 * @file Defines Translates functions for Spark
 * @author guillain guillain@gmail.com
 * @license GPL-3.0
 */

// Load config
var config = require('./config');

exports.help = function(bot) {
  var help = '**Configuration** \n\n';
  help += '@ [config|c] [bot] \n';
  help += '* @ config \n';
  help += '* @ c bot \n\n';
  bot.say(help);
};


exports.config = function (bot, trigger) {
  var tosay = 'Current config: \n';
  tosay += '**Server** \n';
  tosay += '* port:'+config.port+'\n';
  tosay += '* address:'+config.address+'\n';
  tosay += '* debug:'+config.debug+'\n';
  tosay += '**Spark** \n';
  tosay += '* sparkbot: '+config.sparkbot+'\n';
  tosay += '* webhookUrl: '+config.webhookUrl+'\n';
  tosay += '* webhookRequestJSONLocation: '+config.webhookRequestJSONLocation+'\n';
  tosay += '* removeWebhooksOnStart: '+config.removeWebhooksOnStart+'\n';
  tosay += '* token: '+config.token+'\n';
  tosay += '**Bot** \n';
  tosay += '* _ToDo_ \n';

  bot.say(tosay);
};
