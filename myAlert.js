/**
 * @file Defines Alert functions for Spark
 * @author guillain guillain@gmail.com
 * @license GPL-3.0
 */

// Load config
var config = require('./config');

exports.help = function(bot) {
  var help = '**Alert** \n\n';
  help += '_Description_ : Provide alert diffusion feature. Place a message and secure code and all spaces where the bot is will received the message \n\n';
  help += '_Commands_ : @ [alert] [code] [message] \n\n';
  help += '* @ alert 1234 Maintenance ongoing \n\n';
  help += '_Tips_ : Write the message in HTML to have a better format \n\n';
  help += '```bash \n@ alert 1234 <h1>Hello,</h1>\n<p>Some new features are availables!</p> \n``` \n';
  bot.say(help);
};

exports.alert = function (bot, trigger) {
  // Remove the first two args
  trigger.args.splice(0,2);

  var Spark = require('node-sparky');
  var spark = new Spark({ token: config.token  });

  if (/help/i.test(trigger.args['0']) || trigger.args.length < '2') { module.exports.help(bot); }
  else if (trigger.args['0'] != config.alert.code) { bot.say('Bad code, thanks to contact the administrator'); }
  else {
    var msg = '';
    for (i = 1; i < trigger.args.length; i++) { msg += ' ' + trigger.args[i]; }
    msg += '\n';
    //bot.say(msg);
    spark.roomsGet()
      .then(function(rooms) { 
        rooms.forEach(function(room) { 
          let newMessage = {
            roomId: room.id,
            markdown: msg
          };
          spark.messageSend(newMessage);
        });
      })
      .catch(function(err)  { bot.say('* Error during rooms listing'); console.log(err); });  
  }
};
