# Problem Statement:

Organizing and cleaning up of our email inbox is a time consuming and cumbersome task. Over the years after creating our accounts, our inbox hosts so many unwanted, unorganized emails, just stored in one place in haphazard manner. Imagine a desk with hundreds of files just laying with no organization whatsoever. We have important emails buried somewhere and takes forever to find them. There are ways to organize the things the way we want, but who has the time. Nobody is willing to spend hours of going through thousands of emails and deciding what to do with them. Here’s where our bot comes to rescue.

For instance, it takes a lot of time for creating a rule in Gmail which will automatically move emails from specific senders to user-defined folders as and when they receive them. Secondly, there is no way to statistically analyze our emails in a simplified manner. While organizing our emails, it’s helpful to see and analyze all our emails according to a specific criterion over a given period of time before we perform any operations on them like labelling, putting in a separate folder, deleting, marking important etc. Normally there is no way to do that but to attempt it with brute force, spend valuable time over such menial tasks and still there are chances of missing out few emails. The Gmail bot will help the user in analyzing and organizing emails quickly and efficiently.

# Bot Description:

What the bot will do and how it will function - The Gmail Bot interacts with the user to find out what operation they would like to perform, say, a query based search, delete mails, filter out mails, or modify a label. For example, listing senders in decreasing order of number of mails received from them to know if they are worth keeping in the inbox or moving them out to a separate folder. The Gmail client does not offer simplified ways of performing the above tasks and our bot has been designed to solve such problems. The bot will pick the keywords from the user’s query statement, analyze it to make sense of it and perform what user wants to do. If it fails to make sense of it, it will pick up the most probable task based on the query words, and ask user if that’s what the user wants to do. If yes, then it will perform the task, it not then it will assist the user further to figure out what user wants to do. After knowing what task to perform, it then will make calls to the Gmail API to carry out the specified task and show the output to the user. 

Why is a bot a good solution - Bots are capable of understanding natural language and interpret them to perform the tasks specified by the user. We can implement this system where user enters a query and the system will run the query and give the result. It will be like how we run an SQL query. User will not be willing to learn how to formulate queries with a certain syntax just for email organization. To make the tasks simple and efficient, we need an interactive system that doesn’t confuse and overwhelm the user and which understands what user wants. As evidenced by the general bots like slack bot, they have been very successful to make the user’s experience better, efficient and enjoyable. That’s why we need a bot, to make complex tasks appear simple and elegant.


