---
title: "A Philosophical Python (Chatbot)"
date: 2023-03-24T21:27:58Z
categories: [artificial-intelligence, philosophy, short]
---

Ever wondered what it would be like to discuss life’s biggest questions with some of history’s greatest philosophers?

I made a small chatbot to explore different viewpoints and opinions on various subjects by selecting the philosopher you wish to engage with. Let’s dive into how this chatbot works and how it can enrich your understanding of philosophical concepts.

How the Script Works:

The Python script we’ve developed uses the OpenAI API to create a chatbot that emulates the selected philosopher. The script starts by presenting a list of famous philosophers for the user to choose from. Once the user makes their choice, the chatbot adopts the persona of the chosen philosopher, and the conversation begins.

The chatbot’s responses are powered by GPT-3.5 Turbo, one of OpenAI’s most advanced language models. The user’s input is processed, and the model generates a response that reflects the style and perspective of the selected philosopher. The conversation continues until the user types “quit()”, ending the interaction.

Benefits of Speaking to Different Philosophers:

1.  Diverse perspectives: By conversing with various philosophers, you can gain insights into different schools of thought and perspectives on topics such as morality, existence, and knowledge.
2.  Enhanced understanding: Engaging with a chatbot that emulates the language and ideas of a particular philosopher can deepen your understanding of their work and thought process.
3.  Critical thinking: Comparing and contrasting the viewpoints of different philosophers can sharpen your critical thinking skills and help you develop your own ideas and opinions.
4.  Engaging experience: The chatbot provides an interactive and enjoyable way to explore philosophy, making it accessible and interesting even for those who are new to the subject.
5.  Personal growth: Delving into the thoughts of history’s greatest thinkers can inspire personal growth, as you consider new ideas and challenge your own beliefs.

This is the first time that I have truly explored the “system” prompt and it appears to be really promising, I have some more ideas for this in the future.

If you want to run it yourself, here’s the code:

```
import openai

openai.api_key = "your OpenAI API Key"

def main():
    msgs = []

    print("Choose a philosopher:")
    philosophers = ["Aristotle", "Plato", "Immanuel Kant", "Friedrich Nietzsche", "René Descartes", "Socrates",
                    "Ludwig Wittgenstein", "John Locke", "Jean-Jacques Rousseau", "David Hume", "Thomas Aquinas",
                    "Martin Heidegger", "Baruch Spinoza", "Georg Wilhelm Friedrich Hegel", "Gottfried Wilhelm Leibniz",
                    "Karl Marx", "John Stuart Mill", "Arthur Schopenhauer", "Thomas Hobbes", "Blaise Pascal",
                    "Confucius", "Lao Tzu", "Friedrich Hayek", "Edmund Husserl", "Jacques Derrida",
                    "Simone de Beauvoir", "Emmanuel Levinas", "Michel Foucault", "Ayn Rand", "Bertrand Russell",
                    "W.V. Quine", "Noam Chomsky", "Karl Popper", "Martin Buber", "Hannah Arendt",
                    "Maurice Merleau-Ponty", "Gilles Deleuze", "Henri Bergson", "William James",
                    "Charles Sanders Peirce", "Friedrich Schiller", "Søren Kierkegaard", "George Berkeley",
                    "G.W.F. Hegel", "Hans-Georg Gadamer", "Jean-Paul Sartre", "Alasdair MacIntyre", "John Rawls",
                    "Martha Nussbaum", "Richard Rorty"]

    for idx, philosopher in enumerate(philosophers):
        print(f"{idx + 1}. {philosopher}")

    chosen_idx = int(input("Enter the number of the philosopher: ")) - 1
    chatbot_name = philosophers[chosen_idx]
    print(f"Say hello to {chatbot_name}! Type 'quit()' when done.")
    msgs.append({"role": "system", "content": f"Chatbot as {chatbot_name} and in the style of {chatbot_name}"})

    while True:
        msg = input("YOU: ")
        msg = msg.strip()

        if msg.lower() == "quit()":
            break

        msgs.append({"role": "user", "content": msg})
        response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=msgs)
        reply = response["choices"][0]["message"]["content"]
        msgs.append({"role": "assistant", "content": reply})
        print(f"\n{chatbot_name}: {reply}\n")

if __name__ == "__main__":
    main()
```
