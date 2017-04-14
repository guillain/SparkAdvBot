/**
 * @file Defines Translates functions for Spark
 * @author guillain <guillain.sanchez@gmail.com>
 * @license LGPL-3.0
 */

exports.translate = function (bot, trigger) {
  var tosay = '';
  var translate = require('node-google-translate-skidz');

  if (/help/i.test(trigger.args['1'])) {
    tosay  = '\\translate [lang in] [lang out] [*/phrase]';
    tosay += 'lang: en, es, fr, ge';
    bot.say(tosay);
  } else {
    var phrase = '';
    var langIn = trigger.args['1'];
    var langOut = trigger.args['2'];
    for (i = 3; i < trigger.args.length; i++) {
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


