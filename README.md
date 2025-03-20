# FIT316-12
Repository for FIT3161 and FIT3162 Computer Science Project for group S1_CS_11

# Set up
1. Download pgAdmin4 - this is the UI we will use to access/interact with the postgresDB, should we choose to do so manually. Postgres is a distribution based of SQL, and all the distributions of SQL have their own slight nauances, and as such you'll need specific UIs like pgAdmin4 to configure the DB, access, etc. 
2. Download docker desktop. Then open it.
3. Set up a .env file, and put that file into the root. Create values for DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD
4. run `docker-compose up --build`. This should start up everything

If you want the cool terminal thing, make sure to install bun, and then run `bun start` from the root.
If you want to use intellij debug mode, make sure to connect the debug to localhost:5050, as that port exposes the bug server
Every time you make a change to the backend, you need to run `docker-compose build` or `bun run build` as you need to recompile the backend, which means recreating an image
