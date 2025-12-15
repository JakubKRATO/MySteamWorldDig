Jakubland
#### Video Demo:  <URL HERE>
#### Description:
Below I'll explain what each of the files do (excluding images for obvious reasons)
/static
    /blocks - just contains images
    /css
        game.css - contains some little css for the game.html file NOTE: game.css is used across ALL of the templates
        index.css - css for thr main page NOTE: this file is used on ALL pages
        leaderboards.css - css formatting the loaderboards table
        login_register.css - css styling the form, inputs and buttons on the REGISTER and LOGIN page
        myprofile.css - little css for myprofile page
        profile.css - css for the profile page
        shop.css - css for the shop page
    /img - contains images used across the web, not in the game itself
    /js
        buy.js - contains the function used on the shop page which buys the skin (send a /buySkin POST request)
        game.js - main file of the game, let's break down some of the core functions
            main() - loads the world from localstorage if there is any stored data, setups the shop and surface darkness, starts the game loop, gets called after the player clicks the start game button
            generateWorld() - function which generated the world from y 0 all the way to the max Y row by row. Uses random numbers to generate ore positions. After the world is generated, it generated all the dungeons on top of it, then send a request to the server letting it know that a new run has started (simple GET request /start-run)
            updateWorld() - lets me know which stones are ores.
            renderWorld() - very important function, runs every frame to erase the canvas and paint it again, at the end it draws the player
            updatePlayer() - enables the user to use WASD to move, Arrow keys to use tools, Enter to teleport and Q to sell
            setDarkness() - uncovers new areas relative to the player position and their lamp upgrade level
            dig() - triggers when the player tries to "move" into a wall, if the mined block is an ore, adds it to the player bag
            setWall() - after a block is broken, return the correct replacement of air (the air is has different color based on Y value)
            renderGUI() - renders the player bag and the amount of TNT they have (if any), compass if they bought it
            generateDoor() - helper function to generate teleport doors more easily
            shopRender() - function which setups the shop
            boom() - function which runs if any tnt is placed
            endgame() - trigers an ending (good or bad), send /end-run POST containing the game stats
        leaderboards.js - loads the leaderboards from the server using a /get-leaderboards POST request
        when we get some data from the server we store it so we don't have to request new data so often
        login.js - frontend js for the form on the login page
        myprofile.js - js used for changing skins /selectSkin POST
        profile.js - when we visit the profile page, this script just formats the time to a readable format
        register.js - same as the login almost, redirects to login is the account was created successfully
        summary.js - script that creates the cool efect on the summary page
        testscript.js - a testing script, has no real use
    /skins - currently empty but ready to store images which would be used for skins
    /sounds - stores audio files used in the game
    skins.json - has the default skin and all the other ones (currently has 2 skins including default)

/templates
    chyba.html - page which is shown when an error occurs
    game.html - game page
    index.html - main page
    leaderboards.html - leaderboards page
    login.html - login page
    myprofile.html - settings page
    profile.html - use /profile/<username> to access someone's profile
    register.html - register page
    shop.html - shop page, currently has one skin the user can buy
    summary.html - hard to access page, accesible after completing a run
    template.html - contains the navbar, the css files used across all pages, has the main HTML structure
    tutorial.html - tutorial page

.env - contains passwords to access the database, port on which the app runs etc.
.gitignore - contains .env
README.md - ... (this is the file)
app.py - main file containing all the backend
    - has all the imports at the top 
    - activate db function
    - calcXP helper function
    /start-run
        generates an uuid (unique id) and inserts a new run into the db
    /end-run
        checks if the run has been completed to prevent cheating, then updates the user's stats (coins, xp, wins)
    /
        main page
    /game
        game page, loads the skin he user selected (default is "default" skin)
    /summary
        summary page
    /profile/<profile>
        fills the page with user user's data provided in the url
    /myprofile
        settings page
    /selectSkin
        changes the user skin based on what the frontend sent
    /leaderboards
        loads the leaderboards page
    /get-leaderboards
        returns the leaderboards data
    /tutorial
        loads the tutorial page
    /login
        login logic (similiar to the login in finance problem)
    /register 
        register logic
    /logout
        clears the session
    /shop
        render the shop page but check which offers has the user bought already
    /buySkin
        buys the selected skin if the user has money

    - then we start the server on port PORT
 
requirements.txt - contains all requirements
schema.txt - a very useful
file during development, allows me to check the schemas of my tables quickly
text.txt - a manual for my game, contains all the blocks, their number, name and texture







