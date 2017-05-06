/**
 * @file Defines Vote system functions for Spark
 * @author guillain guillain@gmail.com
 * @license GPL-3.0
 */

// Load config
var config = require('./config');
var redis = require("redis");
var client = redis.createClient({detect_buffers: true});

exports.help = function(bot) {
  var help = '**Vote** \n\n';
  help += '@ [vote|v] [yes|no|later] | [result|flush|help] \n';
  help += '* @ vote yes \n';
  help += '* @ v no \n\n';
  help += '_Administration_ \n';
  help += '* @ v result \n';
  help += '* @ v flush \n';
  bot.say(help);
};

printres = function (bot,trigger) {
  var res = 'Result for the current participation: \n';
  var tot = 'Total result: \n';
  var counts = {};

  client.get(config.vote.storage, function (err, votes) {
    if (votes) {
      votesArr = votes.split(",");
      for (i = 0; i < votesArr.length; i++) {
        // Print participant result
        res += '- '+votesArr[i]+'\n';

        // Total
        vote = votesArr[i].split(":");
        var num = vote[1];
        counts[num] = counts[num] ? counts[num]+1 : 1;
      }
      bot.say(res);

      for(var i in counts){ tot += '- '+i+':'+counts[i]+'\n'; }
      bot.say(tot)
    } else {
      bot.say('No vote recorded');
    }
  });
}

exports.vote = function (bot, trigger) {
  // Remove first two args
  trigger.args.splice(0,2);

  // if help cmd
  if (/help/i.test(trigger.args['0'])) { 
    module.exports.help(bot);

  // if (print) result cmd
  } else if (/result/i.test(trigger.args['0'])) {
    printres(bot,trigger);

  // if flush cmd
  } else if (/flush/i.test(trigger.args['0'])) {
    client.del(config.vote.storage, redis.print);
    bot.say('Flush done');

  // if result posted
  } else if (trigger.args['0']) {
    if (/^(yes|no|later)$/i.test(trigger.args['0'])) {
      client.get(config.vote.storage, function (err, votes) {
        // Check if it\'s first vote, if yes add the vote
        if (votes) {
          // Check if the guy has already voted
          var votesArr = votes.split(",");
          for (i = 0; i < votesArr.length; i++) {
            vote = votesArr[i].split(":");
            if (vote[0] == trigger.personEmail) { 
              bot.say('You have already voted but thanks for your interest');
              return;
            }
          }
          // Add the vote
          votes += ','+trigger.personEmail+':'+trigger.args['0'];
        } else {
          // Add the first vote
          votes = trigger.personEmail+':'+trigger.args['0'];
        }
        client.set(config.vote.storage, votes, redis.print);
        bot.say('Thanks for your vote! \n');
        printres(bot,trigger);
      });
    } else {
      bot.say('Wrong reply \n\nTry **@ vote help**');
    }
  } else {
    phrase  = config.vote.message+'\n';
    phrase += 'Thanks to reply by chat with the corresponding word \n\n';
    phrase += 'i.e.: \\v yes \n';
    bot.say(phrase);
  }
};
