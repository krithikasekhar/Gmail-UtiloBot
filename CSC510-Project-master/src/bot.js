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
  token: 'xoxb-259821616341-NGWpck8BwQl12FEPvSKTomY2',
}).startRTM()

// Function for open pull request emails operation.
controller.hears(/pull.*mail|mail.*pull/gi,['mention', 'direct_mention','direct_message'], function(bot,message) 
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
    bot.reply(message,"I don't have your gmail account info, please provide me your gmail id along with token in the following form:\nsetup-gmail-account gmailid=gmail-id gmailtoken=gmail-token\n");
  } else {
    console.log("User credientaisl:" + JSON.stringify(temp) + "\n");
    var dataString = '';    
    var finaldata  = '';
    var pulllistData = JSON.parse(fs.readFileSync('./mock/'+ message.user + '-pull-list.json'));
  
    // MOCK SERVICE
    var mockService = nock("https://www.googleapis.com/gmail/v1/users")
    //.persist() // This will persist mock interception for lifetime of program.
    .get('/' + temp.gmailid + '/messages')
    .query({maxResults: 20})
    .reply(200, pulllistData);
    dataString = restcall.getPullList(temp.user, temp.gmailid, temp.gmailtoken);
    console.log("Pull list data: " + JSON.stringify(dataString) + "\n");
    if(dataString.resultSizeEstimate == undefined) {
      bot.reply(message,"Error in server\n");
    } else if(dataString.resultSizeEstimate == 0){
      bot.reply(message,"No emails related to Github pull request found\n");
    } else {
      var msgs = dataString.messages;
      var pullData = restcall.getAllData(msgs,temp);
      console.log("All pull data: " + JSON.stringify(pullData) + "\n");
      var statusData = JSON.parse(fs.readFileSync('./mock/pull-status.json'));
      for (var i = 0 ; i< pullData.length ; i++) {
        var h = base64url.decode(pullData[i].payload.parts[0].body.data)
        var content = h.replace(/-- (\r\n|\n|\r)*You are receiving this because you are subscribed to this thread.(\r\n|\n|\r)*Reply to this email directly or view it on GitHub Enterprise:(\r\n|\n|\r)*(.)*/gm,"");
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
        finaldata = finaldata + "---------------------------------------------------\n" + " Repo: " + repo + ", Pull:" + pullnumber + ", Owner:" + owner + ", Travis-Status:" + statusData[pullnumber+"-"+repo+"-"+owner] + "\n"+ "---------------------------------------------------" + content;
      }
      finaldata = finaldata + "---------------------------------------------------" + "\nTo merge/close, please provide your choice in the following form:\nmerge/close pull request with pull=pullNumber repo=repoName owner=ownerName\n" + "---------------------------------------------------\n";
      console.log("Pull request result: " + finaldata + "\n");
      bot.reply(message,finaldata);
    }
  }
  nock.cleanAll()
});

// Function to merge a given pull request.
controller.hears('merge pull request with',['mention', 'direct_mention','direct_message'], function(bot,message)
{
  var loginPath   = './login-github.json';
  var loginModel;   //contains all login credientials;
  loginModel = JSON.parse(fs.readFileSync(loginPath));
  var temp = {'user': message.user , 'githubid' : '', 'githubtoken':'' };
  for(var i in loginModel) {
    if(message.user == loginModel[i].user) {
      temp.githubid    = loginModel[i].githubid;
      temp.githubtoken = loginModel[i].githubtoken;
    }
  }
  if(temp.githubid == '') {
    bot.reply(message,"I don't have your github account info, please provide me your github id along with token in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token\n");
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
      var output = restcall.mergePullRequest(owner,pull,repo,temp.githubtoken)
      console.log("merge pull request data: " + JSON.stringify(output) + "\n");
      if(output.message !=undefined && output.message == "Not Found")
      	bot.reply(message,"Invalid data or problem with server, please provide credentials again in the following form:\nmerge/close pull request with pull=pullNumber repo=repoName owner=ownerName\n");
      else
        bot.reply(message,output.message);
    }
  }
});

