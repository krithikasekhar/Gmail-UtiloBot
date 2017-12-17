var Promise     = require("bluebird");
var _           = require("underscore");
var request     = require("request");
var querystring = require('querystring');
var fs          = require('fs');
var deasync     = require('deasync');
var nock        = require("nock");

// REST call to get information about a specific issue of the given repository and the owner.
function getIssueInfoRequest(owner,issue,repo,githubtoken,org)
{
        var sync = true;
        var out  = null;
        var globalUrl;
        if (org == "ncsu")
		globalUrl = 'https://github.ncsu.edu/api/v3/';
	else
		globalUrl = 'https://api.github.com/';
        var options = {
                url : globalUrl + 'repos/' + owner + '/' + repo + '/issues/' + issue,
                method: 'GET',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken}
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error || response == undefined || response.statusCode != 200)
                        out = "error";
                else
                        out = JSON.parse(body);
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}

// REST call to edit an issue's title, state and body of the given repository and the owner.
function editIssueInfoRequest(owner,issue,repo,githubtoken,state,org)
{
        var data = {"state":state};
        var sync = true;
        var out  = null;
        var globalUrl;
        if (org == "ncsu")
                globalUrl = 'https://github.ncsu.edu/api/v3/';
        else
                globalUrl = 'https://api.github.com/';
        var options = {
                url : globalUrl + 'repos/' + owner + '/' + repo + '/issues/' + issue,
                method: 'PATCH',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken},
                form: JSON.stringify(data)
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        out = "not200";
                else if (response.statusCode == 404)
                        out = "404";
                else if (response.statusCode == 401)
                        out = "401";
                else if (response.statusCode == 405)
                        out = "405";
                else if (response.statusCode != 200)
                        out = "not200";
                else
			out = "200";
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}

// REST call to get information about a specific issue comments of the given repository and the owner.
function getIssueCommentInfoRequest(owner,issue,repo,githubtoken,org)
{
        var sync = true;
        var out  = null;
        var globalUrl;
        if (org == "ncsu")
                globalUrl = 'https://github.ncsu.edu/api/v3/';
        else
                globalUrl = 'https://api.github.com/';
        var options = {
                url : globalUrl + 'repos/' + owner + '/' + repo + '/issues/' + issue + '/comments',
                method: 'GET',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken}
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error || response == undefined || response.statusCode != 200)
                        out = "error";
                else
                        out = JSON.parse(body);
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}

// REST call to add an issue comment of the given repository and the owner.
function addIssueCommentInfoRequest(owner,issue,repo,githubtoken,data,org)
{
        var data = {"body":data};
        var sync = true;
        var out  = null;
        var globalUrl;
        if (org == "ncsu")
                globalUrl = 'https://github.ncsu.edu/api/v3/';
        else
                globalUrl = 'https://api.github.com/';
        var options = {
                url : globalUrl + 'repos/' + owner + '/' + repo + '/issues/' + issue + '/comments',
                method: 'POST',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken},
                form: JSON.stringify(data)
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        out = "not201";
                else if (response.statusCode == 404)
                        out = "404";
                else if (response.statusCode == 401)
                        out = "401";
                else if (response.statusCode == 405)
                        out = "405";
                else if (response.statusCode != 201)
                        out = "not201";
                else
                        out = "201";
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}

// REST call to edit an issue particluar comment of the given repository and the owner.
function editIssueCommentInfoRequest(owner,repo,githubtoken,commentid,data,org)
{
        data = {"body":data};
        var sync = true;
        var out  = null;
        var globalUrl;
        if (org == "ncsu")
                globalUrl = 'https://github.ncsu.edu/api/v3/';
        else    
                globalUrl = 'https://api.github.com/';
        var options = {
                url : globalUrl + 'repos/' + owner + '/' + repo + '/issues/comments' + commentid,
                method: 'PATCH',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken},
                form: JSON.stringify(data)
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        out = "not200";
                else if (response.statusCode == 404)
                        out = "404";
                else if (response.statusCode == 401)
                        out = "401";
                else if (response.statusCode == 405)
                        out = "405";
                else if (response.statusCode != 200)
                        out = "not200";
                else
                        out = "200";
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}

