# Problem Statement:

There are many applications that support email notifications for an event. The problem with it is that the user needs to traverse through the emails, click on each email then decide whether he/she needs to take some action. If there is some action that needs to be taken, then user needs to access the appropriate application and perform the required action. This makes the task very time consuming and inefficient. There’s also a possibility of missing out on some important email during the whole process. The idea behind our bot application is to provide a better way to perform the whole task efficiently by providing appropriate actions related to the email so that the user doesn't need to go to the application or open the appropriate web page to do the same. This makes the handling of such scenarios hassle free and less time consuming. 

For example, we get an email notification for a Github pull request. Usual course of action in such a scenario is to open the request in Github, check if it’s feasible to merge the request by checking the Travis build status for the particular pull request and then accept the merge request if Travis build status is successful, else reject it if the build fails or if the code is not upto the mark. The applicability of the idea can span many use cases, some of which have been explained in the document further.


# Bot Description:

### What the bot will do and how it will function:
The Gmail Bot interacts with the user to find out what operation they would like to perform, say, list all emails with github open pull requests. The bot will pick the keywords from the user’s query statement, analyze it and perform what user wants to do. If it fails to analyze the query, it will pick up the most probable task based on the query words, and ask user if that’s what the user wants to do. If yes, then it will perform the task, if not then it will further  assist the user to figure out what user wants to do. After knowing what task to perform, it will make calls to the appropriate APIs to carry out the specified task and show the output to the user.

For example, if the user asks the bot to list all the Github open pull request emails, the bot will make a gmail API call to fetch all the emails with Github pull requests and its details. The bot will also fetch the Travis build status for each particular pull request and display it to the user. The bot will be responsible for knowing what all actions can be taken for the particular task and provide icons for each action to the user. User can analyze the email content, travis build status  and click on the appropriate action. After the user clicks on the action, the bot will call the appropriate Github API to perform the action and return the status to the user.

### Why is a bot a good solution:
Bots are capable of understanding natural language and interpret them to perform the tasks specified by the user and facilitating the user experience by automating manual tasks. Many times, emails that have github pull requests, github issues or meeting invites are overlooked due to large volume. Further traversing all of these emails and opening them in the Github separately one by one is a time consuming task. To make the tasks fast and efficient, we need an interactive system that analyzes these plausible overlooked requests and provide the action link at the spot to speed up the process. As evidenced by the general bots like slack bot, they have been very successful to make the user’s experience better, efficient and enjoyable. That’s why we need a bot, to make such cumbersome tasks appear simple and elegant.


# Use Cases:

   ## Use case 1:  List all the GitHub open pull request emails with Travis build status along with Merge and Close action support.
	1.	Preconditions:
		User must have Gmail + GitHub API tokens in system
		
	2.	Main Flow
		User request the bot to list all the open pull request emails [S1]. Bot returns the list of all pull request emails 			along with its details containing the Travis build status triggered for the pull request, which will indicate the user 			if the pull request is good to merge or not [S2]. User select a pull request and based on Travis status, requests 			merge/close action on that pull request [S3]. Bot executes the user specified action [S4]. 
		
	3.	Sub Flow
		[S1] User request the bot to list all open pull request emails.
		[S2] Bot returns the list of the pull requests along with its details.
		[S3] User select a pull request and based on Travis status request merge/close action on that pull request.
		[S4] Bot executes the user specified action.
		
	4.	Alternate Flow
		[E1] No GitHub open pull request emails received by the user.

   ## Use case 2: List all the GitHub open issues emails with Update, Add a Comment and Close issue action support.
	1.	Preconditions:
		User must have Gmail + GitHub API tokens in system
		
	2.	Main Flow
		User requests the bot to list all the open issue emails [S1]. Bot returns the list of all open issues along with its 			content [S2]. User selects an issue and can perform an action on it such as adding a comment, updating the content of 			the issue and/or changing the status by closing the issue [S3]. Bot executes the user specified action [S4]. 
		
	3.	Sub Flow
		[S1] User requests the bot to list all the open issue emails.
		[S2] Bot returns the list of the open issues along with its details.
		[S3] User select an issue and can perform an action on it such as adding a comment, updating the content of the issue 			and/or changing the status by closing the issue.
		[S4] Bot executes the user specified action.
		
	4.	Alternate Flow
		[E1] No GitHub open issues emails received by the user.

   ## Use case 3: List all meeting or event invitation emails and support marking of the intent i.e. Attend, May Be or Reject the 	       invite.
	1.	Preconditions:
	   	User must have Gmail API tokens in system

	2.	Main Flow
		User requests the bot to list all the invitation emails [S1]. Bot returns the list of all e-invitations along with its 			details such as topic, date & time, place, and organizer [S2]. User selects an invite and mark the intent for the event 		such as Attend, May be or Reject the event. [S3]. Bot executes the user specified action [S4]. 
		
	3.	Sub Flow
		[S1] User requests the bot to list all the invitation emails.
		[S2] Bot returns the list of all e-invitations along with its details such as topic, date & time, place, and organizer.
		[S3] User selects an invite and mark the intent for the event such as Attend, May be or Reject the event.
		[S4] Bot executes the user specified action.
		
	4.	Alternate Flow
		[E1] No e-invitations received by the user.
		

