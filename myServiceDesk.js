/**
 * @file Defines ServiceDesk functions for Spark
 * @author guillain guillain@gmail.com
 * @license GPL-3.0
 */

// Load config
var config = require('./config');

var redis = require("redis");
var client = redis.createClient({detect_buffers: true});

var Search = require('redis-search');
var search = Search.createSearch(config.SD.storage);

var fs = require('fs');

exports.help = function(bot) {
  var help = '**Service Desk** \n\n';
  help += '@ [servicedesk|sd] [*|loadcsv|testcsv|help] \n';
  help += '* @ servicedesk WebEx meeting \n';
  help += '* @ sd WebEx delegation \n\n';
  help += '_Admin tools_ \n';
  help += '* @ sd loadcsv \n';
  help += '* @ sd testcsv \n';
  bot.say(help);
};

exports.servicedesk = function (bot, trigger) {
  // Remove the first two args
  trigger.args.splice(0,2);
  
  if      (/help/i.test(trigger.args['0']))      { module.exports.help(bot); }
  else if (/^loadcsv$/i.test(trigger.args['0'])) { loadcsv(bot, trigger); }
  else if (/^testcsv$/i.test(trigger.args['0'])) { testcsv(bot, trigger); }
  else {                                          mysearch(bot, trigger); }
};

mysearch = function(bot, trigger) {
  j = 0;
  var phrase = '';
  var tosay = 'Search result \n';
  for (i = 0; i < trigger.args.length; i++) {
    if(i == 0) { phrase  = trigger.args[i]; }
    else       { phrase += ' '+trigger.args[i]; }
  }

  client.hgetall(config.SD.storage, function(err,kms){
    if (err) throw err;
    for (var i in kms) { 
      //console.log('>>> i:'+i+', kms[i]:'+kms[i]);
      var re =  new RegExp('\\b'+ phrase + '\\b','i');
      if(re.exec(kms[i])) { 
        console.log('Found :'+kms[i]);
        if (j < config.SD.searchlimit) { tosay += '- '+kms[i]+'\n'; }
        j++;
      }
    }
    tosay += '\nOn '+j+' result found, limited to '+config.SD.searchlimit+' entry\n';
    bot.say(tosay);
  });
  /*
  search.query(phrase, function(err, ids){
    if (err) throw err;
    console.log('Search results for "%s":', phrase);
    console.log(ids);
    if (ids.length != 0) {
      tosay = 'Found \n';
      for(var i in ids) { tosay += '- '+ids[i]+'\n'; }
      bot.say(tosay);
    } else { bot.say('Not found'); }
  });
  */
}

loadcsv = function(bot, trigger){
  // Parse CSV file and set value in redis
  fs.readFile(config.SD.csv, function(err, data) {
    if(err) throw err;
    var strs = [];
    var array = data.toString().split("\n");
    for(i = 0; i < array.length - 1; i++) {
      lineArr = array[i].split(';');
      strs.push(lineArr[0], lineArr[1]);
      //console.log('>>> i:'+i+', key:'+lineArr[0]+', txt:'+lineArr[1]);
    }
    client.del(config.SD.storage, redis.print);
    client.hmset(config.SD.storage, strs, redis.print);
    bot.say('Nb of row imported:'+i);
  });
}

testcsv = function(bot, trigger) {
  client.get('13121', function (err, km) {
    if (km) { bot.say('* km 13121 found:'+km); }
    else { bot.say('* km 13121 not found'); }
  });

  client.hget(config.SD.storage, '13121', function (err, kms) {
    if (kms) { bot.say('* km '+config.SD.storage+' found:'+kms); }
    else { bot.say('* km '+config.SD.storage+' not found'); }
  });
}
