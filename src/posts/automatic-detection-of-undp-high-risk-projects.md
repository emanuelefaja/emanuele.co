---
title: "Automatic Detection of UNDP High-Risk Projects (v1)."
date: 2023-05-29T13:49:22Z
categories: [artificial-intelligence, productivity, united-nations]
---

I have started to consider how to automatically detect high-risk projects in the context of [UNDP](https://undp.org). This is important because high-risk projects, due to their nature, required more attentive oversight and management.

Let’s start by setting the scene.

UNDP is one of the world’s largest multilateral development agencies, operating in around 170 countries and striving to eradicate poverty. In November 2011, UNDP became an IATI member and first published to the IATI Registry and currently hosts the IATI Secretariat. UNDP has scored “very good” in transparency in every years since records started, and it is currently ranked 7th across all development organisations.[^1]

It has an open portal that publishes data on more than $6B across 15,000+ projects.[^2]

However, with this scale, there are challenges. Manual oversight of 15,000+ projects becomes essentially impossible.

Let’s run the maths.

Every project has what’s called a ProDoc (**Pro**ject **Doc**ument) that gives a detailed overview of the project, including budgets. This is what UNDP leadership and their government counterparts sign before a project moves ahead. These documents are typically 30+ pages. Let’s consider that it takes one person one hour to review this document and compare it against a detailed set of criteria of what is considered a high risk project.

Let’s consider 30 hours per week and 50 weeks per year — *this is a hard working bureaucrat that does not take many holidays!* — which gives up ~1,500 hours of work per year and so ~1,500 ProDocs reviewed.

So it would take approximately 10 years to review all the current ProDocs. Let’s assume a $75,000 cost for a junior/mid-level consultant for this, and that’s around $750,000 in total costs.

Oh, and in the meantime, likely another 50,000 to 100,000 ProDocs would have been written and published by then. So we would never be able to catch up by this pace. Assuming that 1/3 of all ProDocs are fresh in a given year, which is a decent assumption as typically projects may last 2-3 years, this means that we need to review 5,000 projects per year just to stay current, which would require at least four full time consultants working on this at a cost of $300,000/year.

This does not even consider real-life issues such as sick days, turnover (who wants to spend their entire life reading an endless number of ProDocs!) and the need for some checks and balances which would naturally require some duplication and random reviews.

Clearly, this is an expensive undertaking to do manually. Let’s compare this to an automatic approach using AI. We can assume that each document has 10,000 words, so that gives us a total of 150M words inside all the project documents. So that would be the total amount of data that we feed in, but we also need to get something back, so let’s round that up to 200M words for both prompts and completion

The current costs of OpenAI[^3] are and Claude[^4] are:

<table><tbody><tr><td><strong>Model</strong></td><td><strong>Prompt</strong></td><td><strong>Completion</strong></td></tr><tr><td>GPT4 (32K)</td><td>$0.06&nbsp;/ 1K tokens</td><td>$0.12&nbsp;/ 1K tokens</td></tr><tr><td>GPT4 (8K)</td><td>$0.03&nbsp;/ 1K tokens</td><td>$0.06&nbsp;/ 1K tokens</td></tr><tr><td>GPT3.5</td><td>$0.002&nbsp;/ 1K tokens</td><td>$0.002&nbsp;/ 1K tokens</td></tr><tr><td>Claude Instant</td><td>$0.00163 / 1K Tokens</td><td>$0.00551 / 1K Tokens</td></tr><tr><td>Claude V1</td><td>$0.01102 / 1K Tokens</td><td>$0.03268 / 1K Tokens</td></tr></tbody></table>

It is interesting to note the difference in pricing between the various offerings. GPT4 is the overall better model, but Claude offers an interesting advantage: a 100,000 token context window offering. This is essentially how much “memory” the AI has.

But what is a token precisely? In Large Language Models, a token is a sequence of characters that the model treats as one unit. It can be a word, punctuation, number, or any other sequence the model is trained to recognize. Tokens help break down text into smaller, more manageable pieces for efficient processing. The model assigns each token a numerical representation, which it uses to make predictions and decide how to generate text. Tokens are essential for the architecture of Large Language Models, allowing them to achieve superior performance on many natural language processing tasks.

So 1 word does not equal 1 token, but a rule of thumb can be anywhere between 0.75 words per token to 1 word per token gives us accurate enough results to understand pricing.[^5]

So let’s assume 150M words of prompts from documents and 50M words back as completions, with the 1 token = 1 word approximation, what would our costs look like for this?

<table><tbody><tr><td><strong>Model</strong></td><td><strong>150M Prompt Cost</strong></td><td><strong>50M Completion Cost</strong></td><td><strong>Total Costs</strong></td></tr><tr><td>GPT4 (32K)</td><td>$9,000</td><td>$18,000</td><td><strong><span>$27,000</span></strong></td></tr><tr><td>GPT4 (8K)</td><td>$4,500</td><td>$9,000</td><td><strong><span>$13,500</span></strong></td></tr><tr><td>GPT3.5</td><td>$300</td><td>$300</td><td><strong><span>$600</span></strong></td></tr><tr><td>Claude Instant</td><td>$244.5</td><td>$275.5</td><td><strong><span>$520</span></strong></td></tr><tr><td>Claude V1</td><td>$1,653</td><td>$1,634</td><td><strong><span>$3,287</span></strong></td></tr></tbody></table>

So this goes from $27,000 for using GPT4 with a 32k token context window, all the down to just $520 (essentially a non-cost) for Claude Instant. This compares very well with the $750,000 in staffing costs required to just review the 15,000 ProDocs once.

So this back-of-the-napkin maths is promising, but how would we actually go about doing this?

## The Methodology.

At a high-level, this is actually quite simple, but there are various caveats that I’ll cover in detail.

1.  Collect all the ProDocs.
2.  Break them up into smaller chunks, let’s say 500 words.
3.  Evaluate each chunk against the high-risk project criteria.
4.  Log the results.

The end result should be a spreadsheet or database of every ProDocs, with the following format:

<table><tbody><tr><td>ProDoc</td><td>Country Office</td><td>High Risk Project</td><td>Certainty Score</td></tr><tr><td>00128217</td><td>Cambodia</td><td>Yes</td><td>85%</td></tr></tbody></table>

The ID would be the project ID, and then we would also add a certainty score of whether the project is high-risk or not. However, we can probably make one improvement here and list the criteria out one by one, which may be interesting for later analysis.

<table><tbody><tr><td>ProDoc</td><td>Country Office</td><td>HRC1</td><td>HRC2</td><td>HRC3</td><td>HRC4</td><td>HRC5</td><td>Certainty Score</td></tr><tr><td>00128217</td><td>Cambodia</td><td>Yes</td><td>No</td><td>Yes</td><td>Yes</td><td>No</td><td>77%</td></tr></tbody></table>

*Note: I have shortened High Risk Criteria to HRC for the sake of readability.*

I would imagine that a manual review would be made for any projects that have a low certainty score, as they may be mislabelled.

I have also seen some interesting work[^6] done with self-analysis in LLMs (Large Language Models), where you essentially get the model to double check its own answer to improve overall quality:

```
This is the format for your evaluation of your previous response:

Response Rating (0-100): <rating>,
Self-Feedback: <feedback>,
Improved Response: <response>
```

This is also very useful to reduce cost, because you can have a more expensive model (i.e. GPT4) check on the answers of a cheaper model such as GPT3.5. Let’s remember that the cost difference between the two models in our use case can be as much as 45x ($27000/$600), so this method could be a very good tradeoff between price and quality.

Let’s now tackle each step in the methodology step by step:

### Collecting All ProDocs.

I initially thought that this was going to be rather trivial, as just getting access to the UNDP’s transparency portal would be enough, but there is an issue where many of the ProDocs are not machine readable PDFs, but rather scanned PDFs. I am not sure in what % of cases this is true, it appears to be more of an issue on older ProDocs than newer ones, but it still something to consider.

This is relatively simple to address, I managed to cobble something together that could accurately scan PDFs that contain images using the **pdf2image** python library and then the **pytesseract** library for OCR.

Just a few lines of code!

```
from pdf2image import convert_from_path
import pytesseract
import os
from tqdm import tqdm

# Set the tesseract path in the script
pytesseract.pytesseract.tesseract_cmd = r'/opt/homebrew/Cellar/tesseract/5.3.1/bin/tesseract'

# Prompt for the PDF filename
pdf_filename = input("Enter the name of the PDF file: ")
pdf_path = os.path.join(os.path.dirname(__file__), pdf_filename)

# Load your PDF
pages = convert_from_path(pdf_path, 500)

# OCR each page and write output to a file
output_filename = "output.txt"
with open(output_filename, 'w') as f:
    for i in tqdm(range(len(pages)), desc="Processing pages"):
        text = pytesseract.image_to_string(pages[i])
        f.write(text)
```

Other than that, the only step here would be to collect all the download links for each ProDoc and then to run a script to download them all. There is no need to convert the PDFs into plain text or markdown, this can be done on-the-fly with various tools.

## Chunking.

This may not be an issue in the future, but for now most models, with the exception of the expensive GPT4 32k and Claude V1, do not have a large enough context window to allow to submit an entire 30 page document and interact with it.

If we do use those models, then the methodology would be even simpler, we simply submit the entire ProDoc as context in one shot in this type of manner:

```
These are the UNDP High Risk Project Criteria:

- High Risk Project Criteria 1
- High Risk Project Criteria 2
- High Risk Project Criteria 3
- High Risk Project Criteria 4

Please review the following Project Document and let me know if the project matches any of the high risk project criteria.

Return your answer in the following format:

[Required CSV format for answer].

Do not provide any other analysis or response.

Here is the Project Document:

[Project Document text]
```

If we use one of the cheaper models with a limited context window, we would repeat a similar prompt as above, but instead of feeding the entire document, we would simply submit part of the document.

This would require a bit more work on the logging side, as we would have to keep track of each chunk and then log everything together for one project document, but this is not overly complex.

## Evaluation.

I’ve essentially covered this in the previous step but it’s worth noting that the evaluation process is critical in determining whether this AI-based system will be effective or not.

The accuracy and effectiveness of this process depends on the AI’s ability to correctly identify high-risk criteria in the ProDocs. This evaluation would involve analyzing the AI’s responses to see how well it has correctly identified high-risk criteria within the project documents.

For this part of the evaluation, it would be beneficial to start with a smaller sample of project documents and manually verify the AI’s findings. This would provide a baseline for its performance and can help us identify any systematic issues with the model’s understanding or processing of the documents.

Moreover, to evaluate the AI’s ability, we can also look at the ‘Certainty Score’ assigned by the model. If the AI is consistently assigning high certainty scores and these are corroborated by manual checks, it can be considered to be accurately identifying high-risk projects.

## Log the results.

Before we start any processing, we would need to consider precisely what we want to log. Obviously the ID of the project, along with the evaluation scores for each criteria and a certainty score. We may also want to log the time required for the analysis, but I think this is likely to be quite short, perhaps less than 20 seconds per ProDoc.

But, looping through all 15,000 documents would take quite a while at this rate, something like 300,000 seconds which is ~83 hours. So for every second that we can shave of the processing time, this gives us 3 hours back. If we want to loop through the documents more than once for evaluation purposes or do take other actions (i.e. summarisation or any other type of categorisation) then this consideration is crucial.

We can also run multiple instances concurrently, so perhaps we can quite easily get a 10x to 20x improvement in processing time simply using this approach, but we would run into the rate limits set by our LLM provider.

That said, we do have to be careful not to over optimise for speed and efficiency, because quality is also important here. Even if this is done so efficiently, we are still orders of magnitude more efficient, both in terms of time and money, than any type of manual review.

## Conclusion.

So that’s that! This seems a very promising approach towards automatically identifying high-risk projects, and this is how I see the scale up going:

The first test would be with Claude due to the 100k context window which simplifies things. I would provide an entire ProDoc and then simply ask it to evaluate whether it is a high-risk project or not. This could be done with 5-10 known high-risk and low-risk projects, to see if the LLM is able to correctly identify each. If not, further work is likely needed on the prompt. In chunks, this same experiment could be done with GPT4 and then GPT3.5, to see if the lower cost model is also capable of giving accurate results here.

The next steps would be to see if the models can return the answers in a regular structured manner than we can then use to log to a CSV file or Database in a future version. This can still be done with the web interface of ChatGPT or Claude. This is also the stage where I would consider some tests of the self-evaluation capabilities to see if we can improve output quality and also a more detailed methodology to understand how we calculate the confidence score of the answers. There have been various efforts here that look promising.[^7]

Once this is working as expected, we can then try to write a Python script that follows the full methodology and writes the logs, which again can be compared to know results to ensure that there is accuracy.

Then this can be done again for 100 ProDocs, and issues like rate limits can be solved during this phase.

Eventually, I can even imagine a deeper integration into UNDP’s transparency portal where any time a new project is posted, the ProDoc is automatically processed in this manner, and any high-risk project can be automatically flagged.

### References.

-   1

    [Publish What You Fund.](https://www.publishwhatyoufund.org/the-index/2022/united-nations-development-program-undp/)

-   2

    [UNDP Transparency Portal](https://open.undp.org/)

-   3

    [OpenAI Pricing](https://openai.com/pricing)

-   4

    [Claude Pricing](https://cdn2.assets-servd.host/anthropic-website/production/images/model_pricing_may2023.pdf)

-   5

    [What are tokens and how to count them?](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)

-   6

    [Large Language Models are Better Reasoners with Self-Verification](https://arxiv.org/abs/2212.09561)

-   7

    [Prompting GPT-3 To Be Reliable.](https://arxiv.org/pdf/2210.09150.pdf)

[^1]: [Publish What You Fund.](https://www.publishwhatyoufund.org/the-index/2022/united-nations-development-program-undp/)
[^2]: [UNDP Transparency Portal](https://open.undp.org/)
[^3]: [OpenAI Pricing](https://openai.com/pricing)
[^4]: [Claude Pricing](https://cdn2.assets-servd.host/anthropic-website/production/images/model_pricing_may2023.pdf)
[^5]: [What are tokens and how to count them?](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)
[^6]: [Large Language Models are Better Reasoners with Self-Verification](https://arxiv.org/abs/2212.09561)
[^7]: [Prompting GPT-3 To Be Reliable.](https://arxiv.org/pdf/2210.09150.pdf)