# Design Sketches:

   ### Wireframe:

	1. GitHub open pull request email operation:
![list1](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/wireframe-pullrequest.png)

	2. GitHub open issues email operation:
![list1](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/wireframe-issuerequest.png)

	3. Meeting or event invitation email operation:
![list1](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/wireframe-inviterequest.png)

   ### Storyboard:

	1. GitHub open pull request email operation:
![notification](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/storyboard-pullrequest.png)

	2. GitHub open issues email operation:
![notification](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/storyboard-issuerequest.png)

	3. Meeting or event invitation email operation:
![notification](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/storyboard-inviterequest.png)
 

# Architecture Design:
   
   ### Architecture Diagram and component details:

   The architecture consists of four major components:-  
   1. Slack bot as a client for interacting with the user.  
   2. Server which process the client request by calling appropriate Gmail APIs’.  
   3. A datastore in form of RAM and hard disk required for storing user github & gmail credentials and also for processing of pull,
issue and invitation requests. 
   4. Third party servers which exposes Gmail and GitHub APIs in the form REST services.
   
   ![ArchitectureDesign](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/architecture-diagram-1.png)

   ### Architecture constraints and guidelines:
     
   The following are the constraints of the bot:-  
   1. It is assumed that the user’s Gmail and GitHub credentials in the form of token are stored in the datastore (encrypted) at once and user doesn’t provide it in every operation.  
   2. The bot has limited number of functionality and handle only selected use cases as proposed in the design document.  
   3. User would not be able to perform follow up operations i.e. all the operations are independent of each other and hence they do not share data. For example, user cannot use previously executed list operation output as a data set and perform some follow up operation on them.

   ### Design pattern:

   The following are the design pattern that will be used in the proposed project:-  
   1. **Conversational-styled pattern** - the interaction between the user and the bot will follow typical query-response pattern.  
   2. **Iterator** - When the result contains a set of emails, the pattern will be helpful in iterating through the set and performing   respective operations on them.  
   3. **Strategy** - used for analyzing the query statement from the user and form a logical interpretation step by step to perform the final task based on the keywords and structure of the query. The query statement can contain complex and composite statements where this design pattern will come into use.  
   4. **Factory** - For easy management and instantiation of objects for emails, other entities such as folders, categories, labels etc. 
   5. **Command** - For encapsulating the tasks to be performed as objects and passing them on for execution. Helpful for composite query statements.  
   6. **Interpreter** - For query statement interpretation and logic formalization.  
   7. **Decorator** - For adding attributes to the email objects dynamically.
   
