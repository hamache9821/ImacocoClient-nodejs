"use strict";

const config = require('config')
    , gpsd = require('node-gpsd');

//必須設定チェック
if (!config.gpsd_device) {throw 'config `gpsd_device` is not set';}
if (!config.gpsd_port)   {throw 'config `gpsd_port` is not set';}
if (!config.gpsd_pid)    {throw 'config `gpsd_pid` is not set';}
if (!config.post_url)    {throw 'config `post_url` is not set';}
if (!config.post_userid) {throw 'config `post_userid` is not set';}
if (!config.post_passwd) {throw 'config `post_passwd` is not set';}
if (!config.post_timer)  {throw 'config `post_timer` is not set';}

const daemon = new gpsd.Daemon({
    program: 'gpsd',
    device   : config.gpsd_device,
    port     : config.gpsd_port,
    pid      : config.gpsd_pid,
    readOnly : false,
    logger   : {
        info : function() {},
        warn : console.warn,
        error: console.error
    }
});

const listener = new gpsd.Listener({
    port     : config.gpsd_port,
    hostname : 'localhost',
    logger   : {
        info  : function() {},
        warn  : console.warn,
        error : console.error
    },
    parse: true
});

/*
daemon.logger = new (winston.Logger) ({ exitOnError: false });
listener.logger = new (winston.Logger) ({ exitOnError: false });;
*/

daemon.start(function() {
    console.log('Started');
});

/*
daemon.stop(function() {
    console.log('Stopped');
});
*/

listener.connect(function() {
    console.log('Connected');
});

/*
listener.disconnect(function() {
    console.log('Disconnected');
});
*/




