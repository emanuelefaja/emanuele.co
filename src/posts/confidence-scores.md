---
title: "Confidence Scores On High-Risk Project Detection."
date: 2023-06-11T06:43:53Z
categories: [artificial-intelligence, essays, united-nations]
---

I recently wrote up a thought experiment [on detecting high-risk projects at UNDP automatically using LLMs](/automatic-detection-of-undp-high-risk-projects/) (Large Language Models).

Since then, I have managed to turn this methodology into a working application that matches human-level review performance. I used Streamlit and Python to put this simple application where you just drag one or more project documents, and within a few seconds you get an analysis of which risks are present in which document, and you can download the analysis as well for further review.

![](/media/2023/06/2ClsesBg@2x.png)

This goes beyond keyword matching and into the semantic (i.e. the actual meaning) of the words in the documents. This means, for instance, that “cash transfer” can be mentioned multiple times in a project document and **not** be flagged up as a risk, because of the context. Perhaps cash transfer is mentioned in passing with regards to historical interventions, and so it not relevant to the current project being analysed.

However, how can we be sure that the results are correct? If this is going to be deployed at scale across thousands of project document, then we need to have a high degree of confidence in the results. LLMs are known to be prone to “hallucinations”[^1] which means that they can produce what appear to be correct-sounding answers that are factually incorrect.

However, in this specific case there are ways to reduce hallucinations. The first is to ensure that the specifics risks that we are evaluating for are clearly started and written, to avoid confusion on what is and is not considered a risk.

The second is to return back the analysis is a structured manner. You can see the end of my prompt below, where I specifically ask for comma separated values, and then add a reminder immediately after as well. This could be further reinforced in the system prompt as well.

```
Return the risks present as a comma-separated list. For example, if Cash Transfer and Displacement risks are present, your response should be: "Cash Transfer, Displacement"
Remember, your answer should ONLY be a comma-separated list of risks and should not include any other analysis or text.'
```

It is essential to involve humans in the process since this technology is still relatively new. Senior stakeholders will not accept results from an LLM without human verification. However, manually double-checking thousands of prodocs would take the same amount of time as evaluating them all manually.

So, how do we know which prodocs to manually review and which to accept? This is where we arrive to today’s topic: confidence scores.

The most simple approach would be to count how many of the 500-word chunks in the document contain the risk compared to the total number of chunks. We can assume if there is a major risk area, that this would be mentioned several times across the text, and so this can be a good proxy as to whether a risk is actually present or not.

This is quite easy to calculate.

-   `Ri` as the risk category `i`.
-   `Ci` as the count of chunks in which risk `Ri` appears.
-   `N` as the total number of chunks the document was divided into.

The frequency `Fi` of each risk category `Ri` is calculated as:

```
Fi = Ci / N
```

This formula results in a score between 0 and 1 for each risk category `Ri`, which represents the proportion of the document in which that risk is mentioned.

For example, if a document is broken into 10 chunks (`N = 10`), and a risk category such as “Cash Transfer” appears in 3 of those chunks (`Ccash_transfer = 3`), the frequency score for “Cash Transfer” would be calculated as:

```
Fcash_transfer = Ccash_transfer / N
Fcash_transfer = 3 / 10
Fcash_transfer = 0.3
```

This means that the “Cash Transfer” risk was mentioned in 30% of the document.

However, this is overall too simplistic to be fully reliable, but I think it can be part of a weight that goes into an ultimate confidence score.

Another approach would be to get a confidence score for each risk, which is more a qualitative risk analysis instead of a quantitive one.

Fortunately, people have been looking at LLM confidence level already[^2] and there have been some promising results.

We could append instructions to our prompt along these lines:

*Answer each question with a score from 0 to 100. Zero indicates limited confidence, while 100 means absolute confidence. Place the score in brackets at the end of the question, like this: \[86\].*

Let’s try some light experiments to see if there is any correlation. Note that I have lightly edited the prompt and response to remove the tedious *“As an AI Language model…”* and *“As of my knowledge cutoff in September 2021…”*. I added *“In one sentence”* to get shorter responses at the start of each prompt.

```
Prompt: What is the capital of France?
Response: The capital of France is Paris. [100]

Prompt: What is the GDP of France?
Response: The GDP of France was approximately $2.7 trillion. [85]

Prompt: Will humans land on Mars before 2035?
Response: It is difficult to predict with certainty, but based on current plans and advancements in space exploration, there is a reasonable chance that humans could land on Mars before 2035. [75]
```

And so, it may useful to have the LLM return a confidence level for each risk it finds in each chunk, and then average out that confidence level to get to an overall confidence scoring.

To incorporate both quantitative confidence scores and qualitative risk analysis with weights, we use a weighted average approach.

1.  Assign a confidence score (between 0 and 100) to each identified risk based on qualitative analysis (as above)
2.  Calculate the average confidence score for the qualitative risk analysis by summing up the individual scores and dividing by the number of risks.
3.  Determine the weight to assign to the qualitative risk analysis and the quantitative confidence score. These weights represent the relative importance or reliability we want to place on each factor.
4.  Multiply the average confidence score from qualitative analysis by its weight, and multiply the quantitative confidence score by its weight.
5.  Sum up the weighted scores obtained in step 4 to calculate the combined confidence score.

For example, let’s say we assign a weight of 0.6 to the qualitative risk analysis and a weight of 0.4 to the quantitative confidence score. If the average confidence score from qualitative analysis is 80, and the quantitative confidence score is 90, the calculation would be as follows:

Combined confidence score = (0.6 \* 80) + (0.4 \* 90) = 48 + 36 = 84

In this example, the combined confidence score would be 84.

Then we can do an average for all the risks that are present, which would give us a overall confidence score for the risk analysis of that specific project document.

We then need to work out what is the threshold that would trigger a human review. (i.e. say anything below an 80% confidence score)

While this is not perfect — and for sure we could argue about the weights we would give each score — it would provide a framework to still keep humans in the loop while working with LLMs at scale.

### References.

-   1

    [Survey of Hallucination in Natural Language Generation](https://arxiv.org/abs/2202.03629)

-   2

    [Prompting GPT-3 To Be Reliable](https://arxiv.org/pdf/2210.09150.pdf)

[^1]: [Survey of Hallucination in Natural Language Generation](https://arxiv.org/abs/2202.03629)
[^2]: [Prompting GPT-3 To Be Reliable](https://arxiv.org/pdf/2210.09150.pdf)
