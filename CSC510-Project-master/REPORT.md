# Project GoogleMail UtiloBot - Report  

## Team Members:  
  >  Mahesh Agrawal - magrawa4  
     Ashima Singh - asingh26  
     Kshittiz Kumar - kkumar4  
     Krithika Sekhar - ksekhar  
     Jagadeesh Saravanan - jsarava  

## The Problem the bot solved:
There are many applications that support email notifications for an event. The problem with it is that the user needs to traverse 
through the emails, click on each email then decide whether he/she needs to take some action. If there is some action that needs
to be taken, then user needs to access the appropriate application and perform the required action. This makes the task very 
time consuming and inefficient. There’s also a possibility of missing out on some important email during the whole process. 
The idea behind our bot application is to provide a better way to perform the whole task efficiently by providing appropriate 
actions related to the email so that the user doesn't need to go to the application or open the appropriate web page to do the same. 
This makes the handling of such scenarios hassle free and less time consuming. 

For example, we get an email notification for a Github pull request. Usual course of action in such a scenario is to open the request in Github, check if it’s feasible to merge the request by checking the Travis build status for the particular pull request and then accept the merge request if Travis build status is successful, else reject it if the build fails or if the code is not upto the mark.  

## Primary features and Screenshots:  
The Gmail Bot interacts with the user to find out what operation they would like to perform, say, list all emails with github pull requests. The bot will pick the keywords from the user’s query statement, analyze it and perform what user wants to do. If it fails to analyze the query, it will pick up the most probable task based on the query words, and ask the user if that’s what the user wants to do. If yes, then it will perform the task, if not then it will further assist the user to figure out what user wants to do. After knowing what task to perform, it will make calls to the appropriate APIs to carry out the specified task and show the output to the user. We have made use of Gmail and Github APIs to make the calls.  
The bot handles three main usecases:  
### 1. List the latest GitHub pull request emails with Travis build status along with Merge and Close action support:  
The user can request the Bot to list all the pull request emails and once the request is made, the Travis build status is also checked for all the corresponding pull requests and the results are returned to the user. Based on the Travis status, the user can now either merge or close the pull request directly through the bot without having to go to the Github application.If the user does not have any pull request emails, the bot replies saying No emails related to Github pull request have been found.   

When the user logs in for the first time, the bot requests the user to complete their Gmail and Github setup so that the necessary tokens are generated and the credentials are stored in the backend database.  

![pull-query](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/pull-query.JPG)  

**Listing of all the pull request emails:**    

![pull-result](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/pull-result.JPG)  

**Closing the pull request:**    

![pull-close](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/pull-close.JPG)  

**Merging the pull request:**    

![pull-merge](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/pull-merge.JPG)

### List the latest GitHub issues emails with update and add a comment action support:  
Bot requires user's Gmail and github account credientials in order to perform the given operation. If there are no user's credentials or if they have expired, the bot will prompt the user to enter their Gmail Id, GitHub Id and the respective tokens.User requests the bot to list the latest open issue emails. Bot returns the list of open issues along with its content. User selects an issue and can perform an action on it such as adding a comment, updating the content of the issue and/or changing the status by closing the issue. Bot executes the user specified action.If the user does not have any issue related emails, the bot replies saying No emails related to Github issues have been found.  

**List of the issue requests along with its details:**

![issue-result](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/issue-result.JPG)  

**Closing of issue:**  

![issue-close](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/issue-close.JPG)  

**Adding comment to issue:**  

![issue-comment](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/issue-comment.JPG)  

### List latest Google meeting or event invitation and support marking of the intent i.e. Attend, May Be or Reject the invite:  

Bot requires user's Gmail account credientials in order to perform the given operation. If there are no user's credentials or if they have expired, the bot will prompt the user to enter their Gmail Id along with its token. User requests the bot to list the latest invitation emails. Bot returns the list of e-invitations along with its details such as topic, date & time, place, and organizer. User selects an invite and mark the intent for the event such as Attend, May be or Reject the event. Bot executes the user specified action. If the user has not received any invitation emails, the bot replies saying no invite emails are found.  

**List of invite requests:**  

![invite-result](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/invite-result.JPG)  

**Sending a response to the invite:**  

![invite-response](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/invite-response.JPG)  


## Reflection on development process and project:  

### Agile methodology:  

> We followed the Agile methodology throughout the project thereby focusing on working software over comprehensive documentation and on collaboration rather than negotiation. We gave importance to responding to changes that came up while working out our plan. By keeping short sprint periods, new features were added to the project and integrated seamlessly. Regular team meetings were held to keep track of the development and to discuss future work. Several approaches and methodologies were discussed before choosing an optimal one. For example: during deployment phase we discussed which online platfrom will be best and easily accesible for deploying out bot, we considered aws, digital ocean and VCL. After considering pros and cons on cost, efficiency and flexibility we decided to go with VCL. As and when we found issues in development we did pair programming in order to figure where the problems were. 

### Task Tracking through Trello:  

> We made use of Trello cards to track our weekly progress. Each team member was assigned roles and responsibilities which helped the team to know who exactly was working on which part. The very first step was to define what all we need to do in a particular mile stone on 'To Do' board. Each team member would come up with ideas on what to do and how to do it, after proper discussion we formulated one order and posted on trello 'To Do' board. Also assignment of due date and which team member would work on which functionaity or task was also decided collaboratively. After a firm decision on each member's responsibility, implementation began with each member gradually moving cards to 'Under Progress' and finally to 'Completed' trello boards prior their due dates. We also utilized peer reviewing so as soon as a team member completed his/her duty other member of the team would review it to make sure everything was completed as defined. It made it easier for us to reach out to the appropriate person for clarifications, etc. Through the use of Trello cards, we were also able to set shorter sprint periods, approximately 7 days, within each milestone, to further ease the development process. Trello provided timely reminders and this ensured that we were always on track.  

### Continuous Integration:  

> Throughout the duration of the development phase, continuous integration was followed where the team members were required to integrate code into a shared repository several times a day. By integrating regularly, errors were detected quickly, and were also able to locate them more easily. As duties of each team members were properly defined and documented, integration was relatively smoother process. We took few functionalies at a time and collaboraitvely integrated them while discussing thoroughly with the members who worked on it. Solving bugs was also not an issue because of shared responsibilty, only those members were called to resolve an issue related to a particular feature who were responsible for it's implementation thus saving time of team as whole. 

## Future Work:  
#### Broaden the scope of each use case
Currently our bot is capable of delivering only top 20 mails now we plan to extend it's scope of delivering at the very least top 100 mails with an ability to search and select relevant mails based on the user's choice.
#### Better user interface
Right now our interface is simple. we could make it more dynamic with inclusion of buttons and lists to display content related to mails and also some animations to describe actions like merge or close for better understanding. 
#### Robust bot interaction 
We could make conversation with our bot more robust by using NLTK library so that our bot would have extensive variety of responses.
#### Extra features
We could use graphical representation of content displayed like risk percentage of merge/close pull request with travis build failure or keep track of  missed meeting invites.



