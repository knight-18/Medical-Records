# Medical-Records

## Do not mess with master

### Work only on the dev branch

### Routes
 * GET ```/``` -> Renders the index page
 * User authentication routes: 
   * GET ```/signup``` -> Renders the registration view
   * POST ```/signup``` -> Creation of new user account
   * GET ```/login``` -> Renders the login view
   * POST ```/login``` -> User login
   * GET ```/logout``` -> Logs the user out and redirects to ```/login``` route
   * GET ```/profile``` -> Renders the profile page
