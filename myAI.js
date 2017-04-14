/**
 * @file Defines Search functions for Spark
 * @author guillain <guillain.sanchez@gmail.com>
 * @license LGPL-3.0
 */

exports.AI = function (bot, trigger) {
  var firstword = trigger.args['0'];
  var secondword = trigger.args['1'];
  var thirdword = trigger.args['2'];
  var phrase = firstword+' '+secondword+' '+thirdword;

  // Search negative form
  isNegative = '0';
  if (/not|no /i.test(phrase)) { isNegative = '1'; }

  // Search question form
  isQuestion = '0';
  if (/^(how|what|where|when|why)/i.test(phrase)) { isQuestion = '1'; }

  //bot.say('phrase:'+phrase+', isNegative:'+isNegative+', isQuestion:'+isQuestion);

  // firstword --------------------------------------------
  // hello
  if (/^(hello|salut|bonjour)/i.test(firstword)) {
    bot.say('Hello %s, how are you?', trigger.personDisplayName);

  // Reply the time to 'time'
  } else if (/^time/i.test(firstword)) {
    var currentdate = new Date();
    var time = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    bot.say('It\'s %s!', time);

  // Reply the date to 'date'
  } else if (/^date/i.test(firstword)) {
    var currentdate = new Date();
    var date = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear();
    bot.say('We\'re the %s!', date);

  // Reply 'don't congrate...'  to 'congrats'
  } else if (/congrats/i.test(firstword)) {
    bot.say('Don\'t congrate me but should be the dev community ;D');

  // phrase -----------------------------------------------
  // nice|good|well
  } else if (/(nice|good|well|happy)/i.test(phrase)) {
    if (isNegative == '1') { bot.say('Sorry for you :('); }
    else { bot.say('Good :)'); }

  // /bad|sick|vomit/
  } else if (/(bad|sick|vomit)/i.test(phrase)) {
    if (isNegative == '0') { bot.say('Sorry for you :('); }
    else { bot.say('Good :)'); }

  // Reply 'it's a pleasure, do not hesiatet' to 'thanks'
  } else if (/(thanks|danke|merci)/i.test(phrase)) {
    bot.say('It\'s a peasure, do not hesitate!');

  // Default reply
  } else {
    if (isQuestion == '1') { bot.say('Sorry but I\'ve not hunderstood your question, can  you rephrase it please?'); }
    //else { bot.say('Sorry but I\'ve not hunderstood, can  you rephrase it please?'); }
    //bot.say('You see a shimmering light, but it is growing dim');
  }
};


