import openai

# Set your OpenAI API key
openai.api_key = "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"

class Sleep_Analysis:
    def __init__(self):
        self.goals = 0

    def get_sleep_analysis(self, hours, goal=7, max_goal=9):
        # Determine the user's sleep feedback context
        if hours >= goal and hours <= max_goal:
            prompt = f"I've been sleeping {hours} hours per night and met my goal of {goal}-{max_goal} hours. Give me positive reinforcement and tips to maintain healthy sleep habits."
        elif hours < goal:
            prompt = f"I've been sleeping only {hours} hours per night, which is below my goal of {goal}-{max_goal} hours. What are the risks of insufficient sleep and tips to improve?"
        else:
            prompt = f"I've been sleeping {hours} hours per night, which is above the recommended range of {goal}-{max_goal} hours. Explain the risks of oversleeping and tips to have a consistent wake time."

        # Call OpenAI's API with the updated syntax
        response = openai.ChatCompletion.create(
            model="gpt-4",  # Specify the model
            messages=[
                {"role": "system", "content": "You are a sleep expert."},
                {"role": "user", "content": prompt}
            ]
        )

        # Extract and return the response text
        return response['choices'][0]['message']['content']
