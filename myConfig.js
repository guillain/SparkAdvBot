/**
 * @file Defines Translates functions for Spark
 * @author guillain guillain@gmail.com
 * @license GPL-3.0
 */

// Load config
var config = require('./config');

exports.help = function(bot) {
  var help = '**Configuration** \n\n';
  help += '_Description_ Provide information related to the server, Spark and bot environments \n\n';
  help += '_Commands_ : @ [config|c] [bot] \n\n';
  help += '* @ config \n\n';
  help += '* @ c bot \n\n';
  bot.say(help);
};


exports.config = function (bot, trigger) {
  // Remove the first two args
  trigger.args.splice(0,2);
  
  if (trigger.args['0'] == 'help') { module.exports.help(bot); }
  else {
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
  }
};
