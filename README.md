# Dream Dragon - HackKU 2025 Project
## Dream Dragon Introduction

This project is created for HackKU 2025, made by Kusuma Murthy, Sophia Jacob, and Anna Lin.

Although often overlooked, sleep is integral in maintaing one's health and well-being. According to the _National Heart, Blood, and Lung Institute_, the lack of proper sleep can be one of the leading causes to chronic illnesses, mental stress, and anxiety. In fact, according to _Johns Hopkins_, dementia, heart disease, type 2 diabetes, obesity and even cancers of the breast, colon, ovaries and prostate can all be aggrevated when an individual has extremely poor sleep schedules.

While reseaching and understanding about how to create consistent sleep habits, doctors often recommended keeping a "sleep diary" to help you keep an average of your sleep and determine your sleep patterns. We found that, although this solution is quite effective in enforcing us to study our sleep, it is very tedious, monotonous, and disengaging to manually have to keep this count. Other wearable devices that can count sleep can be quite expensive, and not available to everyone. Both of these solutions can easily deter beginners who are just starting to learn about their sleep habits.

Therefore... Introducing **Dream Dragon 🐉**!! Dream Dragon is the perfect solution to create a healthier life style with sleep (one dragon at a time 😉). With Dream Dragon, users can:
- Create a profile and enter in their sleep metrics into their calendar. It is a **fully automated** process, and is much easier to maintain!
- After inputting their sleep hours for a day, users will receive personalized information about their sleep metrics and helpful tips on how to improve their overall lifestyle, powered by **Gemini API**.
- There is also a **ChatBot** dragon helper named _Blaze_, who will help the user with any specific inquires they may have.

We also wanted to create this app to make it as engaging for the users to build up their habits. This is why we made a gamified element to our app:
- Users begin with a little egg. If they've met their sleep goal 3 times, then the little egg hatches and becomes a **dragon avatar**.
- From there, the dragon can level up into **new colors** with additional points from meeting their sleep goals.
- Based on the sleep points they have acquired, the user can then play a **game** where they have to hop on dream clouds and jump over stars! They can only play the game for as many points they have.

This helps motivate the user to try to engage more with their sleep and encourage a healthier lifestyle.


## User Manual
Installing the Dream Dragon app is very simple. Start by cloning this GitHub repo as seen below.
```
  git clone https://github.com/SAJacob7/DreamDragon.git
```

Once it is installed, we can run the following command to make sure that all packages are installed for Dream Dragon. Make sure to run this command in the repo that you have.
```
python3 -m pip install -r requirements.txt
```
Once installed, Dream Dragon will be ready for you to use! Please run the log_sleep.py file. From there, the Dream Dragon webpage will load on your screen and you can start creating accounts and interacting with your dragons.

## Technologies Used
We built our app using Python Flask framework for the front end, Amazon Web Services Rekognition for the image recognition software, and MongoDB atlas for the backend database applications. We constructed the Pyhton Flask app using libraries such as Pandas, PyMongo, etc. For AWS Rekognition we used other AWS tools such as S#, IAM, Lambda, etc. We integrated the front as the main source of interaction between the users, and the AWS Rekognition API as well as CV2 (for the camera) was embedded into the frontend to make it seem like a seamless tool. The MongoDB was implemented in the backend and it communicated with both the AWS Rekognition API as well as the Kivy front-end app.
To learn more about MongoDB, please click on this link:
https://www.mongodb.com/languages/python/pymongo-tutorial
To learn more about AWS Rekognition, please click on this link:
https://docs.aws.amazon.com/rekognition/latest/dg/labels-detect-labels-image.html
This project has components powered by AWS Rekognition API and backend work of MongoDB.

## Future Implementation
For the future we hope to imrpove our website by adding more games to help provide users more variety. Additionally in order to help useres stay motivated and help them improve tehir sleep schedules alonside their peers, we hope to  implemet a leadership board and also allow useres to form groups with their freinds and familys to help keep track of who has achived the most sleep. By doing so we hope to motivate useres to improve their sleeping cycles as it is the most itergral aprt of one's health!

### Sources:
https://www.hopkinsmedicine.org/health/wellness-and-prevention/health-risks-of-poor-sleep
https://www.nhlbi.nih.gov/health/sleep-deprivation
