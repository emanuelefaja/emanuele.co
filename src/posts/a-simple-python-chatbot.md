---
title: "A Simple Python ChatBot."
date: 2023-03-21T20:37:24Z
categories: [artificial-intelligence, short]
---

I’ve been working with chatbots a lot lately, and especially the OpenAI ChatGPT and related APIs.

I wanted a quick and easy way to chat with a bot that had a specific “system” prompt that allowed is to take on a specific character or approach, so I made a simple Python script that does just that and allows me to chat within a terminal:

![](/media/2023/03/Screenshot-2023-03-21-at-9.35.23-PM.png)

I find that when the system prompt for ChatGPT is set, the responses are far more interested and on-topic than when you just use normal prompting techniques.

Here’s the code:

```
import openai

# Set your OpenAI API key
openai.api_key = "YOUR OPENAI API KEY"

def main():
    msgs = []

    # Get the chatbot type and name from the user
    system_msg = input("What kind of chatbot do you want?\n")
    msgs.append({"role": "system", "content": system_msg})

    chatbot_name = input("What would you like to name your chatbot?\n")

    print(f"Say hello to {chatbot_name}! Type 'quit()' when done.")

    # Main loop
    while True:
        msg = input("\033[94mYOU: \033[0m")  # Blue text
        msg = msg.strip()  # Remove extra whitespaces

        if msg.lower() == "quit()":
            break

        msgs.append({"role": "user", "content": msg})
        response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=msgs)
        reply = response["choices"][0]["message"]["content"]
        msgs.append({"role": "assistant", "content": reply})
        print(f"\033[92m\n{chatbot_name}: {reply}\033[0m\n")  # Green text

if __name__ == "__main__":
    main()
```
