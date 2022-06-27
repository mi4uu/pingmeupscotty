# pingMeUpScotty

![alt text](show.gif)

- run service :
  npm run service
- run server :
  npm start
- go to http://localhost:3000

DESCRIPTION:
the server is using KOA 
ping service is using the standard net library to create a custom HTTP server
the frontend is using fuse-box as a bundler
also, I did use REACT with REDUX and react-SAGAS to handle side effects. 
the frontend is using websockets to communicate with the server and provide live updates.



--------------------------- 
# task description

1. Create a service that pings HTTP domain - e.g. www.google.com - once every 30 seconds and keeps track of history (you may choose a proper format). 
You may not use a database for this application.

2. Create a HTTP server in NodeJS with an index route (/) that:
a) fetches and display ping history as "paginated" results.
b) call the "ping service" to run a brand new ping on demand (scheduled pings should not be corrupted).

3. Create simple SPA (using React stack) that can display the ping data going back by the time. As an initial state, we should fetch and display only five latest chunks (pages) of the latest data with the possibility to navigate to load previous results (e.g. load more button).

a) allow it to dynamically update the UI when new pings are recorded (including pause and resume).
b) create a button to run "ping on demand" and display the result as the latest result in the UI.
c) create a "clear" button that will clean up the whole app state and as a result will get back to the initial state (same like we had on the very first run by the end-user). 

Design and implement proper component and state management layers.
