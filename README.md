# Medical-Records

## Do not mess with master

### Work only on the dev branch

### Routes
 * GET ```/``` -> Renders the index page
 * User authentication routes
   * GET ```/signup``` -> Renders the registration view
   * POST ```/signup``` -> Creation of new user account
   * GET ```/login``` -> Renders the login view
   * POST ```/login``` -> User login
   * GET ```/logout``` -> Logs the user out and redirects to ```/login``` route
   * GET ```/profile``` -> Renders the profile page
### Installation 
(Note : These instructions are only for developers/testers for now)
1) Open git bash or cmd
2) Clone the repo: 
```
git clone https://github.com/knight-18/Medical-Records
```
3) Change to the **Medical-Records** directory
```
cd Medical-Records
```
4) Since the operational code is in the ```dev-branch```, and the current branch is ```master```, checkout a tracking branch pointing to the ```dev-branch``` of the remote repo (changes will get pulled automatically)
```
git checkout --track origin/dev-branch
```
5) Obtain the **.env** file and place it inside the root (**Medical-Records**) directory
6) Open your git bash or cmd again, and cd to the **Medical-Records** directory. Then
```
npm install
```
After all packages have gotten installed, 
```
nodemon src/app.js
```

Web app will be accessible at ```localhost:3000```
