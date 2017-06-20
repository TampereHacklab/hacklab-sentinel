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

If using Mosquitto MQTT broker, make sure that version is at least 1.4.12. Currently Mosquitto MQTT broker version in Ubuntu repositories is 1.4.10 which cannot handle MQTT messages trough websockets fast enough.

[https://nyarlathotep.dy.fi/sentinel/realtime](https://nyarlathotep.dy.fi/sentinel/realtime) should be accessible for testing.
