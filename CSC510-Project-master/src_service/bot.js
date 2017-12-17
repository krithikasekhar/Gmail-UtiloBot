var Botkit     = require('botkit');
var fs         = require('fs');
var restcall   = require("./restcall.js");
var nock       = require("nock");
var deasync    = require('deasync');
var base64url  = require('base64url');

var controller = Botkit.slackbot({
  //debug: true,
  //log: true
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM()

// Function for open pull request emails operation.
controller.hears(/pull.*mail|mail.*pull/gi,['mention', 'direct_mention','direct_message'], function(bot,message) 
{
try
{
  var loginPath   = './login-gmail.json';
  var loginModel;   //contains all login credientials;
  loginModel = JSON.parse(fs.readFileSync(loginPath));
  var temp = {'user': message.user , 'gmailid' : '', 'gmailtoken':'' };
  for(var i in loginModel) {
    if(message.user == loginModel[i].user) {
      temp.gmailid    = loginModel[i].gmailid;
      temp.gmailtoken = loginModel[i].gmailtoken;
    }
  }
  var loginPath1   = './login-github.json';
  var loginModel1;
  loginModel1 = JSON.parse(fs.readFileSync(loginPath1));
  var temp1 = {'user': message.user , 'githubid' : '', 'githubtoken':'', 'githuborg':''};
  for(var i in loginModel1) {
    if(message.user == loginModel1[i].user) {
      temp1.githubid    = loginModel1[i].githubid;
      temp1.githubtoken = loginModel1[i].githubtoken;
      temp1.githuborg   = loginModel1[i].githuborg;
    }
  }
  if(temp.gmailid == '') {
    bot.reply(message,"I don't have your gmail account info, please provide me your gmail id along with token in the following form:\nsetup-gmail-account gmailid=gmail-id gmailtoken=gmail-token\nLink for gmail token generation: https://developers.google.com/oauthplayground\nPlease generate gmail token in https://mail.google.com/ scope\n");
  } else if(temp1.githubid == '') {
    bot.reply(message,"I don't have your github account info, please provide me your github id along with the token and the github organization in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token githuborg=ncsu/general\n");
  } else {
    console.log("User credientaisl:" + JSON.stringify(temp) + "\n" + JSON.stringify(temp1) + "\n");
    var dataString = '';    
    var finaldata  = '';

    // MOCK SERVICE
    //var pulllistData = JSON.parse(fs.readFileSync('./mock/'+ message.user + '-pull-list.json'));
    //var mockService = nock("https://www.googleapis.com/gmail/v1/users")
    //.persist() // This will persist mock interception for lifetime of program.
    //.get('/' + temp.gmailid + '/messages')
    //.query({maxResults: 20})
    //.reply(200, pulllistData);

    dataString = restcall.getPullList(temp.user, temp.gmailid, temp.gmailtoken);
    console.log("Pull list data: " + JSON.stringify(dataString) + "\n");
    if(dataString.resultSizeEstimate == undefined) {
      bot.reply(message,"Error in server: Either the problem is with token, it has expired or the token is in gmail.metadata scope.\nplease generate gmail token in https://mail.google.com/ scope and update your gmail id and token by providing query in the following form:\nsetup-gmail-account gmailid=gmail-id gmailtoken=gmail-token\nLink for gmail token generation: https://developers.google.com/oauthplayground\n");
    } else if(dataString.resultSizeEstimate == 0){
      bot.reply(message,"No emails related to Github pull request found.\n");
    } else {
      var msgs = dataString.messages;
      var pullData = restcall.getAllData(msgs,temp);
      console.log("All pull data: " + JSON.stringify(pullData) + "\n");
      //Error Handling
      if(pullData == "error"){
	bot.reply(message,"Error in server: Either the problem is with token, it has expired or the token is in gmail.metadata scope.\nplease generate gmail token in https://mail.google.com/ scope and update your gmail id and token by providing query in the following form:\nsetup-gmail-account gmailid=gmail-id gmailtoken=gmail-token\nLink for gmail token generation: https://developers.google.com/oauthplayground\n");
      } else {
      	// MOCKING TRAVIS STATUS
      	//var statusData = JSON.parse(fs.readFileSync('./mock/pull-status.json'));

      	//GitHUb token validation, required for processing travis status
      	var validator = restcall.validateGithubToken(temp1.githubtoken, temp1.githuborg);
      	if (validator == "error") {
      		bot.reply(message,"Error in server: Either the problem is with Github token, it has expired/invalid or with the Github organization (We only supports ncsu/general).\nplease update your correct github id along with the token and the github organization by providing query in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token githuborg=ncsu/general\nTry Again.\n");
      	} else {
      		var travisToken = null;
      		travisToken = restcall.getTravisToken(temp1.githubtoken);
      		for (var i = 0 ; i< pullData.length ; i++) {
                        console.log("\n\n"+pullData[i].id+"\n\n" +  "\n\n" + pullData[i].payload.parts[0].body.data);
                        if (pullData[i].payload.parts[0].body.data == undefined || pullData[i].payload.parts[0].body.data == null)
				continue;
        		var h = base64url.decode(pullData[i].payload.parts[0].body.data)
      	 	 	// Removing unwanted details, as suggested in previous milestone.
        		var content = h.replace(/-- (\r\n|\n|\r)*Commit Summary(\r\n|\n|\r|.)*/gm,"");
        		var re = new RegExp('/pull/(.*)');
        		var pullnumber = content.match(re)[1];
        		re = new RegExp('http(.)*pull');
        		var str = content.match(re)[0];
        		var xx = str.split("/");
        		var repo='';
        		for (j=4;j<xx.length-1;j++)
          			if(j==xx.length-2)
          	  			repo = repo + xx[j];
          			else
            				repo = repo + xx[j] + '/';
     	   		var owner = xx[3];
                        content  = content.replace(/(\r\n|\n|\r|.)*You can view, comment on, or merge this pull request online at:/gm,"")
       		 	var statusData1 = restcall.getTravisStatus(owner,repo,parseInt(pullnumber),travisToken);
        		finaldata = finaldata + "---------------------------------------------------\n" + " Repo: " + repo + ", Pull:" + pullnumber + ", Owner:" + owner + ", Travis-Status:" + statusData1 + "\n"+ "---------------------------------------------------\n" + "Details:" + content;
      		}
      		finaldata = finaldata + "---------------------------------------------------" + "\nTo merge/close, please provide your choice in the following form:\nmerge/close pull request with pull=pullNumber repo=repoName owner=ownerName\n" + "---------------------------------------------------\n";
      		console.log("Pull request result: " + finaldata + "\n");
      		bot.reply(message,finaldata);
	}
      }
    }
  }

  // MOCK Cleaing call
  //nock.cleanAll()
}catch(err) {
 bot.reply(message, "Problem with network connectivity, Please try again after some times.\n");
}
});

// Function to merge a given pull request.
controller.hears('merge pull request with',['mention', 'direct_mention','direct_message'], function(bot,message)
{
try
{
  var loginPath   = './login-github.json';
  var loginModel;   //contains all login credientials;
  loginModel = JSON.parse(fs.readFileSync(loginPath));
  var temp = {'user': message.user , 'githubid' : '', 'githubtoken':'', 'githuborg':''};
  for(var i in loginModel) {
    if(message.user == loginModel[i].user) {
      temp.githubid    = loginModel[i].githubid;
      temp.githubtoken = loginModel[i].githubtoken;
      temp.githuborg   = loginModel[i].githuborg;
    }
  }
  if(temp.githubid == '') {
    bot.reply(message,"I don't have your github account info, please provide me your github id along with the token and the github organization in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token githuborg=ncsu/general\n");
  } else {
    var tempdata = message.text.split(' ');
    var pull = '';
    var repo = '';
    var owner= '';
    for (var i in tempdata) { 
      if (tempdata[i].includes('pull=')){
        pull = tempdata[i].split('=')[1];
      } else if (tempdata[i].includes('repo=')) {
        repo = tempdata[i].split('=')[1];
      } else if (tempdata[i].includes('owner=')) {
        owner = tempdata[i].split('=')[1];
      }
    }
    console.log("Tokens in merge pull request: " + pull + " " + repo + " " + owner + "\n");
    if(pull == '' || repo == '' || owner == '') 
      bot.reply(message,"Sorry I could not understand, please provide me your credentials again in the following form:\nmerge/close pull request with pull=pullNumber repo=repoName owner=ownerName\n");
    else {
      var output = restcall.mergePullRequest(owner,pull,repo,temp.githubtoken,temp.githuborg)
      console.log("merge pull request data: " + JSON.stringify(output) + "\n");
      if(output == "401")
        bot.reply(message,"Error in server: Either the problem is with Github token, it has expired/invalid or with the Github organization (We only supports ncsu/general).\nplease update your correct github id along with the token and the github organization by providing query in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token githuborg=ncsu/general\nTry again.\n");
      else if (output == "404")
        bot.reply(message,"Invalid data, please provide credentials again in the following form:\nmerge/close pull request with pull=pullNumber repo=repoName owner=ownerName\n");
      else if (output == "405")
        bot.reply(message,"Given pull request can not be merged\n");
      else if (output == "not200")
        bot.reply(message,"Invalid data or problem with serever, please provide credentials again in the following form:\nmerge/close pull request with pull=pullNumber repo=repoName owner=ownerName\n");
      else
        bot.reply(message,"Given request is merged successfully");
    }
  }
}catch(err) {
 bot.reply(message, "Problem with network connectivity, Please try again after some times.\n");
}
});

// Function to close a given pull request.
controller.hears('close pull request with',['mention', 'direct_mention','direct_message'], function(bot,message)
{
try
{
  var loginPath   = './login-github.json';
  var loginModel;   //contains all login credientials;
  loginModel = JSON.parse(fs.readFileSync(loginPath));
  var temp = {'user': message.user , 'githubid' : '', 'githubtoken':'', 'githuborg':''};
  for(var i in loginModel) {
    if(message.user == loginModel[i].user) {
      temp.githubid    = loginModel[i].githubid;
      temp.githubtoken = loginModel[i].githubtoken;
      temp.githuborg   = loginModel[i].githuborg;
    }
  }
  if(temp.githubid == '') {
    bot.reply(message,"I don't have your github account info, please provide me your github id along with the token and the github organization in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token githuborg=ncsu/general\n");
  } else {
    var tempdata = message.text.split(' ');
    var pull = '';
    var repo = '';
    var owner= '';
    for (var i in tempdata) {
      if (tempdata[i].includes('pull=')){
        pull = tempdata[i].split('=')[1];
      } else if (tempdata[i].includes('repo=')) {
        repo = tempdata[i].split('=')[1];
      } else if (tempdata[i].includes('owner=')) {
        owner = tempdata[i].split('=')[1];
      }
    }
    console.log("Token in close pull request: " + pull + " " + repo + " " + owner + "\n");
    if(pull == '' || repo == '' || owner == '') {
      bot.reply(message,"Sorry I could not understand, please provide me your credentials again in the following form:\nmerge/close pull request with pull=pullNumber repo=repoName owner=ownerName\n");
    } else {
      var output = restcall.closePullRequest(owner,pull,repo,temp.githubtoken,temp.githuborg)
      console.log("close pull request data: " + JSON.stringify(output) + "\n");
      if(output == "401")
      	bot.reply(message,"Error in server: Either the problem is with Github token, it has expired/invalid or with the Github organization (We only supports ncsu/general).\nplease update your correct github id along with the token and the github organization by providing query in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token githuborg=ncsu/general\nTry again.\n");
      else if (output == "404")
        bot.reply(message,"Invalid data, please provide credentials again in the following form:\nmerge/close pull request with pull=pullNumber repo=repoName owner=ownerName\n");
      else if (output == "405")
	bot.reply(message,"Given pull request can not be closed\n");
      else if (output == "not200")
        bot.reply(message,"Invalid data or problem with serever, please provide credentials again in the following form:\nmerge/close pull request with pull=pullNumber repo=repoName owner=ownerName\n");
      else
        bot.reply(message,"Given request is closed successfully");
    }
  }
}catch(err) {
 bot.reply(message, "Problem with network connectivity, Please try again after some times.\n");
}
});

// Function to list issue related emails.
controller.hears(/issue.*mail|mail.*issue/gi,['mention', 'direct_mention','direct_message'], function(bot,message)
{
try
{
  var loginPath   = './login-gmail.json';
  var service;
  var mockdata='';
  var errorCode = null;
  var loginModel;   //contains all login credientials;
  loginModel = JSON.parse(fs.readFileSync(loginPath));
  var temp = {'user': message.user , 'gmailid' : '', 'gmailtoken':'' };
  for(var i in loginModel) {
    if(message.user == loginModel[i].user) {
      temp.gmailid    = loginModel[i].gmailid;
      temp.gmailtoken = loginModel[i].gmailtoken;
    }
  }
  var loginPath1   = './login-github.json';
  var loginModel1;   
  loginModel1 = JSON.parse(fs.readFileSync(loginPath1));
  var temp1 = {'user': message.user , 'githubid' : '', 'githubtoken':'', 'githuborg':''};
  for(var i in loginModel1) {
    if(message.user == loginModel1[i].user) {
      temp1.githubid    = loginModel1[i].githubid;
      temp1.githubtoken = loginModel1[i].githubtoken;
      temp1.githuborg = loginModel1[i].githuborg;
    }
  }
  if(temp.gmailid == '') {
    bot.reply(message,"I don't have your gmail account info, please provide me your gmail id along with token in the following form:\nsetup-gmail-account gmailid=gmail-id gmailtoken=gmail-token\nLink for gmail token generation: https://developers.google.com/oauthplayground\nPlease generate gmail token in https://mail.google.com/ scope\n");
  } else if(temp1.githubid == '') {
    bot.reply(message,"I don't have your github account info, please provide me your github id along with the token and the github organization in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token githuborg=ncsu/general\n");
  } else {
    console.log("User credientials: " + JSON.stringify(temp) + "\n" + JSON.stringify(temp1) + "\n");
    var dataString = '';
    var finaldata  = '';

    // MOCK SERVICE
    //var issuelistData = JSON.parse(fs.readFileSync('./mock/' + message.user + '-issue-list.json'));
    //var mockService = nock("https://www.googleapis.com/gmail/v1/users")
    //.get('/' + temp.gmailid + '/messages')
    //.query({maxResults: 20})
    //.reply(200, issuelistData);

    dataString = restcall.getIssueList(temp.user, temp.gmailid, temp.gmailtoken);
    console.log("Issue list: " + JSON.stringify(dataString) + "\n");
    if(dataString.resultSizeEstimate == undefined) {
      bot.reply(message,"Error in server: Either the problem is with token, it has expired or the token is in gmail.metadata scope.\nplease generate gmail token in https://mail.google.com/ scope and update your gmail id and token by providing query in the following form:\nsetup-gmail-account gmailid=gmail-id gmailtoken=gmail-token\nLink for gmail token generation: https://developers.google.com/oauthplayground\n");
    } else if(dataString.resultSizeEstimate == 0){
      bot.reply(message,"No emails related to Github issues found\n");
    } else {
      var msgs = dataString.messages;
      var issueData = restcall.getAllIssueData(msgs,temp);
      console.log("Issue data: " + JSON.stringify(issueData) + "\n");
      //Error Handling
      if(issueData == "error") {
        bot.reply(message,"Error in server: Either the problem is with token, it has expired or the token is in gmail.metadata scope.\nplease generate gmail token in https://mail.google.com/ scope and update your gmail id and token by providing query in the following form:\nsetup-gmail-account gmailid=gmail-id gmailtoken=gmail-token\nLink for gmail token generation: https://developers.google.com/oauthplayground\n");
      } else {
      	//GitHUb token validation, required for processing travis status
        var validator = restcall.validateGithubToken(temp1.githubtoken, temp1.githuborg);
        if (validator == "error") {
                bot.reply(message,"Error in server: Either the problem is with Github token, it has expired/invalid or with the Github organization (We only supports ncsu/general).\nplease update your correct github id along with the token and the github organization by providing query in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token githuborg=ncsu/general\nTry Again.\n");
        } else {
      		for(var k=0;k<issueData.length;k++) {
        		// MOCK SERVICE
        		//mockdata = JSON.parse(fs.readFileSync('./mock/issue-'+issueData[k].issueid+'-'+issueData[k].repo+'-'+issueData[k].owner+'.json'));
        		//service = nock("https://github.ncsu.edu/api/v3/repos")
        		//.get('/' + issueData[k].owner + '/' + issueData[k].repo + '/issues/' + issueData[k].issueid)
        		//.reply(200, mockdata);
        		var tempissue = restcall.getIssueInfoRequest(issueData[k].owner,issueData[k].issueid,issueData[k].repo,temp1.githubtoken,temp1.githuborg); 
                        if (tempissue == "error") {
				errorCode = 1;
				break;
			} else {
        			finaldata = finaldata + "---------------------------------------------------\n" + " Repo: " + issueData[k].repo  + ", Issue: " + issueData[k].issueid + ", Owner: " + issueData[k].owner + "\n"+ "---------------------------------------------------\n" + "IssueUrl: " + tempissue.url + "\n" + "Title: " + tempissue.title + "\n" + "State: " + tempissue.state + "\n" + "Body: " + tempissue.body + "\n";
        			// MOCK SERVICE
        			//mockdata = JSON.parse(fs.readFileSync('./mock/comment-'+issueData[k].issueid+'-'+issueData[k].repo+'-'+issueData[k].owner+'.json'));
        			//service = nock("https://github.ncsu.edu/api/v3/repos")
        			//.get('/' + issueData[k].owner + '/' + issueData[k].repo + '/issues/' + issueData[k].issueid + '/comments')
        			//.reply(200, mockdata);
        			var tempcomment = restcall.getIssueCommentInfoRequest(issueData[k].owner,issueData[k].issueid,issueData[k].repo,temp1.githubtoken,temp1.githuborg);
				if (tempcomment == "error") {
					errorCode = 1;
					break;
				} else {
        				finaldata = finaldata + "--Comments--\n";
        				for(var l=0;l<tempcomment.length;l++){
          					finaldata = finaldata + "Id: " + tempcomment[l].id + "\ncomment: " + tempcomment[l].body + "\n";
        				}
				}
			}
      		}
		if (errorCode == 1) {
                	bot.reply(message,"Error in server: Either the problem is with Github token, it has expired/invalid or with the Github organization (We only supports ncsu/general).\nplease update your correct github id along with the token and the github organization by providing query in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token githuborg=ncsu/general\nTry Again.\n");
		} else {
      			finaldata = finaldata + "---------------------------------------------------" + '\nYou can perform two operations on the listed issues:\n1. update issue with state=open/closed issue=issueId repo=repoName owner=ownerName\n2. add comment as "description" on issue with issue=issueId repo=repoName owner=ownerName\n' + "---------------------------------------------------\n";
      			console.log("Result: " + finaldata + "\n");
      			bot.reply(message,finaldata);
		}
    	}
      }
    }
  }

  //MOCK clear call
  //nock.cleanAll()
}catch(err) {
 bot.reply(message, "Problem with network connectivity, Please try again after some times.\n");
}
});

// Function to add comment in an given issue.
controller.hears('add comment as',['mention', 'direct_mention','direct_message'], function(bot,message)
{
try
{
  var loginPath   = './login-github.json';
  var loginModel;   //contains all login credientials;
  loginModel = JSON.parse(fs.readFileSync(loginPath));
  var temp = {'user': message.user , 'githubid' : '', 'githubtoken':'', 'githuborg':''};
  for(var i in loginModel) {
    if(message.user == loginModel[i].user) {
      temp.githubid    = loginModel[i].githubid;
      temp.githubtoken = loginModel[i].githubtoken;
      temp.githuborg   = loginModel[i].githuborg;
    }
  }
  if(temp.githubid == '') {
    bot.reply(message,"I don't have your github account info, please provide me your github id along with the token and the github organization in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token githuborg=ncsu/general\n");
  } else {
    var tempdata = message.text.split(' ');
    var data = '';
    var issue = '';
    var repo = '';
    var owner= '';
    for (var i in tempdata) {
      if (tempdata[i].includes('issue=')){
        issue = tempdata[i].split('=')[1];
      } else if (tempdata[i].includes('repo=')) {
        repo = tempdata[i].split('=')[1];
      } else if (tempdata[i].includes('owner=')) {
        owner = tempdata[i].split('=')[1];
      }
    }
    var res = message.text.match( /"(.*?)"/gi );
    if ( res!= null && res.length == 1) 
    	data = res[0].replace(/["]*/g, '');
    console.log("Tokens in add comment on an issue request: " + issue + " " + repo + " " + owner + " " + data + "\n");
    if(issue == '' || repo == '' || owner == '' || data == '') {
      if(data=='') {
         bot.reply(message,'Invalid format. Description should be in double qoutes and only one double quotes is allowed.\n');
      } else
      	 bot.reply(message,'Sorry I could not understand, please provide me your credentials again in the following form:\nadd comment as "description" on issue with issue=issueId repo=repoName owner=ownerName\n');
    } else {
      var output = restcall.addIssueCommentInfoRequest(owner,issue,repo,temp.githubtoken,data,temp.githuborg);
      console.log("Http request result: " + output + "\n");
      if(output == "401")
        bot.reply(message,"Error in server: Either the problem is with Github token, it has expired/invalid or with the Github organization (We only supports ncsu/general).\nplease update your correct github id along with the token and the github organization by providing query in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token githuborg=ncsu/general\nTry again.\n");
      else if (output == "404")
        bot.reply(message,'Invalid data, please provide credentials again in the following form:\nadd comment as "description" on issue with issue=issueId repo=repoName owner=ownerName\n');
      else if (output == "405")
        bot.reply(message,"Given request can not be performed\n");
      else if (output == "not201")
        bot.reply(message,'Invalid data or problem with server, please provide credentials again in the following form:\nadd comment as "description" on issue with issue=issueId repo=repoName owner=ownerName\n');
      else
        bot.reply(message,"Comment has been added successfully");
    }
  }
}catch(err) {
 bot.reply(message, "Problem with network connectivity, Please try again after some times.\n");
}
});

//Function to update the state of an issue.
controller.hears('update issue with',['mention', 'direct_mention','direct_message'], function(bot,message)
{
try
{
  var loginPath   = './login-github.json';
  var loginModel;   //contains all login credientials;
  loginModel = JSON.parse(fs.readFileSync(loginPath));
  var temp = {'user': message.user , 'githubid' : '', 'githubtoken':'', 'githuborg':''};
  for(var i in loginModel) {
    if(message.user == loginModel[i].user) {
      temp.githubid    = loginModel[i].githubid;
      temp.githubtoken = loginModel[i].githubtoken;
      temp.githuborg   = loginModel[i].githuborg;
    }
  }
  if(temp.githubid == '') {
    bot.reply(message,"I don't have your github account info, please provide me your github id along with the token and the github organization in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token githuborg=ncsu/general\n");
  } else {
    var tempdata = message.text.split(' ');
    var state = '';
    var issue = '';
    var repo = '';
    var owner= '';
    for (var i in tempdata) { 
      if (tempdata[i].includes('issue=')){
        issue = tempdata[i].split('=')[1];
      } else if (tempdata[i].includes('repo=')) {
        repo = tempdata[i].split('=')[1];
      } else if (tempdata[i].includes('owner=')) {
        owner = tempdata[i].split('=')[1];
      } else if (tempdata[i].includes('state=')) {
        state = tempdata[i].split('=')[1];
      }
    }
    console.log("Tokens in update issue request: " + issue + " " + repo + " " + owner + " " + state + "\n");
    if(issue == '' || repo == '' || owner == '' || state == '') {
      bot.reply(message,"Sorry I could not understand, please provide me your credentials again in the following form:\nupdate issue with state=open/closed issue=issueId repo=repoName owner=ownerName\n");
    } else {
      var output = restcall.editIssueInfoRequest(owner,issue,repo,temp.githubtoken,state,temp.githuborg);
      console.log("Http request result: " + output + "\n");
      if(output == "401")
        bot.reply(message,"Error in server: Either the problem is with Github token, it has expired/invalid or with the Github organization (We only supports ncsu/general).\nplease update your correct github id along with the token and the github organization by providing query in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token githuborg=ncsu/general\nTry again.\n");
      else if (output == "404")
        bot.reply(message,"Invalid data, please provide credentials again in the following form:\nupdate issue with state=open/closed issue=issueId repo=repoName owner=ownerName\n");
      else if (output == "405")
        bot.reply(message,"Given request can not be performed\n");
      else if (output == "not200")
        bot.reply(message,"Invalid data or problem with server, please provide credentials again in the following form:\nupdate issue with state=open/closed issue=issueId repo=repoName owner=ownerName\n");
      else
        bot.reply(message,"Issue has been updated successfully");
    }
  }
}catch(err) {
 bot.reply(message, "Problem with network connectivity, Please try again after some times.\n");
}
});

//Function to list gmail pending invitations.
controller.hears(/invit.*mail|mail.*invit/gi,['mention', 'direct_mention','direct_message'], function(bot,message)
{
try
{
  var loginPath   = './login-gmail.json';
  var loginModel;   //contains all login credientials;
  loginModel = JSON.parse(fs.readFileSync(loginPath));
  var temp = {'user': message.user , 'gmailid' : '', 'gmailtoken':'' };
  for(var i in loginModel) {
    if(message.user == loginModel[i].user) {
      temp.gmailid    = loginModel[i].gmailid;
      temp.gmailtoken = loginModel[i].gmailtoken;
    }
  }
  if(temp.gmailid == '') {
    bot.reply(message,"I don't have your gmail account info, please provide me your gmail id along with token in the following form:\nsetup-gmail-account gmailid=gmail-id gmailtoken=gmail-token\nLink for gmail token generation: https://developers.google.com/oauthplayground\nPlease generate gmail token in https://mail.google.com/ scope\n");
  } else {
    console.log("User credientials: " + JSON.stringify(temp) + "\n");
    var dataString = '';
    var finaldata  = '';

    // MOCK SERVICE
    //var invitelistData = JSON.parse(fs.readFileSync('./mock/'+ message.user + '-invite-list.json'));
    //var mockService = nock("https://www.googleapis.com/gmail/v1/users")
    //.get('/' + temp.gmailid + '/messages')
    //.query({maxResults: 20})
    //.reply(200, invitelistData);

    dataString = restcall.getInviteList(temp.user, temp.gmailid, temp.gmailtoken);
    console.log("Invite list: " + JSON.stringify(dataString) + "\n");
    if(dataString.resultSizeEstimate == undefined) {
      bot.reply(message,"Error in server: Either the problem is with token, it has expired or the token is in gmail.metadata scope.\nplease generate gmail token in https://mail.google.com/ scope and update your gmail id and token by providing query in the following form:\nsetup-gmail-account gmailid=gmail-id gmailtoken=gmail-token\nLink for gmail token generation: https://developers.google.com/oauthplayground\n");
    } else if(dataString.resultSizeEstimate == 0){
      bot.reply(message,"No emails related to gmail invitation found\n");
    } else {
      var msgs = dataString.messages;
      var inviteData = restcall.getAllData(msgs,temp);
      console.log("Invite data: " + JSON.stringify(inviteData) + "\n");
      if(inviteData == "error") {
        bot.reply(message,"Error in server: Either the problem is with token, it has expired or the token is in gmail.metadata scope.\nplease generate gmail token in https://mail.google.com/ scope and update your gmail id and token by providing query in the following form:\nsetup-gmail-account gmailid=gmail-id gmailtoken=gmail-token\nLink for gmail token generation: https://developers.google.com/oauthplayground\n");
      } else {
      	for (var i = 0 ; i< inviteData.length ; i++) {
        	var h = base64url.decode(inviteData[i].payload.parts[0].parts[0].body.data)
        	var tempcontent = h.replace(/(\r\n|\n|\r)*Invitation from Google Calendar(\r\n|\n|\r|.)*/gm,"").replace(/(\r\n|\n|\r)*You have been invited to the following event.(\r\n|\n|\r)*/gm,"");
        	var re = new RegExp('https://www.google.com/calendar/event?(.*)'); 
        	var link  = tempcontent.match(re)[0];
        	var detail  = '<' + link + '|\tEvent Details>';
        	var yes     = '<' + link.replace("VIEW", "RESPOND") + '&rst=1|\tYes>';
        	var no      = '<' + link.replace("VIEW", "RESPOND") + '&rst=2|\tNo>';
        	var maybe   = '<' + link.replace("VIEW", "RESPOND") + '&rst=3|\tMaybe>';
        	var content = tempcontent.replace(/(\r\n|\n|\r)*Event details:(\r\n|\n|\r|.)*/gm,"");
        	finaldata = finaldata + "\n---------------------------------------------------\nYou have been invited to the following event\n---------------------------------------------------\n" + content + "\nActions:" +  "\n" + yes + "\n" + no + "\n" + maybe + "\nFor more information: " + detail + "\n";
      	}
      	console.log("Result: " + finaldata + "\n");
      	bot.reply(message,finaldata);
      }
    }	
  }

 // MOCK cleaning call 
 //nock.cleanAll()
}catch(err) {
 bot.reply(message, "Problem with network connectivity, Please try again after some times.\n");
}
});


// GMAIL acccount setup.
controller.hears('setup-gmail-account',['mention', 'direct_mention','direct_message'], function(bot,message)
{
try
{
  console.log("User credientials: " + JSON.stringify(message) + "\n");
  var tempdata = message.text.split(' ');
  var email = '';
  var token = '';
  for (var i in tempdata) {
    if (tempdata[i].includes('gmailid=')){
      email = tempdata[i].split('=')[1];
    } else if (tempdata[i].includes('gmailtoken=')) {
      token = tempdata[i].split('=')[1]; 
    }
  }
  console.log("Token in the given request: " + "email: " + email + " " + "token: " + token + "\n");
  if(email == '' || token == '') {
    bot.reply(message,"Sorry I could not understand, please provide me your credentials again in the following form:\nsetup-gmail-account gmailid=gmail-id gmailtoken=gmail-token\nlink for gmail token generation: https://developers.google.com/oauthplayground\n");
  } else {
    var loginPath   = './login-gmail.json';
    var loginModel;   //contains all login credientials;
    loginModel = JSON.parse(fs.readFileSync(loginPath));
    var temp = {'user': message.user , 'gmailid' : email, 'gmailtoken': token };
    var doupdate = 0;
    for(var i in loginModel) {
        if(message.user == loginModel[i].user) {
                loginModel[i].gmailid = email;
                loginModel[i].gmailtoken = token;
                doupdate = 1;
        }
    }
    if(doupdate == 0)
      loginModel.push(temp);
    fs.writeFileSync(loginPath, JSON.stringify(loginModel, null, 2));
    bot.reply(message,"Gmail account setup is done, now you can query the bot");
  }
}catch(err) {
 bot.reply(message, "Problem with network connectivity, Please try again after some times.\n");
}
});


// GITHUB account setup.
controller.hears('setup-github-account',['mention', 'direct_mention','direct_message'], function(bot,message)
{
try
{
  console.log("User credientials: " + JSON.stringify(message) + "\n");
  var tempdata = message.text.split(' ');
  var github = '';
  var token  = '';
  var org    = '';
  for (var i in tempdata) {
    if (tempdata[i].includes('githubid=')){
      github = tempdata[i].split('=')[1];
    } else if (tempdata[i].includes('githubtoken=')) {
      token = tempdata[i].split('=')[1];
    } else if (tempdata[i].includes('githuborg=')) {
      org = tempdata[i].split('=')[1];
    }
  }
  console.log("Token in the request: " + "github: " + github + " " + "token: " + token + " org: " + org + "\n");
  if(github == '' || token == '' || org == '' || (org != "ncsu" && org != "general")) {
   bot.reply(message,"Sorry I could not understand, please provide me your credentials again in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token githuborg=ncsu/general\n");
  } else {
    var loginPath   = './login-github.json';
    var loginModel;   //contains all login credientials;
    loginModel = JSON.parse(fs.readFileSync(loginPath));
    var temp = {'user': message.user , 'githubid' : github, 'githubtoken': token, 'githuborg': org};
    var doupdate = 0;
    for(var i in loginModel) {
        if(message.user == loginModel[i].user) {
                loginModel[i].githubid    = github;
                loginModel[i].githubtoken = token;
                loginModel[i].githuborg   = org;
                doupdate                  = 1;
        }
    }
    if(doupdate == 0)
      loginModel.push(temp);
    fs.writeFileSync(loginPath, JSON.stringify(loginModel, null, 2));
    bot.reply(message,"Github account setup is done, now you can query the bot");
  }
}catch(err) {
 bot.reply(message, "Problem with network connectivity, Please try again after some times.\n");
}
});

controller.hears(/(.)*(help)*(.)*/gi,['mention', 'direct_mention','direct_message'], function(bot,message)
{
    var msg = "I'm sorry, I don't understand the query!\n" + "For now I support 3 of the features:\n1. Listing of Github open pull request emails -- use alteast pull and mail keywords in the query.\n2. Listing of Github issue related emails -- use alteast issue and mail keywords in the query.\n3. Listing of gmail pending invitation emails -- use alteast invit and mail keywords in the query.\n";
    bot.reply(message,msg);
});

