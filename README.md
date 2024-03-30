# Smart Placement Backend Instructions  
  
Install and open MySQL Workbench. 
Make sure the MySQL service is running on your computer. It must be running every time you want the app to access the database.  
For Windows, search for 'Services', scroll down to 'MySQL80', right click, and select 'Start'.  
For MAC, open 'System Preferences', click 'MySQL', and click 'Start MySQL Server'.  
  
In MySQL Workbench, create a new connection by clicking the +. Choose any connection name you want. The host and user should match what 'db.js' says:  
host: 'localhost',  
user: 'root',  
The password should be set to your MySQL password (not what 'db.js' says, but make sure to change the password in 'db.js' to match).  
Leave everything else default.  
Then run the statements from statements.sql by copying them to the editor and clicking the leftmost lightning bolt icon.  
  
Navigate to where you want to create the project, and enter  
$ npx create-node-app smart_placement_backend  
Copy all files in this repository to that directory.  
$ npm i  
$ npm start  
  
Install any missing modules  
$ npm i modulename  
  
$ npm start  
