# github-analytics
A web application that provides beautiful charts based on data found in github issues and comments.

## Installation
```bash
npm install
./node_modules/.bin/browserify -t reactify public/*.js -o public/js/bundle.js
GHTOKEN='YOUR_GITHUB_TOKEN' node github-analytics.js
```
You can also start without a [Github Token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/), however your requests will reach the [Github API Rate Limit](https://developer.github.com/v3/#rate-limiting) quickly.

## Usage
Try the following urls to get an idea of how the app works:
* {your_app_url}/?user=devstaff-crete&repo=DevStaff-Heraklion&labels=Topics&state=open&term=:%2B1:&exclusive=1&per_page=100
* {your_app_url}/api/issues/?user=devstaff-crete&repo=DevStaff-Heraklion&labels=Topics&state=open&term=:%2B1:&exclusive=1&per_page=100

### Params
* user (String): Required.
* repo (String): Required.
* labels (String): Optional. String list of comma separated Label names. Example: "bug,ui,@high"
* state (String): Optional. open, closed, or all Validation rule: ^(open|closed|all)$.
* term (String): Required. The term to search for in the comments of the issues.
* exclusive (Boolean): Optional. Count term per user rather than per comment. Can be either ommited (false) or set to 1 (true).
* per_page (Number): Optional. A custom page size up to 100. Default is 30. Validation rule: ^[0-9]+$.

## Examples
* http://analytics.devstaff.gr/
* http://analytics.devstaff.gr/api/issues
