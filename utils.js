var csv = require('ya-csv');
var fs = require('fs');

module.exports =
{
   getLogName: function()
   {
      var filename = 'bustraffic';

      if(arguments.length > 0)
      {
         filename = arguments[0] + "_" + filename;
      }

      var now = new Date();
      var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds() ];
      var dateMaxId = date.length - 1;

      for ( var i = 0; i < dateMaxId; i++ ) {
         date[i] = this.padWithZeros(date[i], 2)
      }

      date[dateMaxId] = this.padWithZeros(date[dateMaxId], 3);

      return filename + "_" + date.join("_") + ".csv";
   },
   getMilitaryTime: function()
   {
      var now = new Date();
      var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
      var timeMaxId = time.length - 1;

      for ( var i = 1; i < timeMaxId; i++ ) {
         time[i] = this.padWithZeros(time[i], 2)
      }

      return time.join(":");
   },
   padWithZeros: function(value, size)
   {
      return(new Array(size + 1).join('0') + value).slice(-size)
   },
   initLogFile: function(name)
   {
      var writer = csv.createCsvStreamWriter(fs.createWriteStream(name, {'flags': 'w'}), {'quote': ''});
      writer.writeRecord([ 'Time', 'Command',	'Source', 'Destination', 'Data_Length', 'Data']);
   },
   addRecordToLogFile: function(name, cmd, src, dst, data)
   {
      var writer = csv.createCsvStreamWriter(fs.createWriteStream(name, {'flags': 'a'}), {'quote': ''});
      var record = [ this.getMilitaryTime(), cmd,	src, dst, data.length.toString() ];
      writer.writeRecord(record.concat(data));
   },
   loadConfigFileAsync: function(filename, callback)
   {
      fs.readFile(filename, 'utf8', function (err, data) {
         if (err) throw err;
         var jsonData = JSON.parse(data);
         console.log("--------------Config File --------");
         var commands = '';
         for (var i = 0; i < jsonData.commands.length; ++i) {
           commands = commands + jsonData.commands[i] + ", "
         }
        console.log("Commands:"+commands);
        console.log("----------------------------------------");
        callback(err, jsonData);
      });
   },
   loadConfigFile: function(filename)
   {
      var jsonData = require(filename);
      console.log("--------------Config File --------");
      var commands = '';
      for (var i = 0; i < jsonData.commands.length; ++i) {
        commands = commands + jsonData.commands[i] + ", "
        jsonData.commands[i] = this.hexToByte(jsonData.commands[i]);
      }
      console.log("Commands:"+commands);
      console.log("----------------------------------------");
      return jsonData;
   },
   valueInArray: function(value, array)
   {
     return(array.indexOf(value) > -1);
   },
   hexToByte:function(hex)
   {
     return(new Buffer(hex.slice(-2), 'hex')[0]);
   },
   byteToHex: function(value)
   {
     var buffer = new Buffer(1);
     buffer[0] = value;
     return(buffer.toString('hex'));
   },
   messageToHexString: function(msg)
   {
     var dataLength = msg.data.length;
     var data = [];
     for (var i=0; i < dataLength; i++) {
       data[i] = this.byteToHex(msg.data[i]);
     }
     return {
       "command":this.byteToHex(msg.command),
       "destination":this.byteToHex(msg.destination),
       "source":this.byteToHex(msg.source),
       "data": data};
   }
}
