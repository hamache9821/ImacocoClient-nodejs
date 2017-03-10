# ImacocoClient-nodejs
----
### なにこれ
nodejsで今ココにpostするやつ  
* 秒速1.7mで移動するRaspi2の実験用途  


### 動作環境  
* Node.js の動くraspi2 + 3GPiのGPS  
* NMEA-0183形式でGGAセンテンスを1Hzでttyに吐き続けるGPSモジュールだと何でもいけるはず  

### 動かす  

* config/default.json をいい感じに編集すること


```sh
$ git clone https://github.com/hamache9821/ImacocoClient-nodejs.git
$ cd ImacocoClient-nodejs
$ npm install
$ npm start
```