# Use Cases:

   ## Use case 1:  Listing of emails based on user defined query.
	1.	Preconditions:
		User must have Gmail API v3 tokens in system

	2.	Main Flow
		User provides a query and request the bot to list all the emails satisfying the query.  Query is a user defined search option  which Gmail application doesn’t provide such as: 
			●	listing emails based on time/date frames, labels or sender/receiver id. 
			●	statistical query like sorting and listing senders according to the number of emails received from them over a given period of time.
			●	composite query as well that consist of one or more simplified queries [S1]. 
		Bot returns the email list based on the query requested [S2].
	
	3.	Sub Flow
		[S1] User provides list command along with a user defined query.
		[S2] Bot returns the list of emails based on the user requested query.

	4.	Alternate Flow
		[E1] No email satisfying the given query or the query is not supported by the Bot.

   ## Use case 2: Deletion of emails based on user defined query.  
	1.	Preconditions:
		User must have Gmail API v3 tokens in system
	
	2.   	Main Flow
		User request the bot to delete emails and specify what kind of delete operation user wants to perform such as:
			●	Deleting emails based on time/date frames, labels or sender/receiver id. 
			●	Deleting emails based on some statistical operation such as deleting all the email received from a sender who has send largest number of emails over a given period or the combination of above.
		Bot returns the list of emails to be deleted. User confirms to delete them permanently or to move them to trash [S2]. Bot deletes/trashes the emails [S3].
      	
	3.   	Sub Flow
		[S1] User provides delete command along with the query
		[S2] Bot returns the list of emails and asks for confirmation to delete them permanently or move them to trash. User confirms it.
		[S3] Bot deletes/trashes the mails and show the confirmation message to the user.

	4.	Alternate Flow
		[E1] No Emails to delete.

   ## Use Case 3: Modification of emails attributes based on user defined query.
	1.	Preconditions:
		User must have Gmail API v3 tokens in system

	2.	Main Flow
		User request bot to modify emails’ attribute by providing the attribute to be modified along with what emails to be 	considered such as marking emails as important or spam, flagging, archiving, labeling them etc. [S1]. Bot returns email list to be 	modified. Users confirms the operation [S2]. Bot modifies these emails by updating the attributes [S3].
	
	3.	Sub Flow
		[S1] User provides kind of emails along with the attributes to be modified.
		[S2] Bot returns the list of emails to be modified and asks for confirmation. User confirms it.
		[S3] Bot modifies the attributes of the listed mails and show the confirmation message to the user.
	
	4.	Alternate Flow
		[E1] Given attribute is not supported by the bot or no email available satisfying the given query.

   ## Use Case 4: Filtering and segregating emails based on user defined filter criteria.
	1.	Preconditions:
		User must have Gmail API v3 tokens in system.
		
	2.	Main Flow
		User request the bot to filter emails and move them to a specified folder based on a user defined filter criterion such as sender id, subject line, time/date frame etc. [S1]. Bot returns the list of emails to be filtered or segregated and asks for confirmation. Users confirms the operation [S2]. Bot creates a new folder, pushes filtered emails to that folder and returns the number of emails moved [S3].
		
	3.	Sub Flow
		[S1] User provides filter command along with the folder name and filter criteria.
		[S2] Bot returns the list of emails to be filter/segregate and asks for confirmation. User confirms it.
		[S3] Bot creates a new folder, pushes filtered emails to that folder and show the confirmation message to the user.

	4.	Alternate Flow
		[E1] No Email available to filter/segregate.

   ### Use Case 5: Stop notifications
	1.	Preconditions:
		User must have Gmail API v3 tokens in system
		
	2.	Main Flow
		User request the bot to start or stop notifications for receiving emails based on time/date duration [S1]. Bot starts or stops the Gmail notification in the specified period and confirms the user[S2].

	3.	Sub Flow
		[S1] User provides stop notification command with @date/time.
		[S2] Bot confirms the notification action and stop the notification feature.

	4.	Alternate Flow
		[E1] Operation not performed because of network problem.

# Design Sketches:

   ### Wireframe:

   	1.  List Operation:
![list1](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/wireframe-list1.png)
![list2](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/wireframe-list2.png)

	2.  Delete Operation:
![delete](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/wireframe-delete.png)
 
	3.  Filter or Segregate Operation:
![filter](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/wireframe-filter.png)
 
	4.  Modify emails’ attribute Operation:
![modify](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/wireframe-modify.png)

	5.   Stop Notification Operation:
![notify](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/wireframe-notify.png)
 

   ### Storyboard:

	1.  List Operation:
![list1](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/storyboard-list1.png)
![list2](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/storyboard-list2.png)
 
	2.  Delete Operation:
![delete](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/storyboard-delete.png)
 
	3.  Filter or Segregate Operation:
![filter](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/storyboard-filter.png)
 
	4.  Modify emails’ attribute Operation:
![modify](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/storyboard-modify.png)
 
	5.  Stop Notification Operation:
![notification](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/storyboard-notification.png)
 


# Architecture Design:
   
   ### Architecture Diagram and component details:
     
   The architecture consists of four major components:-  
   1. Slack bot as a client for interacting with the user.  
   2. Server which process the client request by calling appropriate Gmail APIs’.  
   3. Datastore in form of RAM and hard disk required for processing some complex request such as request for retrieving the sender address who has sent the largest number of mails in last week.  
   4. Third party google mail server which exposes Gmail APIs in the form REST services.
   
   ![ArchitectureDesign](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/images/architecture-diagram.png)

   ### Architecture constraints and guidelines:
     
   The following are the constraints of the bot:-  
   1. In case of listing/deletion/segregation/modification of emails, it is assumed that the user knows what kind of emails user are  looking for performing given operation i.e. user need to provide search queries in well-defined format that Bot can understand.  
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
   
