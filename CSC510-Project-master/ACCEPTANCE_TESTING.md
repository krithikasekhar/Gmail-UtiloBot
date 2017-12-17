## Use case 1:  List latest GitHub pull request emails with Travis build status along with merge and close action support.
	1.	Preconditions:
		Bot requires user's Gmail and github account credientials in order to perform the given operation. If there are no user's credentials or if they have expired, the bot will prompt the user to enter their Gmail Id, GitHub Id and the respective tokens.
		
	2.	Main Flow
		User request the bot to list the latest pull request emails [S1]. Bot returns the list of pull request emails along with its details containing the Travis build status triggered for the pull request, which will indicate the user if the pull request is good to merge or not [S2]. User select a pull request and based on Travis status, requests merge/close action on that pull request [S3]. Bot executes the user specified action [S4]. 

	3. 	Possible Request
    		* Can you fetch pull request emails  
    		* Pull request mails  
    		* Can you list all the pull request mails  
    		* Please provide me the list of all pull emails  
    		* Need pull request mails  
    		* Get me all mails which have pull requests  
    		* Want a list of Github pull request emails  

	4.	Sub Flow
		[S1] User request the bot to list the latest pull request emails.
		[S2] Bot returns the list of the pull requests along with its details.
		[S3] User select a pull request and based on Travis status request merge/close action on that pull request.
		[S4] Bot executes the user specified action.
		
	5.	Alternate Flow
		[E1] No GitHub pull request emails received by the user. If the user does not have any pull request emails, the bot replies saying No emails related to Github pull request have been found. The usecase ends here.  

### Detailed Explanation with screenshots:
1. Login to https://utilobot.slack.com with the account created for the demo purpose.
	* Input: 
		* Email-address as softwareengineering.demo@gmail.com with Password as utilobot
	* Expected Output:
		* Logged in

![login-image](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/login-image.jpeg)

2. Go to mailbot and query the bot for listing pull related mails.
	* Input: 
		* List me pull request emails
	* Expected Output:
		* Bot does not have the user gmail credientials or it has been expired, hence  bot will prompt the user to enter their Gmail Id, and its access tokens.
		
![pull-query](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/pull-query.JPG)

3. In order to add gmail id along with its token to the bot database, generate gmail token by using following steps:
	* visit https://developers.google.com/oauthplayground 
	* select Gmail API V1 with https://mail.google.com/ scope
	* Authorize the api
	* Exchange authorization code with access token
	* Finally save the access token.

![gmail-setup1](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/gmail-setup1.JPG)

![gmail-setup2](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/gmail-setup2.JPG)

4. Now add gmail credentails in the format mentioned by the bot.
	* Input: 
		* setup-gmail-account gmailid=softwareengineering.demo@gmail.com gmailtoken=xxxxxx
	* Expected Output:
		* Gmail account setup is done, now you can query the bot
		
![gmail-setup-confirm](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/gmail-setup-confirm.JPG)

5. Now query the bot for listing pull related mails. 
	* Input: 
		* List me pull request emails
	* Expected Output:
		* Bot does not have the user github credientials or it has been expired, hence  bot will prompt the user to enter their GitHub Id, GitHub tokens and the organization.
		
![pull-query2](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/pull-query2.JPG)

6. Go to github account, generate personal access token and then add github credentails in the format mentioned by the bot.
	* Input: 
		* setup-github-account githubid=utilobot githubtoken=0c2a1d1731353653fca44e959abc22b9d453db0d githuborg=general
	* Expected Output:
		* Github account setup is done, now you can query the bot
		
![github-setup-confirm](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/github-setup-confirm.JPG)

7. Now Query the bot for listing pull related mails.
	* Input: 
		* List me pull request emails
	* Expected Output:
		* Bot returns the list of the pull requests along with its details.

![pull-result](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/pull-result.JPG)

8. User select a pull request and based on Travis status and request close action on that pull request.
	* Input: 
		* close pull request with pull=13 repo=designtest1 owner=maheshagrawal728
	* Expected Output:
		* Given request is closed successfully

![pull-close](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/pull-close.JPG)

9. User select a pull request and based on Travis status and request merge action on that pull request.
	* Input: 
		* merge pull request with pull=14 repo=designtest1 owner=maheshagrawal728
	* Expected Output:
		* Given request is merged successfully

![pull-merge](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/pull-merge.JPG)


