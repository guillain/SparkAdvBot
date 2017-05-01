/**
 * @file Defines Admin functions for Spark
 * @author guillain guillain@gmail.com
 * @license GPL-3.0
 */

// Load config
var config = require('./config');


exports.botMgr = function (bot, trigger) {
  var tosay = '';
  var Spark = require('node-sparky');
  var spark = new Spark({ token: config.token  });

  if (/help/i.test(trigger.args['1'])) {
    tosay  = '\\botmgr | \\b [list|update*|delete*] [webhook|room] [id*] \n';
  } else if (trigger.args.length < 3) {
    tosay = 'Argument missing, try \'\\a help\' \n';
  } else {
    var action = trigger.args['1'];
    var target = trigger.args['2'];
    var id     = trigger.args['3'];
    console.log('action:' + action + ', target:' + target + ', id:' + id);

    if (target == 'room' && action == 'list') {
      tosay += "**Room listing**\n";
      spark.roomsGet(100)
        .then(function(rooms) { rooms.forEach(function(room) { bot.say('* ' + room.title + ', id:' + room.id + '\n'); }); })
        .catch(function(err)  { bot.say('* Error during rooms listing'); console.log(err); });
    }

    if (target == 'webhook' && action == 'list') {
      tosay += "**Webhook listing**\n";
      spark.webhooksGet(100)
        .then(function(webhooks) { webhooks.forEach(function(webhook) { bot.say('* ' + webhook.name + ', id:' + webhook.id + '\n'); } ); })
        .catch(function(err)     { bot.say('* Error during webhooks listing'); console.log(err); });
    }
  }
  bot.say(tosay);
}
