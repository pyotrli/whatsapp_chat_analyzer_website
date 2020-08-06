from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
import parse_android
import json
import os

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route('/', methods=["GET", "POST"])
def index():
    if request.method == "GET":
        return render_template("index.html")
    else:
        file = request.files["chat_file"]
        if file:
            filename = secure_filename(file.filename)
            file = file.read()
            stats = parse_android.parse_android(file)
            if stats == None:
                return render_template("apology.html")
            else:
                return render_template("results.html", stats=stats)

@app.route('/demo-results')
def demo_results():
    filename = os.path.join('demo_chat_json.txt')
    with open(filename) as f:
        stats = f.read()
    stats = json.loads(stats)
    return render_template("results.html", stats=stats)

@app.route('/android_instructions')
def android_instructions():
    return render_template("android_instructions.html")

@app.route('/limitations')
def limitations():
    return render_template("limitations.html")