// REST call to delete an issue particluar comment of the given repository and the owner.
function deleteIssueCommentInfoRequest(owner,issue,repo,githubtoken,commentid,org)
{
        var sync = true;
        var out  = null;
        var globalUrl;
        if (org == "ncsu")
                globalUrl = 'https://github.ncsu.edu/api/v3/';
        else
                globalUrl = 'https://api.github.com/';
        var options = {
                url : globalUrl + 'repos/' + owner + '/' + repo + '/issues/comments' + commentid,
                method: 'DELETE',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken}
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        out = "not200";
                else if (response.statusCode == 404)
                        out = "404";
                else if (response.statusCode == 401)
                        out = "401";
                else if (response.statusCode == 405)
                        out = "405";
                else if (response.statusCode != 200)
                        out = "not200";
                else
                        out = "200";
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}

// REST call to close  a specific pull resquest of the given repository and the owner.
function closePullRequest(owner,pull,repo,githubtoken,org)
{
        var sync = true;
        var out  = null;
        var data = '{"state": "closed"}';
        var output = null;
        var globalUrl;
        if (org == "ncsu")
                globalUrl = 'https://github.ncsu.edu/api/v3/';
        else
                globalUrl = 'https://api.github.com/';
        var options = {
                url : globalUrl + 'repos/' + owner + '/' + repo + '/pulls/' + pull,
                method: 'PATCH',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken},
                form: data
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        out = "not200";
                else if (response.statusCode == 404)
                        out = "404";
                else if (response.statusCode == 401)
                        out = "401";
                else if (response.statusCode == 405)
                        out = "405";
                else if (response.statusCode != 200)
                        out = "not200";
                output = JSON.parse(body);
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        if (out != null)
                return out;
        else
                return output.message;
}

// REST call to merge a specific pull resquest of the given repository and the owner.
function mergePullRequest(owner,pull,repo,githubtoken,org)
{
        var sync = true;
        var out  = null;
        var output = null;
        var globalUrl;
        if (org == "ncsu")
                globalUrl = 'https://github.ncsu.edu/api/v3/';
        else
                globalUrl = 'https://api.github.com/';
        var options = {
                url : globalUrl + 'repos/' + owner + '/' + repo + '/pulls/' + pull + '/merge',
                method: 'PUT',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken}
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        out = "not200";
                else if (response.statusCode == 404)
                        out = "404";
                else if (response.statusCode == 401)
                        out = "401";
                else if (response.statusCode == 405)
                        out = "405";
                else if (response.statusCode != 200)
                        out = "not200";
                output = JSON.parse(body);
                sync = false;

        });
        while(sync) {require('deasync').sleep(100);}
        if (out != null)
                return out;
        else
                return output.message
}

// REST call to validate user GitHub Token.
function validateGithubToken(githubtoken,org)
{
        var sync = true;
        var out  = null;
        var globalUrl;
        if (org == "ncsu")
                globalUrl = 'https://github.ncsu.edu/api/v3/';
        else
                globalUrl = 'https://api.github.com/';

        	console.log("token-" + githubtoken + "  url-" + globalUrl + "\n\n");
        var options = {
                url : globalUrl + 'user/repos',
                method: 'GET',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken}
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error || response == undefined || response.statusCode != 200)
                        out = "error";
                else
                        out = JSON.parse(body);
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}


