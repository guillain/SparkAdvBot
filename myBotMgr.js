/**
 * @file Defines Admin functions for Spark
 * @author guillain guillain@gmail.com
 * @license GPL-3.0
 */

// Load config
var config = require('./config');

exports.help = function(bot){
  var help = '**Bot Manager** \n\n';
  help += '@ [botmgr|b] [list|delete*] [webhook|room] [id*] \n';
  help += '_Room_ \n';
  help += '* @ b list room \n';
  help += '* @ b delete room [id] \n\n';
  help += '_Webhook_\n';
  help += '* @ b list webhook \n';
  help += '* @ b delete webhook [id] \n\n';

  bot.say(help);
}

exports.botMgr = function (bot, trigger) {
  var tosay = '';
  var Spark = require('node-sparky');
  var spark = new Spark({ token: config.token  });
  var helpMsg = 'Argument missing, try **@ b help** \n';

  // Remove the first two args
  trigger.args.splice(0,2);

  if (/help/i.test(trigger.args['0'])) { module.exports.help(bot); }
  else if (trigger.args.length == 0)   { tosay = helpMsg; }
  else {
    var action = trigger.args['0'];
    var target = trigger.args['1'];
    var id     = trigger.args['2'];
    console.log('action:' + action + ', target:' + target + ', id:' + id);

    if (target == 'room' && action == 'list') {
      tosay += "**Room listing**\n";
      spark.roomsGet()
        .then(function(rooms) { rooms.forEach(function(room) { bot.say('* ' + room.title + ', id:' + room.id + '\n'); }); })
        .catch(function(err)  { bot.say('* Error during rooms listing'); console.log(err); });
    }
    if (target == 'room' && action == 'delete') {
      if (trigger.args.length < 3) { tosay = helpMsg; }
      else {
        spark.roomRemove(id)
          .then(function(rooms) { bot.say('Room deleted \n'); })
          .catch(function(err)  { bot.say('* Error during room delete'); console.log(err); });
      }
    }

    if (target == 'webhook' && action == 'list') {
      tosay += "**Webhook listing**\n";
      spark.webhooksGet()
        .then(function(webhooks) { webhooks.forEach(function(webhook) { bot.say('* ' + webhook.name + ', id:' + webhook.id + '\n'); } ); })
        .catch(function(err)     { bot.say('* Error during webhooks listing'); console.log(err); });
    }
    if (target == 'webhook' && action == 'delete') {
      if (trigger.args.length < 3) { tosay = helpMsg; }
      else {
        spark.webhookRemove(id)
          .then(function(rooms) { bot.say('Webhook deleted \n'); })
          .catch(function(err)  { bot.say('* Error during room delete'); console.log(err); });
      }
    }
  }
  bot.say(tosay);
}
