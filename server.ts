import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';

import * as express from 'express';
import * as compression from 'compression';
import * as request from 'request';
import * as rwlock from 'rwlock';
import * as scraper from 'steam-scraper';
import * as schedule from 'node-schedule';

const lock = new rwlock();

import { join, resolve } from 'path';
import { readFileSync, readFile, writeFile, mkdir, existsSync } from 'fs';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();
app.use(compression());

const PORT = process.env.PORT || 5000;
const DIST_FOLDER = join(process.cwd(), 'dist');

const STEAM_KEY = process.env.steamKey || "";

// Our index.html we'll use as our template
const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();

const cacheName = join(DIST_FOLDER, '/game-cache/');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.bundle');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP)
    ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

app.get('/api/steam/CollectionDetails/:collectionID', (req, res) => {
    var url = `https://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1/`;

    request.post(url, { form: { key: STEAM_KEY, collectioncount: 1, publishedfileids: [req.params.collectionID] } }, (err, steamRes, body) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
    });

});

app.get('/api/steam/WorkshopDetails/:workshopID', (req, res) => {
    var url = `https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/`;

    request.post(url, { form: { key: STEAM_KEY, itemcount: 1, publishedfileids: [req.params.workshopID] } }, (err, steamRes, body) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
    });

});

app.get('/api/steam/GetOwnedGames/:steamId', (req, res) => {
    var url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/`;
    var args = constructGetArgs({ key: STEAM_KEY, steamid: [req.params.steamId], include_appinfo: 1, include_played_free_games: 1 });

    request.get(url + args, (err, steamRes, body) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
    });

});

app.get('/api/steam/GetPlayerSummaries/:steamId', (req, res) => {
    var url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/`;
    var args = constructGetArgs({ key: STEAM_KEY, steamids: [req.params.steamId] });

    request.get(url + args, (err, steamRes, body) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
    });

});

app.get('/api/steam/ResolveVanityURL/:vanity', (req, res) => {
    var url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/`;
    var args = constructGetArgs({ key: STEAM_KEY, vanityurl: [req.params.vanity], url_type: 1 });

    request.get(url + args, (err, steamRes, body) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
    });
});

app.get('/api/steam/GetFriendList/:steamId', (req, res) => {
    var url = `https://api.steampowered.com/ISteamUser/GetFriendList/v1/`;
    var args = constructGetArgs({ key: STEAM_KEY, steamid: [req.params.steamId], relationship: 'friend' });

    request.get(url + args, (err, steamRes, body) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
    });
});

app.get('/api/steam/GetGame/:appId', (req, res) => {
    checkCache(req.params.appId, (val => {
        if (val) {
            res.setHeader('Content-Type', 'application/json');
            res.send(val);
        } else {
            scraper.getData(req.params.appId, (err, data) => {
                if (!err && data) {
                    writeToCache(req.params.appId, data, (val => {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(val);
                    }));
                } else {
                    console.log('Failed to get data for ' + req.params.appId);

                    //If anything fails just send nothing
                    res.setHeader('Content-Type', 'application/json');
                    res.send(null);
                }
            });
        }
    }));
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
    maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
    res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
    console.log(`Node Express server listening on http://localhost:${PORT}`);

    checkOnStart();
});

function checkOnStart() {
    if (!existsSync(cacheName)) {
        mkdir(cacheName, (err) => {
            if (err) {
                console.log(err);
            } else {
                checkForUpdates();
            }
        });
    }
}

//Schedule every sunday to checkForUpdates
var updateCheck = schedule.scheduleJob('5 8 * * 0', function () {
    checkForUpdates();
});

function checkForUpdates(forceUpdate?) {
    console.log('Checking for updates...');

    var url = `https://api.steampowered.com/IStoreService/GetAppList/v1/`;
    var args = constructGetArgs({ key: STEAM_KEY, include_games: 1, max_results: 50000 });

    grabApps(url + args).then(async (apps) => {
        console.log('Found ' + apps.length + ' apps!');

        for (let app of apps) {
            //We want to traverse one after the other
            await checkApp(app, forceUpdate).then(() => { }).catch(err => console.log(err));
        }

        console.log('Finished checking for updates!');
    }).catch(err => console.log(err));
}

function grabApps(url): Promise<any> {
    return new Promise((resolve, reject) => {
        request.get(url, (err, steamRes, body) => {
            if (err) {
                reject(err);
            } else {
                //Parse data
                var json = JSON.parse(body);

                if (json["response"] && json["response"].apps) {
                    resolve(json["response"].apps);
                } else {
                    reject(`Couldn't get a list of apps!`);
                }
            }
        });
    });
}

function checkApp(app, forceUpdate?): Promise<any> {
    return new Promise((resolve, reject) => {
        checkCache(app.appid, (data) => {
            if (data) {
                //We already have data for this app
                //Compare the last_modified with the timestamp of wehn we got the data

                if (app.last_modified > Math.floor(data.timestamp / 1000)) {
                    //If the app has changed since then get new data
                    scraper.getData(app.appid, (err, newData) => {
                        if (!err && newData) {
                            //Write the new data to cache
                            writeToCache(app.appid, newData, (val => {
                                resolve();
                            }));
                        } else {
                            reject('Failed to get data for ' + app.appid);
                        }
                    });

                } else {
                    //We already have the 'latest' data for this
                    //This doesn't include review updates

                    if (forceUpdate) {
                        //Get the data anyway

                        scraper.getData(app.appid, (err, newData) => {
                            if (!err && newData) {
                                //Write the new data to cache
                                writeToCache(app.appid, newData, (val => {
                                    resolve();
                                }));
                            } else {
                                reject('Failed to get data for ' + app.appid);
                            }
                        });
                    } else {
                        resolve();
                    }
                }
            } else {
                //Don't have data in the cache
                scraper.getData(app.appid, (err, newData) => {
                    if (!err && newData) {
                        //Write the new data to cache
                        writeToCache(app.appid, newData, (val => {
                            resolve();
                        }));
                    } else {
                        reject('Failed to get data for ' + app.appid);
                    }
                });
            }
        });
    });
}

function checkCache(key, cb) {
    var gameCache = join(cacheName, key + '.json');

    readFile(gameCache, 'utf8', (err, fileData) => {
        if (err) {
            //Check if the error is different than not existing
            if (err.code !== 'ENOENT') {
                console.error(err);
            }
            
            cb(null);
        } else {
            //File exists so read it
            var json = JSON.parse(fileData);

            if (json) {
                //Use what is in the cache
                cb(json);
            } else {
                cb(null);
            }
        }
    });
}

function writeToCache(key, data, cb) {
    var gameCache = join(cacheName, key + '.json');

    var json = data;
    json.timestamp = Date.now();

    //We dont care if the file already exists
    //Just write the file
    writeFile(gameCache, JSON.stringify(json), 'utf8', (err) => {
        if (err) {
            console.error(err);
            cb(null);
        } else {
            //File was saved
            //Then trigger callback
            cb(json);
        }
    });
}

function constructGetArgs(args) {
    var params = "?";

    var i = 0;
    for (var k in args) {
        if (args.hasOwnProperty(k)) {
            params += `${i === 0 ? k : '&' + k}=${args[k]}`;
        }
        i++;
    }

    return params;
}