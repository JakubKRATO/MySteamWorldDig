import os
import uuid
import math
import json
import random
from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash
import mysql.connector
from flask import Flask, render_template, request, redirect, session
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.secret_key = "e4a9c3d7f12b48c6a97d53e2c49fb01d6a8e3f4c29bd7150f93a2ce8d674b2af"

def activate_db():
    connection = mysql.connector.connect(
        host=os.getenv("MYSQLHOST"),
        user="root",
        password=os.getenv("MYSQLPASSWORD"),
        database="jakubland",
        port=os.getenv("MYSQLPORT")
    )
    db = connection.cursor()
    return connection, db

# Calculate xp
def calcXP(time, money, tnt):
    totalSeconds = time / 1000
    minutes = math.floor(totalSeconds / 60)

    # get XP from money
    xp = money - 1000
    if xp < 1:
        xp = 2
    else:
        xp = math.ceil(xp / 100)
    
    # get XP from time
    xp = xp + math.floor(minutes / 25)

    # get XP from tnt
    tnt_reward = 0
    if tnt < 70:
        tnt_reward = 5
    elif tnt < 100:
        tnt_reward = 4
    elif tnt < 125:
        tnt_reward = 3
    elif tnt < 150:
        tnt_reward = 2
    else:
        tnt_reward = 1

    xp += tnt_reward
    return xp

@app.route("/start-run")
def startRun():
    connection, db = activate_db()
    worldId = str(uuid.uuid4())

    print(session["user_id"])
    try:
        db.execute("INSERT INTO games (user_id, world_id, completed) VALUES (%s, %s, 0);", (session["user_id"], worldId))
    except Exception:
        return {"uuid": None, "ans" : "error"}
    connection.commit()

    connection.close()
    return {"uuid": worldId}

@app.route("/end-run", methods=["POST"])
def endRun():
    data = request.get_json()

    worldId = data.get("uuid")
    tnt = data.get("tnt")
    money = data.get("money")
    time = data.get("time")

    print(worldId, time, money, tnt)
    connection, db = activate_db()

    # Checks if the game has already been completed
    db.execute("SELECT completed FROM games WHERE world_id = %s;",(worldId,))
    rows = db.fetchone()
    print(rows)
    if rows[0] == 1 or not rows:
        return {"status": "cheater"}
    
    print("NOT cheater!")
    db.execute("UPDATE games SET tnt = %s, money = %s, time = %s, completed = 1 WHERE world_id = %s", (tnt, money, time, worldId))

    # increment user's total wins
    db.execute("SELECT wins, xp, coins FROM users WHERE id = %s;", (session["user_id"],))
    rows = db.fetchone()
    
    wins = rows[0] + 1
    xp = rows[1] + calcXP(int(time), int(money), int(tnt))
    coinsRandom = random.randint(3,5)
    coins = rows[2] + coinsRandom

    db.execute("UPDATE users SET wins = %s, xp = %s, coins = %s WHERE id = %s;", (wins, xp, coins ,session["user_id"]))

    connection.commit()
    connection.close()
    return {"status" : "ok", "coins" : coinsRandom}

@app.route("/")
def index():
    if not session.get("name"):
        return render_template("index.html")
    
    now = datetime.now()
    connection, db = activate_db()
    print(now.strftime("%Y-%m-%d %H:%M:%S"))
    db.execute("UPDATE users SET last_online = %s WHERE id = %s;", (now.strftime("%Y-%m-%d %H:%M:%S"),session["user_id"]))

    connection.commit()
    connection.close()
    print(session["name"])
    return render_template("index.html", name=session["name"])

@app.route("/game")
def game():
    if not session.get("name"):
        return redirect("/login")
    
    with open("static/skins.json", "r", encoding="utf-8") as file:
        skins = json.load(file)
    
    default = skins["default"]
    connection, db = activate_db()
    db.execute("SELECT skin FROM users WHERE id = %s;", (session["user_id"],))

    playerSkinDB = db.fetchone()

    playerSkin = skins[playerSkinDB[0]]
    
    skin = {**default, **playerSkin}
    return render_template("game.html", skin=json.dumps(skin))

