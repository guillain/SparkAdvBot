/**
 * @file Defines Translates functions for Spark
 * @author guillain guillain@gmail.com
 * @license GPL-3.0
 */

exports.help = function(bot) {
  var help  = '**Translate** \n\n';
  help += '@ [translate|t] [lang in] [lang out] [*/phrase] \n';
  help += '* @ translate en fr I like it! \n';
  help += '* @ t fr ge rendez-vous demain \n';
  help += '_lang_: en, es, fr, ge \n\n';
  bot.say(help);
}

exports.translate = function (bot, trigger) {
  var tosay = '';
  var translate = require('node-google-translate-skidz');

  // Remove the first two args
  trigger.args.splice(0,2);
  
  if (/help/i.test(trigger.args['0'])) { module.exports.help(bot); }
  else {
    var phrase = '';
    var langIn = trigger.args['0'];
    var langOut = trigger.args['1'];
    for (i = 2; i < trigger.args.length; i++) {
      phrase += ' '+trigger.args[i];
    }
    console.log('langIn:'+langIn+', phraseIn:'+phrase);
    
    translate({
      text: phrase,
      source: langIn,
      target: langOut
    }, function(result) {
      tosay  = result+'\n';
      tosay += '* IN  : lang:'+langIn+', phrase:'+phrase+'\n';
      tosay += '* OUT : lang:'+langOut+', phrase:'+result+'\n';
      bot.say(tosay);
    });
  }
};
