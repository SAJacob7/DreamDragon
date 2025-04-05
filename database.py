import pymongo
import datetime




class Database:
   def __init__(self):
       self.client = pymongo.MongoClient("mongodb+srv://annalin260:50285531@dream.axtmumq.mongodb.net/?retryWrites=true&w=majority&appName=Dream")
       self.db = self.client["dream"]
       self.users = self.db["users"]
       self.sleep_metric = self.db["sleep_metric"]
       self.userID = None




       # Clean setup for dev/testing
       # Comment this out in production!
       self.users.drop_indexes()
       self.users.create_index("UserID", unique=True)

       
   def get_user_data(self, username):
         user = self.users.find_one({"UserID": username})
         if user:
            return {
                "First Name": user.get("First Name"),
                "Last Name": user.get("Last Name"),
                "Username": user.get("UserID"),
                "Points": user.get("Sleep Points"),
                "Dragon Level": user.get("Dragon Level"),
                "Game Points": user.get("Game Points")
            }
         return None



   def create_account(self, first_name, last_name, username, password, goal):
       try:
           self.users.insert_one({"First Name": first_name,
                                   "Last Name": last_name,
                                   "UserID": username,
                                   "Password": password,
                                   "Sleep Goal": float(goal),
                                   "Consecutive Days": 0,
                                   "Last Day Logged": 0,
                                   "Game Credit": 0,
                                   "Sleep Points": 0,
                                   "Dragon Level": 0
                                   })
           return True


       except pymongo.errors.DuplicateKeyError:
           return False


       except Exception as e:
           return False


   def login_auth(self, username, password):
       cursor = self.users.find({"UserID": username, "Password": password})
       documents = list(cursor)
       if len(documents) == 0:
           return False

       else:
           self.userID = username
           return True


  #  def log_sleep(self, userID, date, hours, notes):
  #   if hours > 0:
  #       self.sleep_metric.update_one(
  #           {"UserID": userID, "Date": date},  # <-- filter
  #           {"$set": {
  #               "Hours": hours,
  #               "Quality": notes
  #           }},
  #           upsert=True
  #       )
  #       self.check_goal(hours, userID, date)
  #       self.dragon_level_up(userID)



   def check_goal(self, hours, userID):
       user_goal = self.users.find_one({"UserID": userID}, {"Sleep Goal": 1, "_id": 0})
       goal = user_goal.get("Sleep Goal", 0)
      #  points = 0


       if hours >= float(goal):
           self.users.update_one({"UserID": userID}, {"$inc": {"Sleep Points": 1, "Game Credit": 1}})
      #      consecutive_data = self.users.find_one({"UserID": userID}, {"Consectutive Days": 1, "_id": 0})
      #      consecutive_days = consecutive_data.get("Consecutive Days", 1)
      #      last_day_data = self.users.find_one({"UserID": userID}, {"Last Day Logged": 1, "_id": 0})
      #      last_day_logged = consecutive_data.get("Last Day Logged")


      #      if last_day_logged:
      #          last_date = datetime.datetime.strptime(last_day_logged, "%Y-%m-%d").date()
      #          today_date = today if isinstance(today, datetime.date) else datetime.datetime.strptime(today, "%Y-%m-%d").date()
  
      #          if (today_date - last_date) == datetime.timedelta(days = 1):
      #              consecutive_days += 1
      #          else:
      #              consecutive_days = 1 # Not consecutive reset
      #  else:
      #      consecutive_days = 1 # If there is no last date, it means this is the first log
      
      #  if consecutive_days > 3:
      #      points = 1
      #      consecutive_days = 1 # Reset consecutive days after points are given
           
      #      self.users.update_one({"UserID": userID}, {"$inc": {"Sleep Points": points, "Game Credit": points}}, {"$set": {"Consecutive Days": consecutive_days, "Last Day Logged": today.strftime("%Y-%m-%d") if isinstance(today, datetime.date) else today}})

   def play_game(self, userID):
       user = self.users.find_one({"UserID": userID}, {"Game Credit": 1, "_id": 0})
       if user and user.get("Game Credit", 0) > 0:
           self.users.update_one({"UserID": userID}, {"$inc": {"Game Credit": -1}})
           return True
       else:
           return False
      
   def dragon_level_up (self, userID):
       user = self.users.find_one({"UserID": userID}, {"Sleep Points": 1, "_id": 0})
       if user and user.get("Sleep Points", 0) == 3:
           self.users.update_one({"UserID": userID}, {"$inc": {"Dragon Level": 1}})
           return True
       elif user and user.get("Sleep Points", 0) == 10:
           self.users.update_one({"UserID": userID}, {"$inc": {"Dragon Level": 1}})
           return True
       elif user and user.get("Sleep Points", 0) == 20:
           self.users.update_one({"UserID": userID}, {"$inc": {"Dragon Level": 1}})
           return True
       elif user and user.get("Sleep Points", 0) == 30:
           self.users.update_one({"UserID": userID}, {"$inc": {"Dragon Level": 1}})
           return True
       elif user and user.get("Sleep Points", 0) == 40:
           self.users.update_one({"UserID": userID}, {"$inc": {"Dragon Level": 1}})
           return True
       else:
           return False
      
   def get_dragon_level (self, userID):
       user = self.users.find_one({"UserID": userID}, {"Dragon Level": 1, "_id": 0})
       if user:
           return user.get("Dragon Level", 0)
       else:
           return False