@app.route("/summary")
def summary():
    world_id = request.args.get("world_id")
    coins = request.args.get("coins")
    if not world_id or not coins:
        return redirect("/login")

    connection, db = activate_db()

    db.execute("SELECT time, money, tnt FROM games WHERE world_id = %s;", (world_id,))

    data = db.fetchone()
    if not data:
        render_template("chyba.html", message="Internal server error - no game data found")

    return render_template("summary.html", data=data, coins=coins)

@app.route("/profile/<profile>")
def profile(profile):
    connection, db = activate_db()

    try:
        db.execute("SELECT nickname, coins, xp, wins, id FROM users WHERE nickname = %s;", (profile,))

        data = db.fetchall()
        if data[0][3] == 0:
            return render_template("profile.html", data=data[0], time="N/A", money="N/A", tnt="N/A")

        db.execute("SELECT time FROM games WHERE user_id = %s AND time IS NOT NULL ORDER BY time LIMIT 1;", (data[0][4],))
        time = db.fetchall()
        db.execute("SELECT money FROM games WHERE user_id = %s AND money IS NOT NULL ORDER BY money DESC LIMIT 1;", (data[0][4],))
        money = db.fetchall()
        db.execute("SELECT tnt FROM games WHERE user_id = %s AND tnt IS NOT NULL ORDER BY tnt LIMIT 1;", (data[0][4],))
        tnt = db.fetchall()
    except Exception:
        return render_template("chyba.html", message="Error while loading profile data... try again later")

    connection.close()
    return render_template("profile.html", data=data[0], time=time[0][0], money=money[0][0], tnt=tnt[0][0])

@app.route("/myprofile")
def myprofile():
    if not session["user_id"]:
        return render_template("login.html")
    
    connection, db = activate_db()
    db.execute("SELECT skins.id, name, see_name FROM skins JOIN skin_transactions as t ON skins.id = t.skin_id WHERE user_id = %s;", (session["user_id"],))
    data = db.fetchall()

    db.execute("SELECT skin FROM users WHERE id = %s;", (session["user_id"],))
    selected = db.fetchone()

    print(data,selected)
    return render_template("myprofile.html", skins=data, selected=selected[0])

@app.route("/selectSkin", methods=["POST"])
def selectSkin():
    data_json = request.get_json()
    name = data_json.get("name")

    print(f"Chanhing skin to: {name}")
    connection, db = activate_db()

    # change user skin
    db.execute("UPDATE users SET skin = %s WHERE id = %s;", (name, session["user_id"]))

    connection.commit()
    return {"message" : "ok"}
@app.route("/leaderboards")
def leaderboards():
    return render_template("leaderboards.html")

@app.route("/get-leaderboards", methods=["POST"])
def getLeaderboards():
    connection, db = activate_db()
    data = request.get_json()
    type = data["type"]

    match type:
        case "cash":
            # I know it doesn't look believable but I ACTUALLY wrote this query!
            db.execute("SELECT u.nickname, g.time, g.money, g.tnt, g.timestamp FROM games AS g JOIN users AS u ON g.user_id = u.id JOIN (SELECT user_id, MAX(money) as best_money FROM games GROUP BY user_id) AS secondTable ON g.user_id = secondTable.user_id AND g.money = secondTable.best_money ORDER BY g.money DESC;")
        case "time":
            # this query was written by AI (yes i feel ashamed)
            db.execute("SELECT u.nickname, g.time, g.money, g.tnt, g.timestamp FROM games g JOIN users u ON g.user_id = u.id JOIN (SELECT user_id, MIN(time) AS best_time FROM games WHERE completed = 1 GROUP BY user_id ) b ON g.user_id = b.user_id AND g.time = b.best_time WHERE g.completed = 1 ORDER BY g.time;")
        case "tnt":
            # this query was easy I just changed the cash query a bit and voila!
            db.execute("SELECT u.nickname, g.time, g.money, g.tnt, g.timestamp FROM games AS g JOIN users AS u ON g.user_id = u.id JOIN (SELECT user_id, MIN(tnt) as best_tnt FROM games GROUP BY user_id) AS secondTable ON g.user_id = secondTable.user_id AND g.tnt = secondTable.best_tnt ORDER BY g.tnt;")
        case "wins":
            # this query was easy I just changed the cash query a bit and voila!
            db.execute("SELECT nickname, wins FROM users WHERE wins > 0 ORDER BY wins DESC;")
        
    rows = db.fetchall()
    print(rows)

    return rows



