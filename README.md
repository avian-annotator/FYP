# FIT316-12
Repository for FIT3161 and FIT3162 Computer Science Project for group S1_CS_11

# Set up
1. Download pgAdmin4 - this is the UI we will use to access/interact with the postgresDB, should we choose to do so manually. Postgres is a distribution based of SQL, and all the distributions of SQL have their own slight nauances, and as such you'll need specific UIs like pgAdmin4 to configure the DB, access, etc. 
2. Download docker desktop. Then open it.
3. Set up a .env file, and put that file into the root. Create values for DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD. Also set up .env.test
4. run `docker-compose up --build`. This should start up everything.
5. Connect pgAdmin4 to your postgres db. Create a database as whatever you set DATABSE_NAME to.
6. Copy and paste setup.sql and execute it. This file sets the default admin username and password to be admin and admin respectively.

If you want the cool terminal thing, make sure to install bun, and then run `bun start` from the root.

If you are frontend, you can mock backend api requests. See frontend/mocks/handlers.ts and define your mock apis there. Navigate to frontend, and then run `bun run mock`

If you want to use intellij debug mode, make sure to connect the debug to localhost:5005, as that port exposes the bug server. To do this, go to Run/Debug configurations for the main java file, and then select Remote JVM debug. You also need to define a .env.mock file in the /src/frontend folder, defining the variable `VITE_BACKEND_URL=http://localhost:8080`

Every time you make a change to the backend, you need to run `docker-compose -f docker-compose.local.yml up --build` as you need to recompile the backend. 
Every time you add a package to the frontend, you need to run `docker-compose down`, delete the volume associated with the frontend, and then run `docker-compose -f docker-compose.local.yml up --build`. I need to fix this, I'll get to it :D. 

It is important that your db schema is up to date. We could use a migration tool to do that for us. Will look into it if I have the time. Nothing wrong with learning some SQL :D.

Generating api hooks - 
1. Run `./generate-types.bash` in bash (git bash or wsl on windows)/zsh after every change to the backend. Make sure the backend is running