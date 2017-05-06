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
  var helpMsg = 'Argument missing, try **\\b help** \n';

  if (/help/i.test(trigger.args['1'])) { 
    tosay  = '\\botmgr | \\b [list|delete*] [webhook|room] [id*] \n'; 
    tosay += '_Room_\n';
    tosay += '* \\b list room \n';
    tosay += '* \\b delete room [id]\n';
    tosay += '_Webhook_\n';
    tosay += '* \\b list webhook \n';
    tosay += '* \\b delete webhook [id]\n';
  }
  else if (trigger.args.length < 3)  { tosay = helpMsg; }
  else {
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
    if (target == 'room' && action == 'delete') {
      if (trigger.args.length < 4) { tosay = helpMsg; }
      else {
        spark.roomRemove(id)
          .then(function(rooms) { bot.say('Room deleted \n'); })
          .catch(function(err)  { bot.say('* Error during room delete'); console.log(err); });
      }
    }

    if (target == 'webhook' && action == 'list') {
      tosay += "**Webhook listing**\n";
      spark.webhooksGet(100)
        .then(function(webhooks) { webhooks.forEach(function(webhook) { bot.say('* ' + webhook.name + ', id:' + webhook.id + '\n'); } ); })
        .catch(function(err)     { bot.say('* Error during webhooks listing'); console.log(err); });
    }
    if (target == 'webhook' && action == 'delete') {
      if (trigger.args.length < 4) { tosay = helpMsg; }
      else {
        spark.webhookRemove(id)
          .then(function(rooms) { bot.say('Webhook deleted \n'); })
          .catch(function(err)  { bot.say('* Error during room delete'); console.log(err); });
      }
    }
  }
  bot.say(tosay);
}
