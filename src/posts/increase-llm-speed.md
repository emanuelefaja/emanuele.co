---
title: "Increasing LLM Speed."
date: 2023-06-14T18:35:13Z
categories: [artificial-intelligence, short]
---

One common thread across my various recent explorations of using AI, specifically LLMs (Large Language Models) to do complex processing of documents, was to break up large documents into chunks and processing each separately.

One thing that got quite annoying was that this could be quite slow. Sometimes one chunk could take 10s to 20s to process, and there may be 20 to 40 chunks. I ended up implementing a “test” flag that I could turn on and off that would reduce the number of chunks to process regardless of the document length, just so I could see results quickly.

I started to then ask myself if there was a way to run things in parallel instead of one by one, and it turns out there is!

Parallelisation is a common approach to speed up operations that are independent from each other, such as making multiple API calls. We can use Python’s built-in concurrent.futures module to send multiple requests at once.

But first, let’s create a task and get some benchmarks.

I decided that I was going to ask 30 simple questions:

```
user_messages = [
    "Who were the founders of Microsoft?",
    "What is the capital of Australia?",
    "Who won the world cup in 2018?",
    "Who is the current president of the United States?",
    "When was the Declaration of Independence signed?",
    "What is the largest planet in our solar system?",
    "Who wrote the novel 'To Kill a Mockingbird'?",
    "What is the periodic symbol for gold?",
    "Which company is associated with the 'Android' operating system?",
    "What does HTTP stand for in website addresses?",
    "Who discovered penicillin?",
    "What's the highest mountain in the world?",
    "Who painted the Mona Lisa?",
    "Who composed the Four Seasons?",
    "What is the speed of light?",
    "Who was the first person to walk on the moon?",
    "Who is the author of 'Pride and Prejudice'?",
    "What is the capital of Brazil?",
    "What's the population of China?",
    "Which year was the Euro introduced as legal currency on the world market?",
    "What is the scientific name for a tree?",
    "How many elements are there in the Periodic Table?",
    "Who is the richest person in the world?",
    "What is the longest river in the world?",
    "What are the primary colors?",
    "What is the capital of Italy?",
    "Who is the current CEO of Tesla?",
    "What is the primary purpose of NATO?",
    "Who wrote the 'Art of War'?",
    "Who discovered gravity?"
]
```

I didn’t really care about the answer to the questions, I just wanted to know how long it would take to go through each question and get a response from the OpenAI APIs.

So I wrote a small program that loops through all these questions and records the overall time taken:

```
import openai
from tqdm import tqdm
import time
import concurrent.futures

openai.api_type = "azure"
openai.api_key = 'API KEy'
openai.api_base = 'API URL'
openai.api_version = "2023-05-15"

# Define a list of messages
user_messages = [
    "Who were the founders of Microsoft?",
    "What is the capital of Australia?",
    "Who won the world cup in 2018?",
    "Who is the current president of the United States?",
    "When was the Declaration of Independence signed?",
    "What is the largest planet in our solar system?",
    "Who wrote the novel 'To Kill a Mockingbird'?",
    "What is the periodic symbol for gold?",
    "Which company is associated with the 'Android' operating system?",
    "What does HTTP stand for in website addresses?",
    "Who discovered penicillin?",
    "What's the highest mountain in the world?",
    "Who painted the Mona Lisa?",
    "Who composed the Four Seasons?",
    "What is the speed of light?",
    "Who was the first person to walk on the moon?",
    "Who is the author of 'Pride and Prejudice'?",
    "What is the capital of Brazil?",
    "What's the population of China?",
    "Which year was the Euro introduced as legal currency on the world market?",
    "What is the scientific name for a tree?",
    "How many elements are there in the Periodic Table?",
    "Who is the richest person in the world?",
    "What is the longest river in the world?",
    "What are the primary colors?",
    "What is the capital of Italy?",
    "Who is the current CEO of Tesla?",
    "What is the primary purpose of NATO?",
    "Who wrote the 'Art of War'?",
    "Who discovered gravity?"
]

# Record the start time
start_time = time.time()

def get_response(user_message):
    response = openai.ChatCompletion.create(
        engine="highriskprojects",
        messages=[
            {"role": "system", "content": "Assistant is a large language model trained by OpenAI."},
            {"role": "user", "content": user_message}
        ]
    )
    return response

# Using ThreadPoolExecutor to run the tasks in parallel
with concurrent.futures.ThreadPoolExecutor() as executor:
    results = list(tqdm(executor.map(get_response, user_messages), total=len(user_messages)))

# Record the end time
end_time = time.time()

# Calculate and print the total processing time
total_time = end_time - start_time
print(f"\nTotal processing time: {total_time} seconds")
```

Let’s see how long this takes.

![](/media/2023/06/x8uKHRoN@2x.png)

So this took a very precise **45.74840998649597** seconds**.**

So let’s try to do multiple calls at the same time. It’s a small modification to our code:

```
import concurrent.futures

# Using ThreadPoolExecutor to run the tasks in parallel
with concurrent.futures.ThreadPoolExecutor() as executor:
    results = list(tqdm(executor.map(get_response, user_messages), total=len(user_messages)))
```

Let’s run this and see.

![](/media/2023/06/wonfATLq@2x.png)

So this time it only took **5.767162322998047** seconds**!** This is almost 8 times faster than doing things one by one.

I’ll for sure place this into standard operating procedure anytime that I make OpenAI API calls, because that is some serious speed improvement.
