import os
import uuid
from werkzeug.security import check_password_hash, generate_password_hash
import mysql.connector
from flask import Flask, render_template, request, redirect, session
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.secret_key = "e4a9c3d7f12b48c6a97d53e2c49fb01d6a8e3f4c29bd7150f93a2ce8d674b2af"

connection = mysql.connector.connect(
    host=os.getenv("MYSQLHOST"),
    user="root",
    password=os.getenv("MYSQLPASSWORD"),
    database="jakubland",
    port=os.getenv("MYSQLPORT")
)
db = connection.cursor()

@app.route("/start-run")
def startRun():
    worldId = str(uuid.uuid4())
    db.execute("INSERT INTO games (user_id, world_id, completed) VALUES (%s, %s, 0);", (session["user_id"], worldId))
    connection.commit()

    return {"uuid": worldId}

@app.route("/end-run", methods=["POST"])
def endRun():
    data = request.get_json()

    worldId = data.get("uuid")
    tnt = data.get("tnt")
    money = data.get("money")
    time = data.get("time")

    # Checks if the game has already been completed
    db.execute("SELECT completed FROM games WHERE world_id = %s;",(worldId,))
    rows = db.fetchone()
    if rows[0] == 1 or not rows:
        return {"status": "cheater"}
    
    db.execute("UPDATE games SET tnt = %s, money = %s, time = %s, completed = 1 WHERE world_id = %s", (tnt, money, time, worldId))
    connection.commit()

    # increment user's total wins
    db.execute("SELECT wins FROM users WHERE id = %s;", (session["user_id"],))
    rows = db.fetchone()
    
    n = rows[0] + 1

    db.execute("UPDATE user SET wins = %s WHERE id = %s;", (n, session["user_id"]))

    return {"status" : "ok"}

@app.route("/")
def index():
    if not session.get("name"):
        return render_template("index.html")
    
    return render_template("index.html", name=session["name"])

@app.route("/game")
def game():
    if not session.get("name"):
        return redirect("/login")
    
    return render_template("game.html")

@app.route("/profile")
def profile():
    if not session.get("name"):
        return redirect("/login")
    
    return render_template("profile.html")

@app.route("/leaderboards")
def leaderboards():
    return render_template("leaderboards.html")

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
        try:
            db.execute("SELECT id,password FROM users WHERE nickname = %s;", (data.get("nick"),))
            userData = db.fetchone()
        except Exception:
            return render_template("chyba.html", message="Neočakávaná chyba... chyba je na mojej strane ale... napíš mi asi?")

        if userData is None:
            return {"status" : "no account"}, 401
        
        # compare
        if check_password_hash(userData[1], data.get("password")):
            # session
            session["name"] = data.get(("nick"))
            session["user_id"] = userData[0]
        else:
            return {"status" : "wrong password"}, 401

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
        try:
            db.execute("INSERT INTO users (nickname, password) VALUES (%s,%s);", (nick, hash))
        except Exception:
            return {"status" : "duplicite"}
        
        connection.commit()
        return {"status" : "ok"}

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


if __name__ == "__main__":
    port = int(os.getenv("PORT"))
    debugMode = os.getenv("debug")
    print(f"Server running on port {port}")
    app.run(host="0.0.0.0",debug=debugMode,port=port)