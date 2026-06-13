from flask import Flask, render_template, request, redirect, url_for
import sqlite3
from datetime import datetime
import uuid

app = Flask(__name__)

def now():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS campaigns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            template TEXT,
            token TEXT UNIQUE,
            submitted_email TEXT,
            submitted_name TEXT,
            clicked INTEGER DEFAULT 0,
            submitted INTEGER DEFAULT 0,
            created_at TEXT,
            clicked_at TEXT,
            submitted_at TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT,
            action TEXT,
            timestamp TEXT
        )
    """)

    conn.commit()
    conn.close()

def create_campaign(template):
    token = str(uuid.uuid4())

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO campaigns (template, token, created_at)
        VALUES (?, ?, ?)
    """, (template, token, now()))

    conn.commit()
    conn.close()
    return token

def get_campaign(token):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, template, token, submitted_email, submitted_name
        FROM campaigns
        WHERE token = ?
    """, (token,))

    campaign = cursor.fetchone()
    conn.close()
    return campaign

def mark_clicked(token):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE campaigns
        SET clicked = 1,
            clicked_at = COALESCE(clicked_at, ?)
        WHERE token = ?
    """, (now(), token))

    conn.commit()
    conn.close()

def mark_submitted(token, submitted_email, submitted_name):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE campaigns
        SET submitted = 1,
            submitted_email = ?,
            submitted_name = ?,
            submitted_at = COALESCE(submitted_at, ?)
        WHERE token = ?
    """, (submitted_email, submitted_name, now(), token))

    conn.commit()
    conn.close()

def save_interaction(token, action):
    allowed_actions = [
        "page_loaded",
        "focused_email_field",
        "focused_name_field",
        "started_typing_email",
        "started_typing_name",
        "clicked_submit_button"
    ]

    if action not in allowed_actions:
        return

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO interactions (token, action, timestamp)
        VALUES (?, ?, ?)
    """, (token, action, now()))

    conn.commit()
    conn.close()

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        template = request.form.get("template")
        token = create_campaign(template)
        return redirect(url_for("generated", token=token))

    return render_template("index.html")

@app.route("/generated/<token>")
def generated(token):
    campaign = get_campaign(token)

    if campaign is None:
        return "Invalid campaign", 404

    simulation_link = url_for("simulate", token=token, _external=True)

    return render_template(
        "generated.html",
        campaign=campaign,
        simulation_link=simulation_link
    )

@app.route("/simulate/<token>", methods=["GET", "POST"])
def simulate(token):
    campaign = get_campaign(token)

    if campaign is None:
        return "Invalid simulation link", 404

    if request.method == "GET":
        mark_clicked(token)
        return render_template("landing.html", submitted=False, token=token)

    if request.method == "POST":
        submitted_email = request.form.get("submitted_email")
        submitted_name = request.form.get("submitted_name")

        mark_submitted(token, submitted_email, submitted_name)

        return render_template("landing.html", submitted=True, token=token)

@app.route("/track/<token>", methods=["POST"])
def track(token):
    action = request.form.get("action")
    save_interaction(token, action)
    return "", 204

@app.route("/dashboard")
def dashboard():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, submitted_name, submitted_email, template, clicked, submitted, created_at, clicked_at, submitted_at
        FROM campaigns
        ORDER BY id DESC
    """)
    campaigns = cursor.fetchall()

    cursor.execute("""
        SELECT id, token, action, timestamp
        FROM interactions
        ORDER BY id DESC
    """)
    interactions = cursor.fetchall()

    conn.close()

    return render_template("dashboard.html", campaigns=campaigns, interactions=interactions)

if __name__ == "__main__":
    init_db()
    app.run(debug=True)