// REST call to get list of pull request emails id's.
function getPullList(userId, gmailId, gmailToken)
{
        var sync = true;
        var data = null;
        var q    = "You can view, comment on, or merge this pull request online";
        var options = {
                url: 'https://www.googleapis.com/gmail/v1/users/' + gmailId + "/messages?maxResults=5&q=" + q, 
                // Added search string in the end as '&q="You can view, comment on, or merge this pull request online at"'
                method: 'GET',
                headers: {
                        "content-type": "application/json",
                        "Authorization": "Bearer "+ gmailToken
                }
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
			data = error;
                else
                	data = JSON.parse(body);
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return data;
}

// REST call to get list of issues emails id's. 
function getIssueList(userId, gmailId, gmailToken)
{
        var sync = true;
        var data = null;
        var q    = "View it on GitHub or mute the thread";
        var options = {
                url: 'https://www.googleapis.com/gmail/v1/users/' + gmailId + "/messages?maxResults=20&q=" + q, 
		// Add search string in the end as '&q="You are receiving this because you are subscribed to this thread -\"You can view, comment on, or merge this pull request online at\""';
                method: 'GET',
                headers: {
                        "content-type": "application/json",
                        "Authorization": "Bearer "+ gmailToken
                }
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        data = error;
                else
                        data = JSON.parse(body);
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return data;
}

// REST call to get list of invite emails id's. 
function getInviteList(userId, gmailId, gmailToken)
{
        var sync = true;
        var data = null;
        var q    = "filename:invite.ics subject:invitation Invitation from Google Calendar";
        var options = {
                url: 'https://www.googleapis.com/gmail/v1/users/' + gmailId + "/messages?maxResults=5&q=" + q,
		// Add search string in the end as '&q="filename:invite.ics subject:invitation Invitation from Google Calendar"';
                method: 'GET',
                headers: {
                        "content-type": "application/json",
                        "Authorization": "Bearer "+ gmailToken
                }
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        data = error;
                else
                        data = JSON.parse(body);
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return data;
}

// REST call to get specific email data.
function getData(userId, gmailId, gmailToken, id)
{
        var sync = true;
        var data = null;
        var options = {
                url: 'https://www.googleapis.com/gmail/v1/users/' + gmailId + '/messages/' + id,
                method: 'GET',
                headers: {
                        "content-type": "application/json",
                        "Authorization": "Bearer "+ gmailToken
                }
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        data = "error";
                else
                        data = JSON.parse(body);
                if(response == undefined || response.statusCode != 200 || data == null)
                        data = "error";
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
	return data;
}

/* 
 * Function which calls individual request to
 * each emails and returns array ofrequired data. 
 */
function getAllData(msgs,temp) {
     var sync = true;
     var arr = [];
     var errorCode = null;
     var temppulldata;
     var msgData;
     for (var i = 0; i<msgs.length; i++) {
       console.log(JSON.stringify(msgs[i]));

       //Mock service
       //temppulldata = JSON.parse(fs.readFileSync('./mock/'+msgs[i].id+'.json'));
       //var service = nock("https://www.googleapis.com/gmail/v1/users")
       //.get('/' + temp.gmailid + '/messages/' + msgs[i].id)
       //.reply(200, temppulldata);

       msgData = getData(temp.user, temp.gmailid, temp.gmailtoken, msgs[i].id);
       //Error Handling
       if(msgData == "error"){
            errorCode = "error";
  	    break; 
       }
       arr.push(msgData);
       if(i == msgs.length -1)
            sync = false;
     }
     while(sync) {require('deasync').sleep(100);}

     //Cleaning nock call
     //nock.cleanAll()

     if (errorCode != null)
	return errorCode;
     else
     	return arr;
}

/* 
 * Function which calls individual request to each issue emails and 
 * then calls github api's to gather and return required data. 
 */
function getAllIssueData(msgs,temp) {
     var sync = true;
     var arr = [];
     var temppulldata ='';
     var msgData = '';
     var value = '';
     var errorCode = null;
     var obj = {"repo":"", "issueid":"", "owner":""};
     for (var i = 0; i<msgs.length; i++) {
       console.log(JSON.stringify(msgs[i]));
 
       // MOCK SERVICE
       //temppulldata = JSON.parse(fs.readFileSync('./mock/'+msgs[i].id+'.json'));
       //var service = nock("https://www.googleapis.com/gmail/v1/users")
       //.get('/' + temp.gmailid + '/messages/' + msgs[i].id)
       //.reply(200, temppulldata);

       msgData = getData(temp.user, temp.gmailid, temp.gmailtoken, msgs[i].id);
       if(msgData == "error"){
            errorCode = "error";
            break;
       }
       var headers = msgData.payload.headers;
       for(j=0;j<headers.length;j++){
         if(headers[j].name == "Message-ID"){
	   value = headers[j].value;
           console.log("asas" + value);
           var dd = value.split("/");
	   if (dd[dd.length-2]=="issue_event"){
             console.log("\nissue_event\n");
      	     obj.owner = dd[0].replace(/[<,>]/,"");
             obj.issueid = dd[dd.length-3];
             for (var k=1;k<dd.length-4;k++){
               if(k==dd.length-5)
                 obj.repo = obj.repo + dd[k];
               else
	         obj.repo = obj.repo + dd[k] + '/';
             }
           } else if (dd[dd.length-3]=="issues"){
             console.log("\nissues\n");
             obj.owner = dd[0].replace(/[<,>]/,"");
             obj.issueid = dd[dd.length-2];
             for (var k=1;k<dd.length-3;k++){
               if(k==dd.length-4)
                 obj.repo = obj.repo + dd[k];
               else
	 	  obj.repo = obj.repo + dd[k] + '/';
             }
           } else if (dd[dd.length-2]=="issues"){
             console.log("\nissues\n");
             obj.owner = dd[0].replace(/[<,>]/,"");
             obj.issueid = dd[dd.length-1].replace(/@(.)*/g,'');
             for (var k=1;k<dd.length-2;k++){
               if(k==dd.length-3)
                 obj.repo = obj.repo + dd[k];
               else
                  obj.repo = obj.repo + dd[k] + '/';
             }
           } else {
             value = '';
           }
           break;
         }
       }
       if(value != '' && obj.owner != '' && obj.repo != '' && obj.issueid != ''){
         if (_.findWhere(arr, obj) == null) 
           arr.push(obj);
       }
       obj = {"repo":"", "issueid":"", "owner":""};
       value='';
       if(i==msgs.length -1)
            sync = false;
     }
     while(sync) {require('deasync').sleep(100);}

     // NOCK clear call
     //nock.cleanAll()

     if (errorCode != null)
        return errorCode;
     else
        return arr;
}

/* REST call to get the travis status of a particular pull 
 * request of the given repository and the owner.
 */
//REST call to get the travis token for the given GitHUb account token.
function getTravisToken(github_token) {
        //getting travis authorization token using github token
        var travis_token = null;
        var sync = true;
        var out  = null;
        var authenticateTravis = {
                url : 'https://api.travis-ci.org/auth/github?github_token='+ github_token,
                method: 'POST',
                headers: {"User-Agent": "MyClient/1.0.0", "content-type": "application/json", "Accept": "application/vnd.travis-ci.2+json"}
        };
        request(authenticateTravis, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error || response.statusCode != 200)
                        out = "NoTravisAccount"; //Error: GitHubtoken is not valid or the Travis account has not been setup for the given GitHub account or the Problem is with travis server, Please try again after sometimes.
                else {
                        out = JSON.parse(body);
                        console.log("travisTokenData: "+JSON.stringify(out)+"\n");
                        if (out.access_token == undefined || out.access_token == null)
                                out = "NoTravisAccount"; // Error: Problem in Travis account Token, Please setup Travis account properly.
                        else
                                out=out.access_token;
                }
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}

//REST call to get the travis status for the given pull request.
function getTravisStatus(owner, repo, pull_request_number, travis_token) {
        var data = null;
        var out1 = null;
        var stateTravis = null;
        var sync = true;
        var pull_request_title;
        var travisBuilds = {
                url : 'https://api.travis-ci.org/repos/'+ owner+'/'+repo+'/builds',
                method: 'GET',
                headers: {"User-Agent": "MyClient/1.0.0", "content-type": "application/json", "Accept": "application/vnd.travis-ci.2+json",
                "Authorization": "token " + travis_token}
        };
        request(travisBuilds, function (error, response, body) {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error || response.statusCode != 200)
                        stateTravis = "NoTravisAccount"; //Error: GitHubtoken is not valid or the Travis account has not been setup for the given GitHub account or the Problem is with travis server, Please try again after sometimes.
                else {
                         out1 = JSON.parse(body);
                         console.log("travisBuildData:"+JSON.stringify(out1)+"\n\n");
                         if (out1.builds == undefined || out1.builds.length == 0 || out1.builds == null) {
                                stateTravis  =  "TravisNotSetup"; //Error: Travis build is not setup for this repository
                         } else {
                                data = out1.builds;
                                for(var i=0; i< data.length;++i){
                                        if(data[i].pull_request_number!=null && data[i].pull_request_number === pull_request_number) {
                                                pull_request_title = data[i].pull_request_title;
                                                stateTravis = data[i].state;
                                                break;
                                        }
                                }
                        }
               }
              sync=false;
        });
        while(sync) {require('deasync').sleep(100);}
        if (stateTravis == null)
                stateTravis = "TravisNotSetup"; //Error: Travis build is not setup for this repository
        return stateTravis;
}

//Exporting all the defined functions
exports.editIssueInfoRequest          = editIssueInfoRequest;
exports.editIssueCommentInfoRequest   = editIssueCommentInfoRequest;
exports.addIssueCommentInfoRequest    = addIssueCommentInfoRequest;
exports.deleteIssueCommentInfoRequest = deleteIssueCommentInfoRequest;
exports.getIssueInfoRequest           = getIssueInfoRequest;
exports.getIssueCommentInfoRequest    = getIssueCommentInfoRequest
exports.mergePullRequest              = mergePullRequest;
exports.closePullRequest              = closePullRequest;
exports.getAllData                    = getAllData;
exports.getAllIssueData               = getAllIssueData;
exports.getData                       = getData;
exports.getPullList                   = getPullList;
exports.getIssueList                  = getIssueList;
exports.getInviteList                 = getInviteList;
exports.getTravisToken		      = getTravisToken;
exports.getTravisStatus		      = getTravisStatus;
exports.validateGithubToken           = validateGithubToken;
