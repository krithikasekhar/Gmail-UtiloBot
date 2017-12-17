var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var Promise = require("bluebird");
var _ = require("underscore");
var request = require("request");
var querystring = require('querystring');
const base64url = require('base64url');
var deasync = require('deasync');

var urlRoot = "https://www.googleapis.com/gmail/v1/users";
var githubtoken = 'eec3fb2e14a46afa4a2f06278f05b540da696566'; // krithika ncsu github token

var userId = "ksekhar@ncsu.edu"; //gmailId
var gmailToken= "ya29.Glv9BBJijDGlmFP7xg29xtp4S_hU7-WVs8Vt-L66JkM5walR9Ef_WTfTcI55xlhLvkNbWMXji1jnCi3XwLju0Kty3oqdqIjTqURpQucLKfmfY_lhPo8DV_t8YkCh"; // Give Access token here
var listMessage=
{
	"maxResults": 4,
	
};

//var msgId= '15f457e952618896' //dont use this- just for testing purpose
//getMessage(userId,userId,gmailToken,msgId);
function getMessage(userId, gmailId, gmailToken, id)
{
	console.log("----------------Message Id: " + id + " Content-------------------");
        var sync = true;
        var data = null;
        
        
        var options = {
                url: urlRoot + "/" + gmailId + '/messages/' + id,
                method: 'GET',
                headers: {
                        "content-type": "application/json",
			"Authorization": "Bearer "+ gmailToken
		}
        };
        request(options, function (error, response, body)
        {
                //console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        data = error;
                else{
			data = JSON.parse(body);
			
		                       
		}
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        return data;

}
//getPullList(userId, userId, gmailToken);
function getPullList(userId, gmailId, gmailToken)
{
	console.log("----------------Pull request Message Id List-------------------");
        var sync = true;
        var sync1 = true;
        
        var xx = '';
        var data = null;
        var obj = {"pulllink":"", "reponame":"", "owner":"", "pullnumber":""};
        
        var arr=[];
	var q= "You can view, comment on, or merge this pull request online";
        var options = {
                url: 'https://www.googleapis.com/gmail/v1/users/' + gmailId + "/messages?q=" + q, // Add search string in the end as '&q="You can view, comment on, or merge this pull request online at"'
                method: 'GET',
                headers: {
                        "content-type": "application/json",
                        "Authorization": "Bearer "+ gmailToken
                }
        };
        request(options, function (error, response, body)
        {
                //console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
								
				if (error)
					data = error;
				else
					{
					data = JSON.parse(body);
					console.log("\n Result size estimate: " + data.resultSizeEstimate);
					
					for( var i = 0; i < data.messages.length; i++ )
					{
                                                var msgId=data.messages[i].id; //message id
                                                //console.log(msgId + " ");
                                                xx=getMessage(userId,userId,gmailToken,msgId);
                                                var msgbody=xx.payload.parts[0].body;
                                                var convertedString = base64url.decode(msgbody.data);
                                                var pullLink = convertedString.split(/Reply to this email directly or view it on GitHub Enterprise:/)[1].split(/\r\n/)[1];//remove enterprise for normal github
                                                var re3 = new RegExp('github.ncsu.edu/(.*)/(.*)/pull');  // to get Repo Name. Use github.com for normal github; 
                                                var ans3=pullLink.match(re3); // to get Repo Name
                                                var re = new RegExp('/pull/(.*)'); // to get pull number 
                                                var ans=pullLink.match(re); // to get pull number
                                                //console.log('Pull link: ' + pullLink + '  Repo Name: ' + ans3[2] + ' Owner: ' + ans3[1] + ' Pull Number: ' + ans[1]);
                                                obj.pulllink=pullLink;
                                                obj.reponame=ans3[2];
                                                obj.owner=ans3[1];
                                                obj.pullnumber=ans[1];
                                                
                                                //console.log('Pull link: ' + obj.pulllink + '  Repo Name: ' + obj.reponame + ' Owner: ' + obj.owner + ' Pull Number: ' + obj.pullnumber + "\n");
                                                
                                                 if(obj.pulllink != '' && obj.reponame != '' && obj.owner != '' && obj.pullnumber != ''){
                                                        if (_.findWhere(arr, obj) == null) 
                                                                arr.push(obj);
                                                      } 
                                                      obj.pulllink='';
                                                      obj.reponame='';
                                                      obj.owner='';
                                                      obj.pullnumber='';
                                                if(i==data.messages.length -1)
                                                        sync = false;
                                        }
										
				}
	});
        while(sync) {require('deasync').sleep(100);}
        
        return arr;
}
//rest call to get list of issue emails
//getIssueList(userId, userId, gmailToken);
function getIssueList(userId, gmailId, gmailToken)
{
    console.log("----------------Issue Message Id List-------------------");
    var sync = true;
    var sync1 = true;
    
    var xx = '';
    var data = null;
    var obj = {"issuelink":"", "reponame":"", "owner":"", "issuenumber":""};
    
    var arr=[];
    var q= "You are receiving this because you were mentioned";
    var options = {
            url: 'https://www.googleapis.com/gmail/v1/users/' + gmailId + "/messages?q=" + q, 
            method: 'GET',
            headers: {
                    "content-type": "application/json",
                    "Authorization": "Bearer "+ gmailToken
            }
    };
    request(options, function (error, response, body)
    {
            //console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                            
            if (error)
                data = error;
            else
                {
                data = JSON.parse(body);
                console.log("\n Result size estimate: " + data.resultSizeEstimate);
                
                for( var i = 0; i < data.messages.length; i++ )
                {
                                            var msgId=data.messages[i].id; //message id
                                            console.log(msgId + " ");
                                            xx=getMessage(userId,userId,gmailToken,msgId);
                                            var msgbody=xx.payload.parts[0].body;
                                            var convertedString = base64url.decode(msgbody.data);
                                            var issLink = convertedString.split(/Reply to this email directly or view it on GitHub Enterprise:/)[1].split(/\r\n/)[1];//remove enterprise for normal github
                                            var re3 = new RegExp('github.ncsu.edu/(.*)/(.*)/issues');  // to get Repo Name. Use github.com for normal github; 
                                            var ans3=issLink.match(re3); // to get Repo Name
                                            var re = new RegExp('/issues/(.*)'); // to get issue number 
                                            var ans=issLink.match(re); // to get issue number
                                            //console.log('Issue link: ' + issLink + '  Repo Name: ' + ans3[2] + ' Owner: ' + ans3[1] + ' Issue Number: ' + ans[1]);
                                            obj.issuelink=issLink;
                                            obj.reponame=ans3[2];
                                            obj.owner=ans3[1];
                                            obj.issuenumber=ans[1];
                                            
                                            console.log('Issue link: ' + obj.issuelink + '  Repo Name: ' + obj.reponame + ' Owner: ' + obj.owner + ' Issue Number: ' + obj.issuenumber + "\n");
                                            
                                             if(obj.issuelink != '' && obj.reponame != '' && obj.owner != '' && obj.issuenumber != ''){
                                                    if (_.findWhere(arr, obj) == null) 
                                                            arr.push(obj);
                                                  } 
                                                  obj.issuelink='';
                                                  obj.reponame='';
                                                  obj.owner='';
                                                  obj.issuenumber='';
                                            if(i==data.messages.length -1)
                                                    sync = false;
                                    }
                                    
            }
});
    while(sync) {require('deasync').sleep(100);}
    
    return arr;

}
//getInviteList(userId, userId, gmailToken);
// REST call to get list of invite emails id's. 
function getInviteList(userId, gmailId, gmailToken)
{
        var sync = true;
        var data = null;
        var xx = '';
        var finaldata  = '';
        var obj = {"detail":"", "yes":"", "no":"", "maybe":"", "content":""};
        var arr=[];
        var q= "filename:invite.ics subject:invitation Invitation from Google Calendar";
        var options = {
                url: 'https://www.googleapis.com/gmail/v1/users/' + gmailId + "/messages?q=" + q, // Add search string in the end as '&q="filename:invite.ics subject:invitation Invitation from Google Calendar"';
                method: 'GET',
                headers: {
                        "content-type": "application/json",
                        "Authorization": "Bearer "+ gmailToken
                }
        };
        request(options, function (error, response, body)
        {
                //console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        data = error;
                else{
                        data = JSON.parse(body);

                        console.log("\n Result size estimate: " + data.resultSizeEstimate);
                        
                        for( var i = 0; i < data.messages.length; i++ )//data.messages.length
                        {
                                var msgId=data.messages[i].id; //message id
                                //console.log(msgId + " ");
                                xx=getMessage(userId,userId,gmailToken,msgId);
                                var h = base64url.decode(xx.payload.parts[0].parts[0].body.data);
                                //console.log("decoded message " + h);
                                var tempcontent = h.replace(/(\r\n|\n|\r)*Invitation from Google Calendar(\r\n|\n|\r|.)*/gm,"").replace(/(\r\n|\n|\r)*You have been invited to the following event.(\r\n|\n|\r)*/gm,"");
                                var re = new RegExp('https://www.google.com/calendar/event?(.*)'); // to get pull number ie 9
                                var link  = tempcontent.match(re)[0];
                                var detail  = '<' + link + '|\tEvent Details>';
                                var yes     = '<' + link.replace("VIEW", "RESPOND") + '&rst=1|\tYes>';
                                var no      = '<' + link.replace("VIEW", "RESPOND") + '&rst=2|\tNo>';
                                var maybe   = '<' + link.replace("VIEW", "RESPOND") + '&rst=3|\tMaybe>';
                                var content = tempcontent.replace(/(\r\n|\n|\r)*Event details:(\r\n|\n|\r|.)*/gm,"");
                                finaldata = finaldata + "\n---------------------------------------------------\nYou have been invited to the following event\n---------------------------------------------------\n" + content + "\nActions:" +  "\n" + yes + "\n" + no + "\n" + maybe + "\nFor more information: " + detail + "\n";
                                
                               // console.log("content:\n" + content);
                                obj.detail=detail;
                                obj.yes=yes;
                                obj.no=no;
                                obj.maybe=maybe;
                                obj.content=content;
                                console.log('Event detail: ' + obj.detail + '\ncontent: ' + obj.content + '\nYes: ' + obj.yes + '\nNo: ' +  obj.no + '\nMay be: ' + obj.maybe +  "\n");
                                
                                 if(obj.yes != '' && obj.no != '' && obj.maybe != '' && obj.content != '' && obj.detail != ''){
                                        if (_.findWhere(arr, obj) == null) 
                                          arr.push(obj);
                                      } 
                                      obj.yes='';
                                      obj.detail='';
                                      obj.no='';
                                      obj.maybe='';
                                      obj.content='';
                                if(i==data.messages.length -1)
                                        sync = false;
                        }
                }
                
        });
        while(sync) {require('deasync').sleep(100);}
        
        return arr;

}
//mergePullRequest('jsarava', '3', 'testingrepo', githubtoken);
// REST call to merge a specific pull request of the given repository and the owner.
function mergePullRequest(owner,pull,repo,githubtoken)
{
        var sync = true;
        var out  = null;
        var options = {
                url : 'https://github.ncsu.edu/api/v3/repos/' + owner + '/' + repo + '/pulls/' + pull + '/merge',
                //url : 'https://github.ncsu.edu/api/v3/users/jsarava/repos',
                method: 'PUT',
                headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": "token " + githubtoken
		} 
        };
        request(options, function (error, response, body)
        {
                //console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        out = error;
                else{
                        out = JSON.parse(body);
                        //console.log("body:\n" + body + "\n");
                }
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        console.log(out.message);
        return out;
}
//closePullRequest('jsarava', '3', 'testingrepo', githubtoken);
// REST call to close  a specific pull resquest of the given repository and the owner.
function closePullRequest(owner,pull,repo,githubtoken)
{
        var sync = true;
        var out  = null;
        var data = '{"state": "closed"}';
        var options = {
                url : 'https://github.ncsu.edu/api/v3/repos/' + owner + '/' + repo + '/pulls/' + pull,
                method: 'PATCH',
                headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": "token " + githubtoken
		},
                form: data
        };
        request(options, function (error, response, body)
        {
                //console.log("HTTP response headers are the following:\n" + "Response: " + JSON.stringify(response) + "\nError:" + error + "\nBody" + JSON.stringify(body) + "\n");
                if (error)
                        out = error;
                else
                        out = "Pull request successfully closed";//JSON.parse(body);
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);}
        console.log(out);
        return out;
}
//addIssueCommentInfoRequest('jsarava','4','testingrepo',githubtoken,'New issue');
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
//getIssueCommentInfoRequest('jsarava','4#event-123229','testingrepo',githubtoken);
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
//editIssueInfoRequest('jsarava','4#event-123229','testingrepo',githubtoken,'closed');
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


exports.getMessage=getMessage;
exports.getPullList=getPullList;
exports.mergePullRequest=mergePullRequest;
exports.closePullRequest=closePullRequest;
exports.getInviteList=getInviteList;
exports.getIssueList = getIssueList;
exports.addIssueCommentInfoRequest = addIssueCommentInfoRequest;
exports.editIssueInfoRequest = editIssueInfoRequest;
exports.getIssueCommentInfoRequest = getIssueCommentInfoRequest;

