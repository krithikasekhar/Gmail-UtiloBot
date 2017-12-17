# Milestone: DEPLOYMENT 
The goal of this milestone is to demonstrate a fully deployed version of GoogleMail UtiloBot bot present in slack team https://utilobot.slack.com. Invitation has been sent for mentioned slack team, please join and can either use general channel or directly can use mailbot apps (more secure, no one else can see your important data) in order to perform testing.   

***Note:*** We have chosen NCSU VCL as our deployment environment.  

## Deployment
We have used configuring management tools to fully provisioning and configuring a remote environment for the bot.
Ansible script can be found at [Deployment Script](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/provision.yml) and the inventory script at [Inventory Script](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/src_deploy/inventory)<br>
 ***Steps for running the script:***
* First fill up the script with credentials already shared with instructors via mail:
   * SLACK_TOKEN (Slack bot token)
   * REPO (Project repository to be cloned)
   * download the key id_softeng into the path /root/.ssh/id_softeng
* Run command "ansible-playbook -i inventory provision.yml -vvv" from your system.
* After above step bot will be up and running.



## Acceptance Testing
Testing can be performed via two ways. Instructors can either use their Gmail id's, Utilobot slack team account(invitation sent), Github repository, where they have enable email notifiation (enable watching all activites via email) or can use the already created demo account for testing with the following credientials.
  * Gmail Account: softwareengineering.demo@gmail.com with password as utilobot
  * Github Account: utilobot with password as utilobot123 and token as 0c2a1d1731353653fca44e959abc22b9d453db0d
  * Slack Account: softwareengineering.demo@gmail.com with password as utilobot (screen name as Demo)<br>

### Instructions for Acceptance Testing:
For all the interactions with the bot in shared channel, user should start the conversation with @mailbot, followed by the message else in case of direct interaction with the bot, user can start directly with the message.  

***link for Acceptance Testing Detailed Instructions***: 
[Acceptance_Testing](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/ACCEPTANCE_TESTING.md)



## Task Tracking
Please look into the [WORKSHEET-DEPLOY](https://github.ncsu.edu/magrawa4/CSC510-Project/blob/master/WORKSHEET-DEPLOY.md) file for task tracking information.  
[Trello cards](https://trello.com/utilobot)



## Screen Cast
The link to the screencast demonstrating the functioning of the bot is given below:  
https://youtu.be/K0xvuyEm-L8
