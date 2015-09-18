# github-analytics
A web application that provides beautiful charts based on data found in github issues and comments.

## Installation
```bash
npm install
browserify -t reactify public/*.js -o public/js/bundle.js
GHTOKEN='YOUR_GITHUB_TOKEN' node github-analytics.js
```

## Usage
Try the following urls to get an idea of how the app works:
* {your_app_url}/?user=devstaff-crete&repo=DevStaff-Heraklion&state=open&term=:%2B1:
* {your_app_url}/api/issues/?user=devstaff-crete&repo=DevStaff-Heraklion&state=open&term=:%2B1:

### Params
* user (String): Required.
* repo (String): Required.
* labels (String): Optional. String list of comma separated Label names. Example: "bug,ui,@high"
* state (String): Optional. open, closed, or all Validation rule: ^(open|closed|all)$.
* term (String): Required. The term to search for in the comments of the issues.

## Examples
* https://powerful-sands-5380.herokuapp.com/
* https://powerful-sands-5380.herokuapp.com/api/issues

## Todo
* Add charts: votes (and voters) per issue, votes per user, issue votes per date
* Add form to input params: org/user, repo, issue label, voting emoji
