const { MongoClient } = require('mongodb');
const moment = require('moment');

class Database {
    constructor() {
        const uri = "mongodb+srv://annalin260:50285531@dream.axtmumq.mongodb.net/dream?retryWrites=true&w=majority";
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        this.client.connect().then(() => {
            this.db = this.client.db("dream");
            this.users = this.db.collection("users");
            this.sleep_metric = this.db.collection("sleep_metric");
            this.userID = null;

            this.users.createIndex({ "UserID": 1 }, { unique: true });
        }).catch(err => console.error("Connection error:", err));
    }

    async create_account(firstName, lastName, username, password, goal) {
        try {
            await this.users.insertOne({
                "First Name": firstName,
                "Last Name": lastName,
                "UserID": username,
                "Password": password,
                "Sleep Goal": goal,
                "Points": 0,
                "Dragon Level": 0
            });
            return true;
        } catch (err) {
            if (err.code === 11000) {
                // Duplicate key error
                return false;
            }
            throw err;
        }
    }

    async login_auth(username, password) {
        const user = await this.users.findOne({ "UserID": username, "Password": password });
        if (!user) {
            return false;
        } else {
            this.userID = username;
            return true;
        }
    }

    async log_sleep(hours, notes) {
        if (hours > 0 && this.userID) {
            const today = moment().format("YYYY-MM-DD");
            await this.sleep_metric.insertOne({
                "UserID": this.userID,
                "Date": today,
                "Hours": hours,
                "Quality": notes
            });
            await this.check_goal(hours);
        }
    }

    async check_goal(hours) {
        const user = await this.users.findOne({ "UserID": this.userID }, { projection: { "Sleep Goal": 1 } });
        const goal = user?.["Sleep Goal"] || 0;
        if (hours >= goal) {
            await this.users.updateOne(
                { "UserID": this.userID },
                { $inc: { "Points": 1 } }
            );
        }
    }
}

module.exports = Database;