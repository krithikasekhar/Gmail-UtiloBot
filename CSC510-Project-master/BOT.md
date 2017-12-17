# Use Cases:

   ## Use case 1:  List all the GitHub pull request emails with Travis build status along with Merge and Close action support.
	1.	Preconditions:
		User must have Gmail + GitHub API tokens in the system
		
	2.	Main Flow
		User request the bot to list all the pull request emails [S1]. Bot returns the list of all pull request emails along with its details containing the Travis build status triggered for the pull request, which will indicate the user if the pull request is good to merge or not [S2]. User specifies a pull request and based on Travis status, requests merge/close action on that pull request [S3]. Bot executes the user specified action [S4]. 
		
	3.	Sub Flow  
		[S1] User request the bot to list all pull request emails.
		[S2] Bot returns the list of the pull requests along with its details.
		[S3] User select a pull request and based on Travis status request merge/close action on that pull request.
		[S4] Bot executes the user specified action.
		
	4.	Alternate Flow
		[E1] No GitHub pull request emails received by the user.
		

   ## Use case 2: List all the GitHub issues emails with action options such as updating the issue status or adding a Comment on the issue.
	1.	Preconditions:
		User must have Gmail + GitHub API tokens in the system
		
	2.	Main Flow
		User requests the bot to list all the issue emails [S1]. Bot returns the list of all issues along with its content [S2]. User specifies an issue and can perform an action on it such as adding a comment, updating the status of the issue (close , open) [S3]. Bot executes the user specified action [S4]. 
		
	3.	Sub Flow
		[S1] User requests the bot to list all the issue emails.
		[S2] Bot returns the list of the issues along with its details.
		[S3] User specifies an issue and can perform an action on it such as adding a comment, updating the status of the issue (close, open).
		[S4] Bot executes the user specified action.
		
	4.	Alternate Flow
		[E1] No GitHub issues emails received by the user.

   ## Use case 3: List all Google meeting or event invitation emails and support marking of the intent i.e. Attend, May Be or Reject the 	       invite.
	1.	Preconditions:
	   	User must have Gmail API tokens in system

	2.	Main Flow
		User requests the bot to list all the Google invitation emails [S1]. Bot returns the list of all e-invitations along with its details such as topic, date & time, place, and organizer [S2]. User selects an invite and mark the intent for the event such as Attend, May be or Reject the event. [S3]. Bot executes the user specified action [S4]. 
		
	3.	Sub Flow
		[S1] User requests the bot to list all the Google invitation emails.
		[S2] Bot returns the list of all e-invitations along with its details such as topic, date & time, place, and organizer.
		[S3] User selects an invite and mark the intent for the event such as Attend, May be or Reject the event.
		[S4] Bot executes the user specified action.
		
	4.	Alternate Flow
		[E1] No e-invitations received by the user.
    
# Mocking:

The mocking files used for this project are present [here](src/mock). Our bot mocks all the calls to the Gmail and Github APIs and retrieves the necessary data from the mock files. We have created several mock data files for different use cases. 

# Bot Implementation:
Please refer [here](src) for Bot Implementation.  
  
  Major files implementing bot functionalities are:  
1. [bot.js](src/bot.js)  
2. [restcall.js](src/restcall.js)
3. [Github](src/login-github.json)   
4. [Gmail](src/login-gmail.json)  

# Selenium testing:
Refer [Selenium](Selenium) for testing files.
There are 3 test cases for each use case, so totalling to 9 test cases. Each use case has one good path test case and two alternate path test cases.  

### Use case 1  
1. Good path : Listing all the pull request emails, able to merge and close them [[1]]( src/test/java/selenium/tests/UseCase1TestCaseGoodPath.java)
2. Alt path 1  : No pull request emails available [[2]](src/test/java/selenium/tests/UseCase1TestCaseAltPath1.java)
3. Alt path 2  : User credentials not present to list pull request emails[[3]](src/test/java/selenium/tests/UseCase1TestCaseAltPath2.java)

### Use case 2  
1. Good path  : Listing all the Githib issue emails, able to update, comment and close the issue [[1]]( src/test/java/selenium/tests/UseCase2TestCaseGoodPath.java)
2. Alt path 1 : No issue emails available [[2]]( src/test/java/selenium/tests/UseCase2TestCaseAltPath1.java)
3. Alt path 2 : User credentials not present for listing issue use case [[3]]( src/test/java/selenium/tests/UseCase2TestCaseAltPath2.java) 

### Use case 3  
1. Good path  : Listing all meeting or event invitation emails and provide yes, no or maybe intent [[1]]( src/test/java/selenium/tests/UseCase3TestCaseGoodPath.java)
2. Alt path 1 : No meeting invite emails available [[2]]( src/test/java/selenium/tests/UseCase3TestCaseAltPath1.java) 
3. Alt path 2 : User is not authenticated/ allowed for listing meeting invites [[3]]( src/test/java/selenium/tests/UseCase3TestCaseAltPath2.java) 

# Task Tracking:
Please look into the [WORKSHEET](WORKSHEET.md) file for task tracking information.  

[Trello cards](https://trello.com/utilobot)
# Screencast: 
The link to the screencast demonstrating the functioning of the bot is given below:  
https://youtu.be/sfo0TjQdvdA

The link to the screencast demonstrating Selenium Testing is given below:  
https://drive.google.com/file/d/0B21iWkIzFBQ1RXdMdFpfZ1MtU28/view

