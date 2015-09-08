var utils = require('./utils.js');
var gea = require("gea-sdk");
var adapter = require("gea-adapter-usb");

// configure address
var app = gea.configure({
    address: 0xE4,
    version: [ 0, 0, 1, 0 ]
});
var filename = utils.getLogName("pepe");

var message =
{
  command: 0x10,
  source: 0x56,
  destination:0x12,
  data:[34, 0x34, 56]
}

utils.initLogFile(filename);
configData = utils.loadConfigFile("./config.json");

// bind to the adapter to access the bus
//app.bind(adapter, function (bus) {
    console.log("Bind was successful");

    // listen for messages on the bus
  // bus.on("message", function (message) {
       if(utils.valueInArray(message.command, configData.commands))
       {
          var message = utils.messageToHexString(message);
          console.log("message:", message);
          utils.addRecordToLogFile(filename, message.command, message.source, message.destination, message.data);
       }
  // });
//});
