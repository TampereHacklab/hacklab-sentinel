# README #
Technology:
javascript/node.js express framework
SQLite/sequelize
mqtt

After cloning repository, run

```
npm update

```
which will download everything needed. Then copy db.sqlite from test_db to root folder.

Then run

```
NODE_ENV=development npm start

```
Or install nodemon with following command(does need sudo on Linux)
```
npm install -g nodemon
```
After that you can use following command to run hacklab sentinel, in a way that it will automatically restart server if files are changed
```
./start.sh
```
Of if you are running Windows, you can use
```
start.bat
```
Then point your browser to
[http://localhost:3000](http://localhost:3000)

datasource.py in raspberry-pi can be used to input data into system. Paho MQTT client must be installed first.
```
python3 datasource.py DC1 0 low
```
Command above will send to broker message that datacollector 1(raspberry) input 0 is low, and server will receive that and determine what to do with that. inputs range from 0 to 7 and input can be low or high. 

[https://nyarlathotep.dy.fi/sentinel/realtime](https://nyarlathotep.dy.fi/sentinel/realtime) should be accessible for testing.
