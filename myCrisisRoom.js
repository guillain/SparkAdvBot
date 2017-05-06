/**
 * @file Defines Search functions for Spark
 * @author guillain guillain@gmail.com
 * @license GPL-3.0
 */

exports.help = function(bot) {
  var help = '**Crisis Room** \n\n';
  help += '@ [crisisroom|cr] [open|close|help] \n';
  help += '* @ crisisroom open \n';
  help += '* @ cr close \n';
  bot.say(help);
};

// The Flint mgr event
exports.CrisisRoom = function (bot, trigger) {
  // Remove the first two args
  trigger.args.splice(0,2);
  
  if      (/help/i.test(trigger.args['0'])) { module.exports.help(bot); }
  else if (/open/i.test(trigger.args['0'])) { openCrisisRoom(bot,trigger); }
  else if (/close/i.test(trigger.args['0'])){ closeCrisisRoom(bot,trigger); }
  else    { bot.say('I\'ve not understood your command for the Crisis Room'); }
};

// The Flint event is expecting a function that has a bot, person, and id parameter.
checkinCrisisRoom = function (eventBot, person, id) {
  // retrieve value of key 'crisisRoom'. When this is ran initially, this will return 'undefined'.
  var crisisRoom = eventBot.recall('crisisRoom');

  // if room bot has crisisRoom.enabled...
  if(eventBot && eventBot.active && crisisRoom.enabled) {
    // wait 5 seconds, add person back, and let them know they can never leave!
    setTimeout(() => {
      var email = person.emails['0'];
      var name = person.displayName.split(' ')['0']; // reference first name

      // add person back to room...
      eventBot.add(email);

      // let person know  where they ended up...
      eventBot.say('<@personEmail:%s|%s>, you can **check out any time you like**, but you can **never** leave!', email, name);
    }, 5000); // 5000 ms = 5 seconds
  }
};

// Recall crisisRoom 
exports.recallCrisisRoom = function (bot) {
  // retrieve value of key 'crisisRoom'. When this is ran initially, this will return 'undefined'.
  var crisisRoom = bot.recall('crisisRoom');

  // if enabled...
  if(crisisRoom && crisisRoom.enabled) {
    // resume event
    bot.on('personExits', checkinCrisisRoom);
  }
  return crisisRoom;
};

openCrisisRoom = function (bot,trigger) {
  var crisisRoom = bot.recall('crisisRoom');

  // if crisisRoom has not been initialized to bot memory...
  if(!crisisRoom) {
    // init key
    crisisRoom = bot.store('crisisRoom', {});

    // store default value
    crisisRoom.enabled = false;
  }

  // if not enabled...
  if(!crisisRoom.enabled) {
    crisisRoom.enabled = true;

    // create event
    bot.on('personExits', checkinCrisisRoom);

    // announce crisisRoom is open
    bot.say('**Crisis Room** mode activated!');
  } else {
    // announce crisisRoom is already open
    bot.say('**Crisis Room** mode is already activated!');
  }
};

closeCrisisRoom = function (bot,trigger) {
  // retrieve value of key 'crisisRoom'. When this is ran initially, this will return 'undefined'.
  var crisisRoom = bot.recall('crisisRoom');

  if(crisisRoom && crisisRoom.enabled) {
    crisisRoom.enabled = false;

    // remove event (removeListener is an inherited function from EventEmitter)
    bot.removeListener('personExits', checkinCrisisRoom);

    // announce crisisRoom is closed
    bot.say('**Crisis Room** mode deactivated!');
  } else {
    // announce crisisRoom is already closed
    bot.say('**Crisis Room** mode is already deactivated!');
  }
};