// Function to close a given pull request.
controller.hears('close pull request with',['mention', 'direct_mention','direct_message'], function(bot,message)
{
  var loginPath   = './login-github.json';
  var loginModel;   //contains all login credientials;
  loginModel = JSON.parse(fs.readFileSync(loginPath));
  var temp = {'user': message.user , 'githubid' : '', 'githubtoken':'' };
  for(var i in loginModel) {
    if(message.user == loginModel[i].user) {
      temp.githubid    = loginModel[i].githubid;
      temp.githubtoken = loginModel[i].githubtoken;
    }
  }
  if(temp.githubid == '') {
    bot.reply(message,"I don't have your github account info, please provide me your github id along with token in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token\n");
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
      var output = restcall.closePullRequest(owner,pull,repo,temp.githubtoken)
      console.log("close pull request data: " + JSON.stringify(output) + "\n");
      if(output.message !=undefined && output.message == "Not Found")
        bot.reply(message,"Invalid data or problem with serevr, please provide credentials again in the following form:\nmerge/close pull request with pull=pullNumber repo=repoName owner=ownerName\n");
      else
        bot.reply(message,"Given request is closed successfully");
    }
  }
});

// Function to list issue related emails.
controller.hears(/issue.*mail|mail.*issue/gi,['mention', 'direct_mention','direct_message'], function(bot,message)
{
  var loginPath   = './login-gmail.json';
  var service;
  var mockdata='';
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
  var temp1 = {'user': message.user , 'githubid' : '', 'githubtoken':'' };
  for(var i in loginModel1) {
    if(message.user == loginModel1[i].user) {
      temp1.githubid    = loginModel1[i].githubid;
      temp1.githubtoken = loginModel1[i].githubtoken;
    }
  }
  if(temp.gmailid == '') {
    bot.reply(message,"I don't have your gmail account info, please provide me your gmail id along with token in the following form:\nsetup-gmail-account gmailid=gmail-id gmailtoken=gmail-token\n");
  } else if(temp1.githubid == '') {
    bot.reply(message,"I don't have your github account info, please provide me your github id along with token in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token\n");
  } else {
    console.log("User credientials: " + JSON.stringify(temp) + "\n");
    var dataString = '';
    var finaldata  = '';
    var issuelistData = JSON.parse(fs.readFileSync('./mock/' + message.user + '-issue-list.json'));

    // MOCK SERVICE
    var mockService = nock("https://www.googleapis.com/gmail/v1/users")
    .get('/' + temp.gmailid + '/messages')
    .query({maxResults: 20})
    .reply(200, issuelistData);
    dataString = restcall.getIssueList(temp.user, temp.gmailid, temp.gmailtoken);
    console.log("Issue list: " + JSON.stringify(dataString) + "\n");
    if(dataString.resultSizeEstimate == undefined) {
      bot.reply(message,"Error in server\n");
    } else if(dataString.resultSizeEstimate == 0){
      bot.reply(message,"No emails related to Github issues found\n");
    } else {
      var msgs = dataString.messages;
      var issueData = restcall.getAllIssueData(msgs,temp);
      console.log("Issue data: " + JSON.stringify(issueData) + "\n");
      for(var k=0;k<issueData.length;k++){
        mockdata = JSON.parse(fs.readFileSync('./mock/issue-'+issueData[k].issueid+'-'+issueData[k].repo+'-'+issueData[k].owner+'.json'));
        service = nock("https://github.ncsu.edu/api/v3/repos")
        .get('/' + issueData[k].owner + '/' + issueData[k].repo + '/issues/' + issueData[k].issueid)
        .reply(200, mockdata);
         var tempissue = restcall.getIssueInfoRequest(issueData[k].owner,issueData[k].issueid,issueData[k].repo,temp1.githubtoken); 
         finaldata = finaldata + "---------------------------------------------------\n" + " Repo: " + issueData[k].repo  + ", Issue: " + issueData[k].issueid + ", Owner: " + issueData[k].owner + "\n"+ "---------------------------------------------------\n" + "IssueUrl: " + tempissue.url + "\n" + "Title: " + tempissue.title + "\n" + "State: " + tempissue.state + "\n" + "Body: " + tempissue.body + "\n";
        mockdata = JSON.parse(fs.readFileSync('./mock/comment-'+issueData[k].issueid+'-'+issueData[k].repo+'-'+issueData[k].owner+'.json'));
        service = nock("https://github.ncsu.edu/api/v3/repos")
        .get('/' + issueData[k].owner + '/' + issueData[k].repo + '/issues/' + issueData[k].issueid + '/comments')
        .reply(200, mockdata);
        var tempcomment = restcall.getIssueCommentInfoRequest(issueData[k].owner,issueData[k].issueid,issueData[k].repo,temp1.githubtoken);
        finaldata = finaldata + "--Comments--\n";
        for(var l=0;l<tempcomment.length;l++){
          finaldata = finaldata + "Id: " + tempcomment[l].id + "\ncomment: " + tempcomment[l].body + "\n";
        }
      }
      finaldata = finaldata + "---------------------------------------------------" + '\nYou can perform two operations on the listed issues:\n1. update issue with state=open/closed issue=issueId repo=repoName owner=ownerName\n2. add comment as "description" on issue with issue=issueId repo=repoName owner=ownerName\n' + "---------------------------------------------------\n";
      console.log("Result: " + finaldata + "\n");
      bot.reply(message,finaldata);
    }
  }
  nock.cleanAll()
});

