import os
from flask import Flask, render_template
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    port = int(os.getenv("PORT"))
    debugMode = os.getenv("debug")
    print(f"Server running on port {port}")
    app.run(host="0.0.0.0",debug=debugMode,port=port)