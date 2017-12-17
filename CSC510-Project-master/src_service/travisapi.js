console.log(getTravisStatus('kshittiz', 'testingTravis', 2, 'cafac567120fd2b58fec80418b27fa4dc7447abd'));
/*
function to get travis build status
*/
function getTravisStatus(owner, repo, pull_request_number, github_token) {

        //getting travis authorization token using github token
        var travis_token;
        var sync = true;
        var out  = null;
        var authenticateTravis = {
                url : 'https://api.travis-ci.org/auth/github?github_token='+ github_token,
                method: 'POST',
                headers: {"User-Agent": "MyClient/1.0.0", "content-type": "application/json", "Accept": "application/vnd.travis-ci.2+json"}
        };
        request(authenticateTravis, function (error, response, body)
        {
                if (error)
                       { out = error; console.log("error: "+ out);}
                else
                       { 
                         out = JSON.parse(body);
                         travis_token=out.access_token;
                       }
                sync = false;
        });
        while(sync) {require('deasync').sleep(100);} 
         
        //Now using travis token to get build status of pull request using pull request number through travis api0..
        var syncAgain = true;      
        var travis_status;
        var pull_request_title;
        var travisBuilds = {
                url : 'https://api.travis-ci.org/repos/'+ owner+'/'+repo+'/builds',
                method: 'GET',
                headers: {"User-Agent": "MyClient/1.0.0", "content-type": "application/json", "Accept": "application/vnd.travis-ci.2+json",
                "Authorization": "token " + travis_token}
        };
        request(travisBuilds, function (error, response, body)
        {
                if (error)
                       { out = error; console.log("error: "+ out);}
                else
                       { 
                         out = JSON.parse(body);
                         data = out.builds;
                         for(var i=0; i< data.length;++i){
                                 if(data[i].pull_request_number!=null && data[i].pull_request_number === pull_request_number) {
                                        pull_request_title = data[i].pull_request_title;
                                        travis_status = data[i].state;
                                 }
                         }
                       }

                       syncAgain=false;
        });

        while(syncAgain) {require('deasync').sleep(100);}  
        
        console.log(pull_request_title);
        return travis_status;
}

