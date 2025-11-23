import os
import mysql.connector
from flask import Flask, render_template, request, redirect, session
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.secret_key = "e4a9c3d7f12b48c6a97d53e2c49fb01d6a8e3f4c29bd7150f93a2ce8d674b2af"
# connection = mysql.connector.connect()

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
    
    return render_template("game.html")

@app.route("/tutorial")
def tutorial():
    return render_template("tutorial.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html")
    else:
        data = request.get_json()
        print(data)
        if not data.get("nick"):
            return render_template("chyba.html", message="Nezadal si nick.")
        
        if not data.get("password"):
            return render_template("chyba.html", message="Nezadal si heslo!")
        
        # get pass from db
        # compare
        # session
        session["name"] = data.get(("nick"))
        return {"status" : "ok"}

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template("register.html")
    else:
        nick = request.form.get("nick")
        password = request.form.get("password")

        if not nick:
            return render_template("chyba.html", message="Nezadal si nick.")
        
        if not password:
            return render_template("chyba.html", message="Nezadal si heslo!")

        # check if user with this name exists
        # write to db
        return redirect("/login")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


if __name__ == "__main__":
    port = int(os.getenv("PORT"))
    debugMode = os.getenv("debug")
    print(f"Server running on port {port}")
    app.run(host="0.0.0.0",debug=debugMode,port=port)