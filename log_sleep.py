from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
from database import Database
from datetime import datetime
import pymongo
import bcrypt
import uuid
import os
import google.generativeai as genai

app = Flask(__name__)
CORS(app)
app.secret_key = os.urandom(24)  # This generates a random 24-byte string
# MongoDB setup
client = pymongo.MongoClient("mongodb+srv://annalin260:50285531@dream.axtmumq.mongodb.net/dream?retryWrites=true&w=majority")
db = client["dream"]
sleep_data = db["sleep_metric"]

# Hardcoded user
# HARDCODED_USER = "demo_user"
@app.route('/')
def home():
    if 'username' in session:
        return render_template('home.html', logged_in = True)
    return render_template('home.html', logged_in = False)


@app.route('/calendar')
def calendar():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('calendar_front.html')

@app.route('/api/sleep', methods=['POST'])
def log_sleep():
    try:
        if 'username' not in session:
           return jsonify({"status":"error", "message": "Unauthorized"}), 401
        data = request.json
        username = session['username']
        sleep_data.update_one(
            {"username": session['username'], "date": data['date']},
            {"$set": {
                "hours": float(data['hours']),
                "logged_at": datetime.now()
            }},
            upsert=True
        )
        database = Database()
        database.check_goal(float(data['hours']), session['username'])
        database.dragon_level_up(session['username'])
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/sleep/<year>/<month>')
def get_monthly_sleep(year, month):
    try:
        if 'username' not in session:
           return jsonify({"status":"error", "message": "Unauthorized"}), 401
        start_date = f"{year}-{month}-01"
        end_month = int(month) + 1
        end_year = int(year)
        if end_month > 12:
            end_month = 1
            end_year += 1
        end_date = f"{end_year}-{end_month:02d}-01"
        
        data = sleep_data.find({
            "username": session['username'],
            "date": {"$gte": start_date, "$lt": end_date}
        })
        
        return jsonify({
            "status": "success", 
            "data": {entry["date"]: entry["hours"] for entry in data}
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# @app.route('/login')
# def login():
#     return render_template('login.html')
@app.route('/register')
def register():
   return render_template('register.html')

@app.route('/game')
def game():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('index.html')

@app.route('/api/register', methods=['POST'])
def register_user():
   try:
       data = request.json
       print(data)
       first_name = data['first_name']
       last_name = data['last_name']
       username = data['username']
       password = data['password']
       goal = data['goal']
       sleep_tracker = Database()
       sleep_tracker.create_account(first_name, last_name, username, password, goal)

       session['username'] = username
       global_username = session['username']


       return jsonify({"status": "success"}), 200
   except Exception as e:
       return jsonify({"status": "error", "message": str(e)}), 500
   
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        sleep_tracker = Database()
        if sleep_tracker.login_auth(username, password):
            session['username'] = username
            return redirect(url_for('home'))
        else:
            return render_template('login.html', error="Invalid credentials")
    return render_template('login.html')
@app.route('/api/check_points')
def checkPointsBeforeGame():
   database = Database()
   result = database.play_game(session['username'])
   return jsonify({"canStart": result})


@app.route('/api/dragon_level')
def checkDragonLevel():
   database = Database()
   result = database.get_dragon_level(session['username'])
   return jsonify({"level": result})


@app.route('/profile')
def profile():
     if 'username' not in session:
         return redirect(url_for('login'))
 
     username = session['username']
     sleep_tracker = Database()
     user_data = sleep_tracker.get_user_data(username)
 
     if not user_data:
         return redirect(url_for('home'))
     return render_template('profile.html', user_data=user_data)
 
 
@app.route('/api/feedback', methods=['POST'])
def sleep_analytics():
    try:
        # Get input data from the frontend
        data = request.json
        hours = data['hours']

        # Configure Gemini API
        genai.configure(api_key="AIzaSyDDjnp_7zdCM6v4cO3Rr7yHF36T_JHWO-A")
        generative_config = {
            "temperature": 0.9,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 300,
            "response_mime_type": "text/plain",
        }
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ]

        # Initialize model and conversation
        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            safety_settings=safety_settings,
            generation_config=generative_config,
        )
        convo = model.start_chat(history=[])

        # Generate feedback
        convo.send_message(f"Act like a sleep advisor for better health. My client slept for {hours} hours. Please give suggestions on how to improve their sleeping habits. Make the response consise, and less than 200 words.")
        feedback = convo.last.text

        # Return feedback as JSON
        return jsonify({"status": "success", "feedback": feedback})

    except Exception as e:
        # Handle errors gracefully
        return jsonify({"status": "error", "message": str(e)})

    
@app.route('/logout', methods=['GET', 'POST'])
def logout():
     session.clear()
     return redirect(url_for('home'))




if __name__ == '__main__':
    app.run(debug=True)