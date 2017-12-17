# Milestone: SERVICE

## Team GoogleMail UtiloBot:
1. Mahesh Agrawal      - magrawa4
2. Ashima Singh        - asingh26
3. Kshittiz Kumar      - kkumar4
4. Krithika Sekhar     - ksekhar
5. Jagadeesh Saravanan - jsarava


## Service:
* In this milestone, We have implemented the internal logic required to *actually* perform the services/tasks via the bot for all of the 3 
usecases which were defined and implemented using mock data and services in previous milestone


## Code and Implementation
* [Code Base](https://github.ncsu.edu/magrawa4/CSC510-Project/tree/master/src_service)         -- UseCase 1,2,3 has been successfully implemented, with proper error handling and edge cases have also taken care.
* [restcall.js](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_service/restcall.js)       -- This code has all the required functions which perform GitHub and Gmail API REST calls.
* [bot.js](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_service/bot.js)            -- This is the main code, which runs the bot and call required functions listed in restcall.js.
* [package.json](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_service/package.json)      -- This has list of all required nodejs modules/packages.
* [login-github.json](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_service/login-github.json) -- JSON file which stores GitHub credientials (username, token) required for implmenting usecases.
* [login-gmail.json](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_service/login-gmail.json)  -- JSON file which stores Gmail credientials (username, token) required for implmenting usecases.
* [travisapi.js](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_service/travisapi.js)      -- For testing purpose of travis API.
* [gmailservice.js](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_service/gmailservice.js)   -- For testing purose of Gmail services.

## Task Tracking
Please look into the [WORKSHEET-SERVICE](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/WORKSHEET-SERVICE.md) file for task tracking information.  

[Trello cards](https://trello.com/utilobot)

## Screen Cast
The link to the screencast demonstrating the functioning of the bot is given below:  
https://youtu.be/_j0txc23K1k 