// Function to add comment in an given issue.
controller.hears('add comment as',['mention', 'direct_mention','direct_message'], function(bot,message)
{
  var loginPath   = './login-github.json';
  var loginModel;   //contains all login credientials;
  loginModel = JSON.parse(fs.readFileSync(loginPath));
  var temp = {'user': message.user , 'githubid' : '', 'githubtoken':'' };
  for(var i in loginModel) {
    if(message.user == loginModel[i].user) {
      temp.githubid    = loginModel[i].githubid;
      temp.githubtoken = loginModel[i].githubtoken;
    }
  }
  if(temp.githubid == '') {
    bot.reply(message,"I don't have your github account info, please provide me your github id along with token in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token\n");
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
         //bot.reply(message,'Invalid format. Description should be in double qoutes and only one double quotes is allowed.\n');
          var ff = '<https://github.ncsu.edu/magrawa4/test2/pull/4|pull\trequest>';
          bot.reply(message,'You can view, comment on, or merge this'+ ff);
      } else
      	 bot.reply(message,'Sorry I could not understand, please provide me your credentials again in the following form:\nadd comment as "description" on issue with issue=issueId repo=repoName owner=ownerName\n');
    } else {
      var output = restcall.addIssueCommentInfoRequest(owner,issue,repo,temp.githubtoken,data);
      console.log("Http request result: " + output + "\n");
      if(output == "0")
        bot.reply(message,'Invalid data or problem with server, please provide credentials again in the following form:\nadd comment as "description" on issue with issue=issueId repo=repoName owner=ownerName\n');
      else
        bot.reply(message,"Given comment has been added successfully");
    }
  }
});

//Function to update the state of an issue.
controller.hears('update issue with',['mention', 'direct_mention','direct_message'], function(bot,message)
{
  var loginPath   = './login-github.json';
  var loginModel;   //contains all login credientials;
  loginModel = JSON.parse(fs.readFileSync(loginPath));
  var temp = {'user': message.user , 'githubid' : '', 'githubtoken':'' };
  for(var i in loginModel) {
    if(message.user == loginModel[i].user) {
      temp.githubid    = loginModel[i].githubid;
      temp.githubtoken = loginModel[i].githubtoken;
    }
  }
  if(temp.githubid == '') {
    bot.reply(message,"I don't have your github account info, please provide me your github id along with token in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token\n");
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
      var output = restcall.editIssueInfoRequest(owner,issue,repo,temp.githubtoken,state);
      console.log("Http request result: " + output + "\n");
      if(output == "0")
        bot.reply(message,"Invalid data or problem with server, please provide credentials again in the following form:\nupdate issue with state=open/closed issue=issueId repo=repoName owner=ownerName\n");
      else
        bot.reply(message,"Given issue status has been updated successfully");
    }
  }
});

