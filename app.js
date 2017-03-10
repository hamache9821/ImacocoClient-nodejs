"use strict";

const config = require('config')
    , sp  = require('serialport')
    , GPS = require('gps')
    , http = require('http')
    , querystring = require('querystring')
    , moment = require('moment-timezone');

var cnt = 0;

if (!config.gps_device)     {throw 'config `gps_device` is not set';}
if (!config.gps_baudrate)   {throw 'config `gps_baudrate` is not set';}
if (!config.post_hostname)  {throw 'config `post_hostname` is not set';}
if (!config.post_path)      {throw 'config `post_path` is not set';}
if (!config.post_port)      {throw 'config `post_port` is not set';}
if (!config.post_userid)    {throw 'config `post_userid` is not set';}
if (!config.post_passwd)    {throw 'config `post_passwd` is not set';}
if (!config.post_timer)     {throw 'config `post_timer` is not set';}

const port =
    new sp.SerialPort(config.gps_device, {
      baudrate : config.gps_baudrate,
      parser   : sp.parsers.readline('\r\n')
    })
   , gps = new GPS;


port.on('data', function(data) {
  gps.update(data);
});


gps.on('data', function(data) {
    switch (data.type){
        case 'GGA':
            cnt ++;

            if (cnt >= config.post_timer){
                cnt = 0;
                var qs = querystring.stringify({
                    time : moment(data.time).tz("Asia/Tokyo").format(),
                    lat  : data.lat,
                    lon  : data.lon,
                    gpsq : data.quality,
                    gpsn : data.satelites,
                    gpsh : data.alt,
                    gpsd : data.hdop,
                    gpsv : data.geoidal,
                    save : 0,
                    t    : 0
                });

                var url = {
                        host : config.post_hostname,
                        path : config.post_path,
                        port : config.post_port,
                        method : 'POST',
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Content-Length': qs.length
                        },
                        auth : config.post_userid + ':' + config.post_passwd
                    };

                    var req = http.request(url, function (res) {
                        res.on('data', function (chunk) {
                            console.log(moment(data.time).tz("Asia/Tokyo").format() + ' res:' + chunk.toString());

                        }).on('error', function (e) {
                            console.log('ERROR:' + e.stack);
                        });
                    });

                    req.write(qs);
                    req.end();
            }
        default:
    }
});