@app.route("/tutorial")
def tutorial():
    return render_template("tutorial.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html")
    else:
        data = request.get_json()
        if not data.get("nick"):
            return render_template("chyba.html", message="Nezadal si nick.")
        
        if not data.get("password"):
            return render_template("chyba.html", message="Nezadal si heslo!")
        
        # get pass from db
        connection, db = activate_db()
        try:
            db.execute("SELECT id,password FROM users WHERE nickname = %s;", (data.get("nick"),))
            userData = db.fetchone()
        except Exception:
            connection.close()
            return render_template("chyba.html", message="Neočakávaná chyba... chyba je na mojej strane ale... napíš mi asi?")

        if userData is None:
            connection.close()
            return {"status" : "no account"}, 401
        
        # compare
        if check_password_hash(userData[1], data.get("password")):
            # session
            session["name"] = data.get(("nick"))
            session["user_id"] = userData[0]
        else:
            connection.close()
            return {"status" : "wrong password"}, 401
        connection.close()
        return {"status" : "ok"}

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template("register.html")
    else:
        data = request.get_json()
        nick = data.get("nick")
        password = data.get("password")

        if not nick:
            return render_template("chyba.html", message="Nezadal si nick.")
        
        if not password:
            return render_template("chyba.html", message="Nezadal si heslo!")

        hash = generate_password_hash(password)
        # check if user with this name exists
        # write to db
        print("Gonna register a new user! " + nick)
        connection, db = activate_db()
        try:
            db.execute("INSERT INTO users (nickname, password) VALUES (%s,%s);", (nick, hash))
        except Exception:
            connection.close()
            return {"status" : "duplicite"}
        
        connection.commit()
        connection.close()
        return {"status" : "ok"}

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@app.route("/shop")
def shop():
    if not session.get("name"):
        return redirect("/login")
    
    connection, db = activate_db()
    db.execute("SELECT * FROM skins")
    skins = db.fetchall()

    db.execute("SELECT skin_id FROM skin_transactions WHERE user_id = %s", (session["user_id"],))
    bought = db.fetchall()

    user_skins = []
    for i in bought:
        user_skins.append(i[0])

    index = 0    
    for i in skins:
        if i[0] in user_skins:
            print("found a skin this player has")
            tmp = list(skins[index]) 
            tmp.append(1)
            skins[index] = tuple(tmp)
        index += 1

    return render_template("shop.html", skins=skins)

@app.route("/buySkin", methods=["POST"])
def buySkin():
    skin_id_json = request.get_json()
    skin_id = skin_id_json.get("id")
    if not skin_id:
        return {"message" : "error"}

    connection, db = activate_db()
    # check if the user already has the skin
    db.execute("SELECT skin_id FROM skin_transactions WHERE user_id = %s AND skin_id = %s;", (session["user_id"], skin_id))

    hasSkin = db.fetchone()

    if hasSkin:
        return {"message" : "has"}
    
    # let's get user data to check if use has enough funds to even buy the skin
    db.execute("SELECT coins FROM users WHERE id = %s;", (session["user_id"],))
    coins = db.fetchone()[0]

    # let's get the price
    db.execute("SELECT price FROM skins WHERE id = %s;", (skin_id,))
    price = db.fetchone()[0]

    if coins < price:
        return {"message" : "brokie"}
    newCoins = coins - price

    # let's buy the skin and update user coins
    db.execute("UPDATE users SET coins = %s WHERE id = %s;", (newCoins, session["user_id"]))
    db.execute("INSERT INTO skin_transactions (user_id, skin_id) VALUES (%s,%s)", (session["user_id"], skin_id))

    connection.commit()    
    return {"message" : "ok"}

if __name__ == "__main__":
    port = int(os.getenv("PORT"))
    debugMode = os.getenv("debug")
    print(f"Server running on port {port}")
    app.run(host="0.0.0.0",debug=debugMode,port=port)


def checkPlayerHasSkin(skinId,playerId):
    connection, db = activate_db()