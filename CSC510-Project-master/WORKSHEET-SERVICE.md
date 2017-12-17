## `Trello Task Tracking`  

[Trello Card Week 4](https://trello.com/b/JeeUo0Bb/week4)      


[Trello Card Week 5](https://trello.com/b/mygLJOix/week-5) 


[Trello Card Week 6](https://trello.com/b/rSFhQVrW/week6) 


### All Use Cases common functionalities  

| Tasks   | Sub Tasks   
| ------------- | ------------ 
| Google token research       |  * Identify how to get Google tokens and authentication parameters.   
| Handle REST calls and response regular expression for the gmail api   | * Identify HTTP method and URL parameters for the REST calls.<br>* Parse and extract the required data from JSON response.
| GitHub API request  | * Discern token requirements and REST calls for Github.<br>* Make API request based on user input and update GitHub data.         


### Use Case 1 - (Pull request Emails) specific functions  

| Tasks   | Sub Tasks   
| ------------- | ------------ 
| List Pull request Emails       |  * Query Gmail API to list all pull emails.<br>* Display repo name, owner and pull request link.
| Integrate Travis CI| * Identify token requirements and REST calls for Travis.<br>* Get Travis status for each pull request and display to the user. 
| Github pull request status       | * Get merge or close action request from user.<br>* Make GitHub REST call to update pull request status.         
| Fix bugs, edge cases | * Handle cases like no pull request emails found.<br>* Travis status not updated.
  
### Use Case 2 - (Issue Emails) specific functions  

| Tasks   | Sub Tasks   
| ------------- | ------------ 
| List Issue Emails       |  * Query Gmail API to list all issue related emails.<br>* Display repo name, owner and issue number.
| Get User input   | * Get the user action.<br>* User can either change the status of an issue (open/ close) or add comment to an issue. <br>* Parse it to find the user intention, repo name, owner of an issue.
| Github issue details       | * Perform GitHub REST call to reflect the requested action of the user.
| Fix bugs, edge cases | * Handle cases like no issue related emails found.<br>* Display only necessary information about an issue to the user.

## Use Case 3 - (Invite Emails) specific functions  

| Tasks   | Sub Tasks   
| ------------- | ------------ 
| List Google invite Emails       |  * Query Gmail API to list all Google invite emails.<br>* Display event name, organizer, schedule, venue and attendies.
| Act on an invite  | * Get the user action (Yes, No, May be) for an event.<br>* Make Gmail API call and update event confirmation.     
| Fix bugs, edge cases | * Handle cases like no invite emails found. 


## Integration and Screencast

| Tasks   | Sub Tasks   
| ------------- | ------------ 
| Bot interface      |  * Enable the bot to get input from the user.<br>* Integrate all use cases with the bot interface.<br>* Make the bot to reply to the user with appropriate answer.
| Modify bot's reply  | * Bot Shows only necessary information to the user.      
| Fix bugs, edge cases | * Handle incorrect or irrelevant input by the user.
| Screencast | * Provide input to the bot.<br>* Attempt all the use cases.<br>* Get the bot's reply.<br>* Screencast the above steps.