//Function to list gmail pending invitations.
controller.hears(/invit.*mail|mail.*invit/gi,['mention', 'direct_mention','direct_message'], function(bot,message)
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
    bot.reply(message,"I don't have your gmail account info, please provide me your gmail id along with token in the following form:\nsetup-gmail-account gmailid=gmail-id gmailtoken=gmail-token\n");
  } else {
    console.log("User credientials: " + JSON.stringify(temp) + "\n");
    var dataString = '';
    var finaldata  = '';
    var invitelistData = JSON.parse(fs.readFileSync('./mock/'+ message.user + '-invite-list.json'));

    // MOCK SERVICE
    var mockService = nock("https://www.googleapis.com/gmail/v1/users")
    .get('/' + temp.gmailid + '/messages')
    .query({maxResults: 20})
    .reply(200, invitelistData);
    dataString = restcall.getInviteList(temp.user, temp.gmailid, temp.gmailtoken);
    console.log("Invite list: " + JSON.stringify(dataString) + "\n");
    if(dataString.resultSizeEstimate == undefined) {
      bot.reply(message,"Error in server\n");
    } else if(dataString.resultSizeEstimate == 0){
      bot.reply(message,"No emails related to gmail invitation found\n");
    } else {
      var msgs = dataString.messages;
      var inviteData = restcall.getAllData(msgs,temp);
      console.log("Invite data: " + JSON.stringify(inviteData) + "\n");
      for (var i = 0 ; i< inviteData.length ; i++) {
        var h = base64url.decode(inviteData[i].payload.parts[0].parts[0].body.data)
        var tempcontent = h.replace(/(\r\n|\n|\r)*Invitation from Google Calendar(\r\n|\n|\r|.)*/gm,"").replace(/(\r\n|\n|\r)*You have been invited to the following event.(\r\n|\n|\r)*/gm,"");
        var re = new RegExp('https://www.google.com/calendar/event?(.*)'); // to get pull number ie 9
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
  nock.cleanAll()
});


// GMAIL acccount setup.
controller.hears('setup-gmail-account',['mention', 'direct_mention','direct_message'], function(bot,message)
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
    bot.reply(message,"Sorry I could not understand, please provide me your credentials again in the following form:\nsetup-gmail-account gmailid=gmail-id gmailtoken=gmail-token\n");
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
});


// GITHUB account setup.
controller.hears('setup-github-account',['mention', 'direct_mention','direct_message'], function(bot,message)
{
  console.log("User credientials: " + JSON.stringify(message) + "\n");
  var tempdata = message.text.split(' ');
  var github = '';
  var token  = '';
  for (var i in tempdata) {
    if (tempdata[i].includes('githubid=')){
      github = tempdata[i].split('=')[1];
    } else if (tempdata[i].includes('githubtoken=')) {
      token = tempdata[i].split('=')[1];
    }
  }
  console.log("Token in the request: " + "github: " + github + " " + "token: " + token + "\n");
  if(github == '' || token == '') {
   bot.reply(message,"Sorry I could not understand, please provide me your credentials again in the following form:\nsetup-github-account githubid=github-id githubtoken=github-token\n");
  } else {
    var loginPath   = './login-github.json';
    var loginModel;   //contains all login credientials;
    loginModel = JSON.parse(fs.readFileSync(loginPath));
    var temp = {'user': message.user , 'githubid' : github, 'githubtoken': token };
    var doupdate = 0;
    for(var i in loginModel) {
        if(message.user == loginModel[i].user) {
                loginModel[i].githubid = github;
                loginModel[i].githubtoken = token;
                doupdate = 1;
        }
    }
    if(doupdate == 0)
      loginModel.push(temp);
    fs.writeFileSync(loginPath, JSON.stringify(loginModel, null, 2));
    bot.reply(message,"Github account setup is done, now you can query the bot");
  }
});

controller.hears(/(.)*(help)*(.)*/gi,['mention', 'direct_mention','direct_message'], function(bot,message)
{
    var msg = "I'm sorry, I don't understand the query!\n" + "For now I support 3 of the features:\n1. Listing of Github open pull request emails -- use alteast pull and mail keywords in the query.\n2. Listing of Github issue related emails -- use alteast issue and mail keywords in the query.\n3. Listing of gmail pending invitation emails -- use alteast invit and mail keywords in the query.\n";
    bot.reply(message,msg);
});

