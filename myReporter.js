/**
 * @file Defines Reporter functions for Spark
 * @author guillain guillain@gmail.com
 * @license GPL-3.0
 */

// Load config
var config = require('./config');

exports.help = function(bot) {
  var help = '**Reporter** \n\n';
  help += '_Description_ : Provide dump features on **CSV** format for the current Space \n\n';
  help += '_Commands_ : @ [reporter|r] [bot] \n\n';
  help += '* @ reporter \n\n';
  help += '* @ r bot \n\n';
  bot.say(help);
};

exports.reporter = function (bot, trigger) {
  // Remove the first two args
  trigger.args.splice(0,2);

  var Spark = require('node-sparky');
  var fs = require('fs');
  var spark = new Spark({ token: config.token  });


  var date = new Date().toISOString().replace(/T.*/, '_');
  var filename = config.reporter.tmpfile + date + bot.room.id + '.csv';

  var filetxt = 'Dump of the space: ' + bot.room.id + '\n';
      filetxt += 'id;roomType;text;personId;personEmail;created;\n';

  var dumpbottxt = '';
  if (/bot/i.test(trigger.args['0'])) {
    dumpbottxt  = 'Dump of the bot env. in the space: ' + bot.room.id + '\n';
    dumpbottxt += bot +'\n';
  }

  if (/help/i.test(trigger.args['0'])) { module.exports.help(bot); }
  else {
    spark.messagesGet({roomId: bot.room.id}, 1000)
      .then(function(msgs) { 
        msgs.forEach(function(msg) {
          filetxt += msg.id + ';' + msg.roomType + ';' + msg.text + ';' + msg.personId + ';' + msg.personEmail + ';' + msg.created + ';\n';
        });

        if (dumpbottxt != '') { filetxt += dumpbottxt; }

        fs.writeFile(filename, filetxt, function(err) {
          if(err) {
            bot.say('* Error during file writing'); 
            console.log(err); 
          }
          else {
            bot.upload(filename);
            fs.unlinkSync(filename);
          }
        });
      })
      .catch(function(err)  { bot.say('* Error during messages listing'); console.log(err); });
   
  }
};
