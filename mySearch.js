/**
 * @file Defines Search functions for Spark
 * @author guillain guillain@gmail.com
 * @license GPL-3.0
 */

// Load config
var config = require('./config');

exports.help = function(bot){
  var help = '**Search** \n\n';
  help += '_Description_ : Search engine that include as sources hub, web engine, CSV, SQL and NoSQL \n\n';
  help += '_Commands_ : @ [search|s] [*|help] \n\n';
  help += '* @ search How can I use it? \n\n';
  help += '* @ search in www.google.fr limit 15 lang fr age d5 I search something... \n\n';
  help += '* @ search limit 20 15 lang fr age d5 [image|video|hub] What time is it? \n\n';
  help += '* @ search image The toto\'s face \n\n';
  help += '* @ search video The cat on the wall \n\n';
  help += '* @ search hub How can I contact my IT? \n\n';
  help += '_Shortcut_ : \n\n';
  help += '* @ s image My car \n\n';
  help += '* @ s video My holidays \n\n';
  help += '* @ s hub My news \n\n';
  bot.say(help);
};

printParams = function (bot,query,host,limit,lang,age,searchHub,searchImage,searchVideo) {
  // create and complete search params msg
  params = '**Search Params** \n\n';
  params += '* host or in: '+host+'\n';
  params += '* limit: '+limit+'\n';
  params += '* lang: '+lang+'\n';
  params += '* age: '+age+'\n';
  params += '* hub: '+searchHub+'\n';
  params += '* image: '+searchImage+'\n';
  params += '* video: '+searchVideo+'\n';
  params += '* query: '+query+'\n\n';
  bot.say(params);
};

buildPhrase = function (args, offset){
  phrase = '';
  for (i = offset; i < args.length; i++) {
    phrase += ' '+args[i];
  }
  return phrase;
};

exports.search = function (bot,trigger) {
    var tosay = '';
    var error = '';

    // Remove the first two args
    trigger.args.splice(0,2);
    var paramslength = trigger.args.length;

    // retrieve value of key 'htc'. When this is ran initially, this will return 'undefined'.
    var htc = bot.recall('htc');

    console.log('>>> args: ' + trigger.args);

    // default search param
    var query = buildPhrase(trigger.args,0);
    var host = config.search.host;
    var limit = config.search.limit;
    var lang = config.search.lang;
    var age = config.search.age;
    var searchImage = config.search.image;
    var searchVideo = config.search.video;
    var searchHub = config.search.hub;

    // No params
    if ( query == '' ) { error += '* No parameter found'; }

    // help
    else if ( trigger.args['0'] == 'help' ) { 
      module.exports.help(bot); 
      printParams(bot,query,host,limit,lang,age,searchHub,searchImage,searchVideo);
      return;

    // Parse params
    } else {
      for (i = 0; i < paramslength; i++) {
        if      ( /image/i.test(trigger.args[i]) ) { searchImage = '1'; query = buildPhrase(trigger.args,i+1); }
        else if ( /video/i.test(trigger.args[i]) ) { searchVideo = '1'; query = buildPhrase(trigger.args,i+1); }
        else if ( /hub/i.test(trigger.args[i]) )   { searchHub = '1'; query = buildPhrase(trigger.args,i+1); }
        else if ( /lang/i.test(trigger.args[i]) )  { lang = trigger.args[i+1]; i++; i++; }
        else if ( /age/i.test(trigger.args[i]) )   { age = trigger.args[i+1]; i++; i++; }
        else if ( /limit/i.test(trigger.args[i]) ) { 
          if    ( trigger.args[i+1] > 9 )          { limit = trigger.args[i+1]; i++; }
          else  { error += '* limit can\'t be under 10, found: '+trigger.args[i+1]+'\n\n'; i++; }
        }
        else if ( /host|in/i.test(trigger.args[i])){
          if    ( /^www.*/i.test(trigger.args[i+1]) ) { host = trigger.args[i+1]; i++; }
          else  { error += '* host param must be the service url, ie www.google.fr, found: '+trigger.args[i+1]+'\n\n'; i++; }
        } else  {
          if (i == 0) {
            query = trigger.args[i];
          } else {
            query += ' '+trigger.args[i];
          }
        }
      }
  
      // create and complete output msg with the search params
      printParams(bot,query,host,limit,lang,age,searchHub,searchImage,searchVideo);
      tosay += 'Search Results: \n';
      bot.say(tosay);

      // Hub
      if (searchHub == '1') {
        bot.say('No connectivity to the HUB search engine for the moment...');

      // Image
      } else if (searchImage == '1') {
        const ImagesClient = require('google-images');
        const client = new ImagesClient(config.search.google_cse_key, config.search.google_api_key);
        client.search(query, {
          page: 1
        })
          .then(function (images) {
            console.log(images);
            var tosay = '';
            for(var i = 0; i < images.length; i++) {
              txt  = '* width:'+images[i].width+', height:'+images[i].height+', size:'+images[i].size+'\n';
              txt += '* url:'+images[i].url;
              bot.say({markdown: txt, file: images[i].thumbnail['url']});
            }
          });

      // Video
      } else if (searchVideo == '1') {
          bot.say('No video search engine for the moment...');

      // Default
      } else {
        var scraper = require('google-search-scraper');
        var options = {
          query: query,
          host: host,
          limit: limit,
          lang: lang,
          age: age,
        };
        scraper.search(options, function(err, url) {
          bot.say('* '+url);
        });
      }
    }
};