## Use case 2:  List the latest GitHub issues emails with update and add a comment action support.
	1.	Preconditions:
		Bot requires user's Gmail and github account credientials in order to perform the given operation. If there are no user's credentials or if they have expired, the bot will prompt the user to enter their Gmail Id, GitHub Id and the respective tokens.
		
	2.	Main Flow
		User requests the bot to list the latest open issue emails [S1]. Bot returns the list of open issues along with its content [S2]. User selects an issue and can perform an action on it such as adding a comment, updating the content of the issue and/or changing the status by closing the issue [S3]. Bot executes the user specified action [S4]. 

	3. 	Possible Request
		* Can you fetch issue related emails  
		* issue mails  
		* Can you list all the issue emails  
		* Please provide me the list of all issue related emails  
		* Need issue related mails   
		* Want a list of Github issue emails  
		* The bot will look-up for the words 'issue' and 'mail' and fetch the Github issue related emails.   

	4.	Sub Flow
		[S1] User requests the bot to list the latest open issue emails.
		[S2] Bot returns the list of the open issues along with its details.
		[S3] User select an issue and can perform an action on it such as adding a comment, updating the content of the issue and/or changing the status by closing the issue.
		[S4] Bot executes the user specified action. 
		
	5.	Alternate Flow
		[E1]  No GitHub issues emails received by the user. If the user does not have any issue related emails, the bot replies saying No emails related to Github issues have been found and ends the usecase.  
  
### Detailed Explanation with screenshots:
1. Login to https://utilobot.slack.com with the account created for the demo purpose.
	* Input: 
		* Email-address as softwareengineering.demo@gmail.com with Password as utilobot
	* Expected Output:
		* Logged in

![login-image](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/login-image.jpeg)

2. Go to mailbot and query the bot for listing issue related mails. Assuming User Gmail and GitHub credientails are stored in the bot and has not been expired. Otherwise user has to generate and add credientials as shown in usecase 1. 
	* Input: 
		* List me issue request emails
	* Expected Output:
		* Bot returns the list of the issue requests along with its details.

![issue-result](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/issue-result.JPG)

3. User select an issue and performs close action on it.
	* Input: 
		* update issue with state=closed issue=1 repo=DemoRepo owner=maheshagrawal728
	* Expected Output:
		* Issue has been updated successfully

![issue-close](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/issue-close.JPG)

4. User select an issue and performs comment addition action on it.
	* Input: 
		* add comment as "very important" on issue with issue=3 repo=DemoRepo owner=maheshagrawal728
	* Expected Output:
		* Comment has been added successfully

![issue-comment](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/issue-comment.JPG)


### Use case 3:  List latest Google meeting or event invitation and support marking of the intent i.e. Attend, May Be or Reject the invite. 
	1.	Preconditions:
		Bot requires user's Gmail account credientials in order to perform the given operation. If there are no user's credentials or if they have expired, the bot will prompt the user to enter their Gmail Id along with its token.
		
	2.	Main Flow
		User requests the bot to list the latest invitation emails [S1]. Bot returns the list of e-invitations along with its details such as topic, date & time, place, and organizer [S2]. User selects an invite and mark the intent for the event such as Attend, May be or Reject the event. [S3]. Bot executes the user specified action [S4]. 

	3. 	Possible Request
		* Can you fetch invite emails  
		* invitation emails  
		* invite mails  
		* Can you list all the invite emails  
		* Please provide me the list of all invitation emails  
		* Need invite related mails   
		* Want a list of Gmail invite emails  
		* The bot will look-up for the words 'invit' and 'mail' and fetch the invitation related emails. 

	4.	Sub Flow
		[S1] User requests the bot to list the latest invitation emails.
		[S2] Bot returns the list of e-invitations along with its details such as topic, date & time, place, and organizer.
		[S3] User selects an invite and mark the intent for the event such as Attend, May be or Reject the event.
		[S4] Bot executes the user specified action. 
		
	5.	Alternate Flow
		[E1] No e-invitations received by the user. If the user has not received any invitation emails, the bot replies saying no invite emails are found and ends the usecase.    

### Detailed Explanation with screenshots:
1. Login to https://utilobot.slack.com with the account created for the demo purpose.
	* Input: 
		* Email-address as softwareengineering.demo@gmail.com with Password as utilobot
	* Expected Output:
		* Logged in

![login-image](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/login-image.jpeg)

2. Go to mailbot and query the bot for listing gmail invitation related mails. Assuming User Gmail credientails are in the bot and has not expired. Otherwise user has to generate and add credientials as shown in usecase 1. 
	* Input: 
		* List me invite request emails
	* Expected Output:
		* Bot returns the list of e-invitations along with its details such as topic, date & time, place, and organizer..
		
![invite-result](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/invite-result.JPG)


3. Select an invite and mark the intent for the event such as Attend, May be or Reject the event.
	* Input: 
		* Click on action Yes/No/Maybe
	* Expected Output:
		* Response recorded.
		
![invite-response](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/invite-response.JPG)
