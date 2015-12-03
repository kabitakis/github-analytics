# github-analytics
A web application that provides beautiful charts based on data found in github issues and comments.

## Configuration
You are going to need a valid [Github Token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/).

Create your token and save it in a file:
```bash
echo YOUR_GITHUB_TOKEN > .env
```
You can also start without a [Github Token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/), however your requests will reach the [Github API Rate Limit](https://developer.github.com/v3/#rate-limiting) quickly.

## Installation (option 1/3)
```bash
npm install
```
```bash
./node_modules/.bin/browserify -t reactify public/*.js -o public/js/bundle.js
```
```bash
GHTOKEN="$(< .env)" NODE_ENV=production node github-analytics.js
```

## Build & run a Docker image (option 2/3)
If you use Docker you can skip the Installation process and start with the following commands. Keep in mind you must have a node.js docker image installed (docker pull node).

Build the docker image:
```bash
docker build -t github-analytics .
```
Choose the environment (NODE_ENV=local|staging|production) and run your container:
```bash
docker run -p 3000:3000 -e GHTOKEN="$(< .env)" -e NODE_DEV=production --name analytics01 -t github-analytics
```

## Use the Docker image (option 3/3)
Pull the docker image:
```bash
docker pull kabitakis/github-analytics
```
Choose the environment (NODE_ENV=local|staging|production) and run your container:
```bash
docker run -p 3000:3000 -e GHTOKEN="$(< .env)" -e NODE_ENV=production --name analytics01 -t kabitakis/github-analytics
```

## Usage
Try the following urls to get an idea of how the app works:
* http://localhost:3000
* http://localhost:3000/api/issues
* http://localhost:3000/?user=devstaff-crete&repo=DevStaff-Heraklion&labels=Topics&state=open&term=:%2B1:&exclusive=1&per_page=100
* http://localhost:3000/api/issues/?user=devstaff-crete&repo=DevStaff-Heraklion&labels=Topics&state=open&term=:%2B1:&exclusive=1&per_page=100

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
