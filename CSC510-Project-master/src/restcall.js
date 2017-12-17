var Promise = require("bluebird");
var _ = require("underscore");
var request = require("request");
var querystring = require('querystring');
var fs          = require('fs');
var deasync = require('deasync');
var nock = require("nock");

// REST call to get information about a specific issue of the given repository and the owner.
function getIssueInfoRequest(owner,issue,repo,githubtoken)
{
        var sync = true;
        var out  = null;
        var options = {
                url : 'https://github.ncsu.edu/api/v3/repos/' + owner + '/' + repo + '/issues/' + issue,
                method: 'GET',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken}
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        out = error;
                else
                        out = JSON.parse(body);
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}

// REST call to edit an issue's title, state and body of the given repository and the owner.
function editIssueInfoRequest(owner,issue,repo,githubtoken,state)
{
        var data = {"state":state};
        var sync = true;
        var out  = null;
        var options = {
                url : 'https://github.ncsu.edu/api/v3/repos/' + owner + '/' + repo + '/issues/' + issue,
                method: 'PATCH',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken},
                form: JSON.stringify(data)
        };
        request(options, function (error, response, body)
        {
               console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
               if(response != undefined && response.statusCode == 200)
                        out="1";
               else
                        out="0";
               sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}

// REST call to get information about a specific issue comments of the given repository and the owner.
function getIssueCommentInfoRequest(owner,issue,repo,githubtoken)
{
        var sync = true;
        var out  = null;
        var options = {
                url : 'https://github.ncsu.edu/api/v3/repos/' + owner + '/' + repo + '/issues/' + issue + '/comments',
                method: 'GET',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken}
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        out = error;
                else
                        out = JSON.parse(body);
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}

// REST call to edit an issue particluar comment of the given repository and the owner.
function editIssueCommentInfoRequest(owner,repo,githubtoken,commentid,data)
{
        data = {"body":data};
        var sync = true;
        var out  = null;
        var options = {
                url : 'https://github.ncsu.edu/api/v3/repos/' + owner + '/' + repo + '/issues/comments' + commentid,
                method: 'PATCH',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken},
		form: JSON.stringify(data)
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        out = error;
                else
                        out = JSON.parse(body);
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}

// REST call to add an issue comment of the given repository and the owner.
function addIssueCommentInfoRequest(owner,issue,repo,githubtoken,data)
{
        var data = {"body":data};
        var sync = true;
        var out  = null;
        var options = {
                url : 'https://github.ncsu.edu/api/v3/repos/' + owner + '/' + repo + '/issues/' + issue + '/comments',
                method: 'POST',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken},
                form: JSON.stringify(data)
        };
        request(options, function (error, response, body)
        {
               console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
               if(response != undefined && response.statusCode == 201)
                        out="1";
               else
                        out="0";
               sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}

// REST call to delete an issue particluar comment of the given repository and the owner.
function deleteIssueCommentInfoRequest(owner,issue,repo,githubtoken,commentid)
{
        var sync = true;
        var out  = null;
        var options = {
                url : 'https://github.ncsu.edu/api/v3/repos/' + owner + '/' + repo + '/issues/comments' + commentid,
                method: 'DELETE',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken}
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        out = error;
                else {
                        if(response.statusCode == 204)
                                out="successfull";
                        else
                                out="wrong info";

                }
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}

// REST call to close  a specific pull resquest of the given repository and the owner.
function closePullRequest(owner,pull,repo,githubtoken)
{
        var sync = true;
        var out  = null;
        var data = '{"state": "closed"}';
        var options = {
                url : 'https://github.ncsu.edu/api/v3/repos/' + owner + '/' + repo + '/pulls/' + pull,
                method: 'PATCH',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken},
                form: data
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        out = error;
                else
                        out = JSON.parse(body);
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return out;
}

// REST call to merge a specific pull resquest of the given repository and the owner.
function mergePullRequest(owner,pull,repo,githubtoken)
{
        var sync = true;
        var out  = null;
        var options = {
                url : 'https://github.ncsu.edu/api/v3/repos/' + owner + '/' + repo + '/pulls/' + pull + '/merge',
                method: 'PUT',
                headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubtoken}
        };
        request(options, function (error, response, body)
        {
                console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        out = error;
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
        var options = {
                url: 'https://www.googleapis.com/gmail/v1/users/' + gmailId + "/messages?maxResults=20", // Add search string in the end as '&q="You can view, comment on, or merge this pull request online at"'
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
        var options = {
                url: 'https://www.googleapis.com/gmail/v1/users/' + gmailId + "/messages?maxResults=20", // Add search string in the end as '&q="You are receiving this because you are subscribed to this thread -\"You can view, comment on, or merge this pull request online at\""';
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
        var options = {
                url: 'https://www.googleapis.com/gmail/v1/users/' + gmailId + "/messages?maxResults=20", // Add search string in the end as '&q="filename:invite.ics subject:invitation Invitation from Google Calendar"';
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
                        data = error;
                else
                        data = JSON.parse(body);
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
     var temppulldata;
     var xx;
     for (var i = 0; i<msgs.length; i++) {
       console.log(JSON.stringify(msgs[i]));
       temppulldata = JSON.parse(fs.readFileSync('./mock/'+msgs[i].id+'.json'));
       var service = nock("https://www.googleapis.com/gmail/v1/users")
       .get('/' + temp.gmailid + '/messages/' + msgs[i].id)
       .reply(200, temppulldata);
       xx = getData(temp.user, temp.gmailid, temp.gmailtoken, msgs[i].id);
       arr.push(xx);
       if(i==msgs.length -1)
            sync = false;
     }
     while(sync) {require('deasync').sleep(100);}
     nock.cleanAll()
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
     var xx = '';
     var value = '';
     var obj = {"repo":"", "issueid":"", "owner":""};
     for (var i = 0; i<msgs.length; i++) {
       console.log(JSON.stringify(msgs[i]));
       temppulldata = JSON.parse(fs.readFileSync('./mock/'+msgs[i].id+'.json'));
       var service = nock("https://www.googleapis.com/gmail/v1/users")
       .get('/' + temp.gmailid + '/messages/' + msgs[i].id)
       .reply(200, temppulldata);
       xx = getData(temp.user, temp.gmailid, temp.gmailtoken, msgs[i].id);
       var headers = xx.payload.headers;
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
     nock.cleanAll()
     return arr;
}

/* REST call to get the travis status of a particular pull 
 * request of the given repository and the owner.
 */
function getPullStatus(owner,pull,repo,githubtoken,travisid,travistoken)
{
  /*
   * TO be implemented in
   * next phase of the project.
   */
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
exports.getPullStatus                 = getPullStatus;
