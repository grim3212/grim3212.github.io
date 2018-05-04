import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BigNumber } from 'bignumber.js';
import { ToastrService } from 'ngx-toastr';

import { Options, Category, Genre } from './data/options';

@Component({
    selector: 'app-game-compare',
    templateUrl: './game-compare.component.html',
    styleUrls: ['./game-compare.component.css']
})
export class GameCompareComponent implements OnInit {

    //An array of selected friend steam ids
    selectedFriends: string[] = [];

    filteredGames: any[] = [];

    comparing = false;

    options: Options = new Options();

    currentProfile: {
        steam32: string,
        steam64: string,
        steamLegacy: string,
        profile: any,
        friends: any,
        games: any
    };

    private bannedAppIds: number[] = [205790, 644, 223530, 216370, 225770];
    private conversion: BigNumber = new BigNumber('76561197960265728');

    constructor(private http: HttpClient, private toastr: ToastrService) {
    }

    ngOnInit() {
    }

    get categories() {
        return Category.CATS;
    }

    get genres() {
        return Genre.GENRES;
    }

    add(message: string): void {
        this.toastr.error(message, 'Error', { progressBar: true, positionClass: 'toast-top-center' });
    }

    buildFriendArray(friends, numColumns: number) {
        friends.sort((a, b) => {
            return a.profile.personaname.localeCompare(b.profile.personaname);
        });

        //Finally build the array
        const arrOfarr = [];
        for (let i = 0; i < friends.length; i += numColumns) {
            const row = [];
            for (let x = 0; x < numColumns; x++) {
                const value = friends[i + x];
                if (!value) {
                    break;
                }

                row.push(value);
            }
            arrOfarr.push(row);
        }
        return arrOfarr;
    }

