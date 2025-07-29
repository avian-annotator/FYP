# FIT316-12
Repository for FIT3161 and FIT3162 Computer Science Project for group S1_CS_11

# Set up
1. Download pgAdmin4 - this is the UI we will use to access/interact with the postgresDB, should we choose to do so manually. Postgres is a distribution based of SQL, and all the distributions of SQL have their own slight nauances, and as such you'll need specific UIs like pgAdmin4 to configure the DB, access, etc. 
2. Download docker desktop. Then open it.
3. Set up the .env.local, .env.development.local, .env.mock.local, .env.production.local. This is not important, though could be if you want to override things locally
4. run `bun run setup`. Install the deps if any of the commands fail.
5. run `docker-compose -f docker-compose.local.yml up --build`. This should start up everything locally.
6. Connect pgAdmin4 to your postgres db. Create a database as whatever you set DATABSE_NAME to.
7. Copy and paste setup.sql and execute it. This file sets the default admin username and password to be admin and admin respectively.

If you want the cool terminal thing, make sure to install bun, running `bun install` and then run `bun start` from the root. This needs to be fixed with the stuff that I've added since.

There are currently 5 different environments, some yet to be properly configured.
1. local. This is where you have EVERYTHING running on your machine
2. mock. This is the local server, PLUS a mocking environment that you can define in `frontend/local_with_mock/handles.ts`. This is useful if you are developing a frontend feature and the backend endpoint is not ready, but you also need a local environment with other api calls that have been implemented. Or, if you want to intercept (in laymans terms override) an api currently in use, for example if it is bugged.
3. Frontend. you need to go into `frontend` folder, and then do `bun run frontend`. This will spin up an isolated frontend, with the caveat that you need to mock all of the apis you plan on using. You would use this if you don't need, nor care about the backend. You would also use this as it's easier on your laptop as you don't need a VM for the backend.
4. development. This is intended to be the development server.
5. production. This is intended to be the prod server, should this be released commercially.

If you want to use intellij debug mode, make sure to connect the debug to localhost:5005, as that port exposes the bug server. To do this, go to Run/Debug configurations for the main java file, and then select Remote JVM debug. 

Every time you make a change to the backend, you need to run `docker-compose -f docker-compose.local.yml up --build` as you need to recompile the backend. 
Every time you add a package to the frontend, you need to run `docker-compose down`, delete the volume associated with the frontend, and then run `docker-compose -f docker-compose.local.yml up --build`. I need to fix this, I'll get to it :D. 

It is important that your db schema is up to date. We could use a migration tool to do that for us. Will look into it if I have the time. Nothing wrong with learning some SQL :D.

Generating api hooks - 
1. Run `./generate.bash` in bash (git bash or wsl on windows)/zsh after every change to the backend. Make sure the backend is running before doing that. This is vital to ensure that your api hooks work correctly.

# Standards
1. Conventional commits
2. Rebase and merge
These standards are highlighted in the [contributor guidelines]([url](https://avian-annotator.atlassian.net/wiki/x/AgD6))