    buildGameArray(games, numColumns: number) {
        //First filter out any games not matching the filter
        games = games.filter((game) => {
            if (this.options.category.id !== Category.NotSelected.id) {
                if (game.data.categories.includes(this.options.category.name)) {
                    if (this.options.genre.id !== Genre.NotSelected.id) {
                        return game.data.genres.includes(this.options.genre.name);
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            } else {
                if (this.options.genre.id !== Genre.NotSelected.id) {
                    return game.data.genres.includes(this.options.genre.name);
                } else {
                    return true;
                }
            }
        });

        //Then sort the games remaining
        games.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        //Finally build the array
        const arrOfarr = [];
        for (let i = 0; i < games.length; i += numColumns) {
            const row = [];
            for (let x = 0; x < numColumns; x++) {
                const value = games[i + x];
                if (!value) {
                    break;
                }
                value.imgsrc = 'https://steamcdn-a.opskins.media/steam/apps/' + value.appid + '/header.jpg';

                row.push(value);
            }
            arrOfarr.push(row);
        }
        return arrOfarr;
    }

    getSteamProfile(form) {
        this.currentProfile = null;
        const steamid = form.value.steamid;

        if (steamid) {
            this.convertSteamId(steamid)
                .then(data => {
                    this.getProfile(data.steam64)
                        .then(profileData => {
                            this.getFriends(data.steam64)
                                .then(friendData => {
                                    this.getGames(data.steam64)
                                        .then(gameData => {
                                            this.currentProfile = {
                                                steam64: data.steam64,
                                                steam32: data.steam32,
                                                steamLegacy: data.steamLegacy,
                                                profile: profileData,
                                                friends: friendData,
                                                games: gameData
                                            };
                                        })
                                        .catch(gameErr => {
                                            this.add(gameErr);
                                        });
                                })
                                .catch(friendErr => {
                                    this.add(friendErr);
                                });
                        })
                        .catch(profileErr => {
                            this.add(profileErr);
                        });
                })
                .catch(err => {
                    this.add(err);
                });
        } else {
            //This shouldn't happen
            this.add('Input cannot be blank!');
        }
    }

    filterGames(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.filteredGames = [];

            const toCheck = [];

            const promises = [];

            for (const id of this.selectedFriends) {
                const friend = this.getFriendFromId(id);

                //Make sure we have already got games for this friend
                if (friend.games) {
                    //Push each list into a temp array
                    toCheck.push(friend.games);
                } else {
                    console.error(`Friend didn't have games ${friend.profile.personaname}`);
                }
            }

            //We start by looking over the current profiles games
            for (const game of this.currentProfile.games.games) {
                let allContained = true;

                //Dont include tools / tests
                if (this.bannedAppIds.includes(game.appid)) {
                    continue;
                }

                for (const friend of toCheck) {
                    let foundGame = false;

                    for (const friendGame of friend.games) {

                        if (game.appid === friendGame.appid) {
                            foundGame = true;
                        }
                    }

                    if (!foundGame) {
                        allContained = false;
                        break;
                    }
                }

                if (allContained) {
                    promises.push(new Promise((subResolve, subReject) => {
                        //Make sure we are passing a string
                        this.getAppDetails(String(game.appid))
                            .then(data => {
                                const gameCopy = game;
                                gameCopy.data = data;

                                //If we make it this far then add the game to the filtered list
                                this.filteredGames.push(gameCopy);

                                subResolve();
                            }).catch(err => {
                                //Don't need to fail. We just wont include the game
                                console.warn(err);
                                subResolve();
                            });
                    }));
                }
            }

            Promise.all(promises)
                .then(data => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    compareGames() {
        const promises = [];

        //First grab each game list from selected friends
        for (const id of this.selectedFriends) {
            const friend = this.getFriendFromId(id);

            //Check if we have already got games for this friend
            if (!friend.games) {
                promises.push(new Promise((resolve, reject) => {
                    this.getGames(friend.steamid)
                        .then((data) => {
                            friend.games = data;
                            this.updateFriend(friend);

                            resolve();
                        }).catch(err => {
                            reject(err);
                        });
                }));
            } else {
                //We have already gotten games for this friend and don't need to continue
            }
        }

        Promise.all(promises)
            .then(data => {
                //Filtering / sorting
                this.comparing = true;

                //Based off default filter
                this.filterGames()
                    .then(val => {
                        console.log('Finished filtering');
                    }).catch(err => {
                        this.add(err);
                    });
            })
            .catch(err => {
                this.add(err);
            });
    }

    updateFriend(newFriend) {
        for (let friend of this.currentProfile.friends) {
            friend = newFriend;
        }
    }

    getFriendFromId(steamid) {
        for (const friend of this.currentProfile.friends) {
            if (friend.steamid === steamid) {
                return friend;
            }
        }
    }

    toggleFriend(friend) {
        if (this.selectedFriends) {
            if (this.selectedFriends.includes(friend.steamid)) {
                //Remove it since it is already contained
                const index = this.selectedFriends.indexOf(friend.steamid);
                if (index > -1) {
                    this.selectedFriends.splice(index, 1);
                } else {
                    console.error(`Couldn't find friend in selection with steam id ${friend.steamid}`);
                }
            } else {
                //Add it since it isn't in the list
                if (this.selectedFriends.length <= 5) {
                    this.selectedFriends.push(friend.steamid);
                } else {
                    this.add(`Too many friends have been selected! Only a max of 5!`);
                }
            }
        }
    }

    getAppDetails(appId): Promise<any> {
        return new Promise((resolve, reject) => {

            const headers = new HttpHeaders({
                'Content-Type': 'application/json'
            });

            this.http.get(`/api/steam/GetGame/${appId}`, { headers: headers }).subscribe(data => {
                if (data) {
                    //Success
                    resolve(data);
                } else {
                    //Couldn't find profile from Steam ID
                    reject(`No data for Steam App [${appId}]!`);
                }
            });
        });
    }

    getProfile(steamId): Promise<any> {
        return new Promise((resolve, reject) => {

            const headers = new HttpHeaders({
                'Content-Type': 'application/json'
            });

            this.http.get(`/api/steam/GetPlayerSummaries/${steamId}`, { headers: headers }).subscribe(data => {

                if (data['response']) {
                    if (data['response'].players.length == 1) {
                        //Success
                        resolve(data['response'].players[0]);
                    } else {
                        //Couldn't find profile from Steam ID
                        reject(`Couldn't find Steam Profile!`);
                    }
                } else {
                    reject(`Couldn't find Steam Profile!`);
                }
            });
        });
    }

    getFriends(steamId): Promise<any> {
        return new Promise((resolve, reject) => {

            const headers = new HttpHeaders({
                'Content-Type': 'application/json'
            });

            this.http.get(`/api/steam/GetFriendList/${steamId}`, { headers: headers }).subscribe(data => {
                if (data['friendslist']) {

                    const friends = data['friendslist'].friends;

                    for (const friend of friends) {
                        this.getProfile(friend.steamid)
                            .then(profileData => {
                                friend.profile = profileData;
                            }).catch(profileErr => {
                                this.add(`Failed to get profile info for steam id ${friend.steamid}`);
                            });
                    }

                    resolve(friends);
                } else {
                    reject(`Couldn't find friends!`);
                }
            });

        });
    }

    getGames(steamId): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders({
                'Content-Type': 'application/json'
            });

            this.http.get(`/api/steam/GetOwnedGames/${steamId}`, { headers: headers }).subscribe(data => {

                if (data['response']) {
                    resolve(data['response']);
                } else {
                    reject(`Couldn't get games!`);
                }
            });

        });
    }

    //Determine what conversion should be used
    convertSteamId(id: string): Promise<{ steam64: string, steam32: string, steamLegacy: string }> {
        return new Promise((resolve, reject) => {
            //Really simple replace
            //Something special isn't really needed
            id = id.replace('http://steamcommunity.com/id/', '');
            id = id.replace('http://steamcommunity.com/profiles/', '');
            id = id.replace('https://steamcommunity.com/id/', '');
            id = id.replace('https://steamcommunity.com/profiles/', '');

            if (id.match(/^765/) && id.length > 15) {
                //We are in STEAM 64
                const steam32 = this.convert64To32(id);
                const steamLegacy = this.convert64ToSteam(id);

                resolve({ steam64: id, steam32: steam32, steamLegacy: steamLegacy });
            } else if (id.match(/^\[U:1:/i) || id.match(/^U:1:/i)) {
                //We are in STEAM 32
                const steam64 = this.convert32To64(id);
                const steamLegacy = this.convert64ToSteam(steam64);

                resolve({ steam64: steam64, steam32: id, steamLegacy: steamLegacy });
            } else if (id.match(/^STEAM_1:[0-1]:/i)) {
                //We are in STEAM Legacy
                const steam64 = this.convertSteamTo64(id);
                const steam32 = this.convert64To32(steam64);

                resolve({ steam64: steam64, steam32: steam32, steamLegacy: id });
            } else {
                //Possibly a vanity name

                const headers = new HttpHeaders({
                    'Content-Type': 'application/json'
                });

                this.http.get(`/api/steam/ResolveVanityURL/${id}`, { headers: headers }).subscribe(data => {

                    if (data['response']) {
                        if (data['response'].success === 1) {
                            //Success
                            const steam64 = data['response'].steamid;
                            const steam32 = this.convert64To32(steam64);
                            const steamLegacy = this.convert64ToSteam(steam64);

                            resolve({ steam64, steam32, steamLegacy });
                        } else {
                            //Couldn't find profile that had that vanity url
                            reject(`Couldn't find profile!`);
                        }
                    }
                });
            }
        });
    }

    convert64To32(id: string) {
        return `[U:1:${new BigNumber(id).minus(this.conversion).toString()}]`;
    }

    convert64ToSteam(id: string) {
        const steamID = new BigNumber(id).minus(this.conversion);

        const authServer = steamID.mod(2).eq(0) ? 0 : 1;
        const authId = steamID.minus(authServer).div(2).toString();

        return `STEAM_1:${authServer}:${authId}`;
    }

    convert32To64(id: string) {
        const num = id.replace(/^\[U:1:|^U:1:/i, '').replace(/\]/, '');

        return new BigNumber(num).plus(this.conversion).toString();
    }

    convertSteamTo64(id: string) {
        const parts = id.split(':');
        let steamId = new BigNumber(parts[2]).times(2);

        if (parts[1] === '1') {
            steamId = steamId.plus(1);
        }

        return steamId.plus(this.conversion).toString();
    }
}
