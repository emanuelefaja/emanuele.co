---
title: "Automating Risk Registers at UNDP (v1)."
date: 2023-06-13T09:16:15Z
categories: [artificial-intelligence, united-nations]
---

As part of my exploration on the feasibility of AI to do quite advanced multi step analysis of documents, today I want to understand if **it’s possible to use LLMs (Large Language Models) to automatically create a risk register at UNDP (United Nations Development Programme) based on a single input: the Project Document.**

In my experience, these type of risk documents are things that nobody really likes to do, and so most people will typically just do them in those random times between meetings or the evenings. They are tedious but necessary paperwork that showcase that you’ve done the thinking around the project to ensure that you’re not taking unnecessarily dangerous risks. However, humans being humans, a risk register would likely never stop a project going ahead! Let’s be clear — if the project owner wants to go ahead, the project will go ahead. This is because the people who write the project documents are also the people who write the risk register.

And there is also the consideration that we do not want to dial down risk to zero, because that means that we would never do something innovative that has a chance of having a significantly positive impact for the world.

But regardless of what we think about the usability or necessity of the risk registers, this is something that is corporate policy and thus *must* be done. So if something must be done, the next question is then: *how can we do this as quickly as possible and with the highest level of quality?* And this is where I think artificial intelligence can play a crucial role in creating better risk registers for UNDP Projects.

The methodology is not particularly complex for this, and it mirrors some of my early explorations on [semantic search in PDF documents](/question-and-answers-ai-on-documents/) as well as [in detecting high risk projects in our portfolio.](/automatic-detection-of-undp-high-risk-projects/)

Here we go:

1.  **Preparing a PDF —** The project document is typically not short, they can range from 10,000 words all the way to 30,000 words. This means that we need to break in up into chunks for processing.
2.  **Defining Risk —** We need to clearly understand what a risk register is, and what the various definitions of risk. If we don’t do this, we may run into the issue of garbage in = garbage out.
3.  **Getting a Great Output —** Based on our definition of risk, we need to ensure that we have a strong prompt to the LLM that provides a high quality output based on the understanding of risk.
4.  **Parsing and Saving the data —** We need to ensure that we are getting structured data back from our LLM, and that this can easily be saved into a data structure.
5.  **Looping Through the PDF —** Once we have our setup, we need to loop through each chunk of our PDF and then get the final output.

So let’s get started!

## Step 1: Chunking PDFs.

This is super straight-forward, we can use the exact same code that we used on the question and answer AI for PDFs to break a PDF into chunks of 500 word text blocks and save it to a Python list:

```
import PyPDF2

# Extract text from a PDF file in 500-word chunks
def extract_text_from_pdf(pdf_file):
    # Read the PDF file
    with open(pdf_file, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        # Get the number of pages in the PDF
        num_pages = len(pdf_reader.pages)
        # Initialize an empty list to store the text chunks
        text_chunks = []
        # Loop through each page and extract the text
        for page_num in range(num_pages):
            page = pdf_reader.pages[page_num]
            # Extract the text from the page
            page_text = page.extract_text()
            # Split the text into individual words
            words = page_text.split()
            # Iterate over words and create 500-word chunks
            for i in range(0, len(words), 500):
                # Get a chunk of 500 words
                chunk = ' '.join(words[i:i+500])
                # Append the chunk to the text_chunks list
                text_chunks.append(chunk)
    # Return the list of text chunks
    return text_chunks
```

And then I can set which PDF I want this to happen to:

```
text_chunks = extract_text_from_pdf("sample.pdf")
```

So far — very easy!

## Step 2: Defining Risk.

Firstly let’s take a step back and ask what is a risk register and why does it exist?

Essentially this is a spreadsheet that contains an analysis of the potential risks that a project may encounter your implementation.

This includes:

-   **Event —** A description of the risk itself.
-   **Cause —** The potential causes of the events.
-   **Categorisation —** The categories and sub-categories of risk. These are predefined, more on this later.
-   **Impact —** This is a description of the impact that this risk could have on the project, people, and environment.
-   **Impact Level —** This is scored from 1—5, and there are descriptions for each level.
-   **Likelihood Level —** This is scored from 1—5, and there are descriptions for each level.
-   **Significance Level —** This is based on a multiplication of the impact level and likelihood level, to get a number between 1—25, and there are different levels depending on the number: Low, Moderate, Substantial, High. We will discuss this at length later.
-   **Risk Validity —** This is how long the risk is likely to be present.
-   **Risk Owner —** This is who “owns” the risk. I am not 100% sure what this actually means at this stage.
-   **Risk Treatment —** This is a description of mitigation and contingency measures to both reduce the likelihood of the risk happening, and how to reduce the impact if the risk does happen.
-   **Treatment Owner —** This is the person who is responsible for implementing the Risk Treatment.

The above are my plain language translation of the corporate-speak, I’ve added the full definitions as an appendix at the end of this essay.

[There exists a thorough 36-page document called UNDP Enterprise Risk Management (ERM) Policy and Procedures that details this out.](https://popp.undp.org/_layouts/15/WopiFrame.aspx?sourcedoc=/UNDP_POPP_DOCUMENT_LIBRARY/Public/AC_Accountability_Enterprise%20Risk%20Management%20Policy.docx&action=default)

As you can imagine, it is a fascinating read.

*Anyway* — let’s start off by deciding what we can safely ignore in our quest to automate this, and to make our overall solution leaner and easier to build.

I’m going to remove Risk Validity, as it is not immediately clear how I would determine what this should be, and also Risk Owner and Treatment Owner, because then we go down the rabbit hole of having to define who are the various people involved in the project what are their roles and then trying to match them to risks — *I think this is something that a human can do for more easily than an AI.*

Let’s now focus on the Impact Levels and Significance Levels.

Conceptually, the risk matrix looks like this, with 1 being low and 5 being high:

<table><tbody><tr><td><strong>5</strong></td><td>5</td><td>10</td><td>15</td><td>20</td><td>25</td></tr><tr><td><strong>4</strong></td><td>4</td><td>8</td><td>12</td><td>16</td><td>20</td></tr><tr><td><strong>3</strong></td><td>3</td><td>6</td><td>9</td><td>12</td><td>15</td></tr><tr><td><strong>2</strong></td><td>2</td><td>4</td><td>6</td><td>8</td><td>10</td></tr><tr><td><strong>1</strong></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td></td><td><strong>1</strong></td><td><strong>2</strong></td><td><strong>3</strong></td><td><strong>4</strong></td><td><strong>5</strong></td></tr></tbody></table>

*Impact vs Likelihood Matrix per Risk*

The overall of Significance Levels are shown more clearly, but perhaps less beautifully, in the ERM document mentioned above:

![](/media/2023/06/2CRSGC7C@2x.png)

So now we clearly understand how to define the significant level of a specific risk within a project document, but we still need the specific definitions of each impact level and likelihood level.

Impact Levels are defined as such:

1.  **Negligible —** Negligible/no impact on project results, positive or negative. Negligible or no potential adverse impacts on people and/or environment
2.  **Minor —** 5-20 % of the applicable and planned results  affected, positively or negatively. Potential adverse impacts on people and/or environment very limited and easily managed.  
3.  **Intermediate —** 20-30% of the applicable and planned results affected positively or negatively. Potential adverse impacts on people and/or environment of low magnitude, limited in scale and duration, can be avoided, managed or mitigated with accepted measures. 
4.  **Extensive —** 30-50% of the applicable and planned results/outcome affected positively or negatively. Potential adverse impacts on people and/or environment of medium to large magnitude, spatial extent and duration.  
5.  **Extreme —** More than 5O% of the applicable and planned results/outcome affected positively or negatively. Adverse impacts on people and/or environment of high magnitude, spatial extent and/or duration.  

And Likelihood Levels are defined:

1.  **Not Likely —** Every 5 years or less  and/or  very low  chance (<20%) of materializing.
2.  **Low likelihood** — Every 3-5 years  and/or low chance (20% – 40%) of materializing.
3.  **Moderately Likely —** Every 1-3 years and/o**r** chance of materializing between 40% – 60%.
4.  **Highly Likely —** Once or twice a year  **a**nd/or high chance of materializing (60% – 80%).
5.  **Expected —** Several times a year  and/or chance of materializing above 80% 

The OCD part me needs to eventually rewrite these to normalise the use of brackets with the percentages in these definitions, but we can handle that later! 😅

Finally, there are a bunch of categories that a risk can fall under:

![](/media/2023/06/BYyN6i8y@2x.png)

So to recap, we now understanding:

-   The definitions of the various Impact Levels
-   The definitions of the various Likelihood Levels.
-   How Significance Levels are calculated.
-   And we have the list of the risk categories.

I think this is enough to move us to the next step!

## Step 3: **Getting a Great Output**.

So this is all about crafting a great system prompt that OpenAI’s GPT models can use to give us a great risk analysis.

This is my first try:

```
You are an AI model trained to identify potential risks in the context of UNDP projects. Your output helps to draft risk registers that are attached to project documents. Review the text and identify any risks based on the following aspects.
Event — A description of the risk itself.

Cause — The potential causes of the events.

Impact — This is a description of the impact that this risk could have on the project, people, and environment.

Impact Level — This is scored from 1—5.

These are the impact levels that you can use to evaluate the impact of the risk:

Negligible — Negligible/no impact on project results, positive or negative. Negligible or no potential adverse impacts on people and/or environment

Minor — 5-20 % of the applicable and planned results  affected, positively or negatively. Potential adverse impacts on people and/or environment very limited and easily managed.  

Intermediate — 20-30% of the applicable and planned results affected positively or negatively. Potential adverse impacts on people and/or environment of low magnitude, limited in scale and duration, can be avoided, managed or mitigated with accepted measures. 

Extensive — 30-50% of the applicable and planned results/outcome affected positively or negatively. Potential adverse impacts on people and/or environment of medium to large magnitude, spatial extent and duration.  

Extreme — More than 5O% of the applicable and planned results/outcome affected positively or negatively. Adverse impacts on people and/or environment of high magnitude, spatial extent and/or duration.  

Then pick a Likelihood Level —  This is scored from 1—5. These are the Likelihood levels that you can use to evaluate the impact of the risk:

Not Likely — Every 5 years or less  and/or  very low  chance (<20%) of materializing.

Low likelihood — Every 3-5 years  and/or low chance (20% - 40%) of materializing.

Moderately Likely — Every 1-3 years and/or chance of materializing between 40% - 60%.

Highly Likely — Once or twice a year  and/or high chance of materializing (60% - 80%).

Expected — Several times a year  and/or chance of materializing above 80% 

Significance Level — This is based on a multiplication of the impact level and likelihood level, to get a number between 1—25,

Risk Treatment — This is a description of mitigation and contingency measures to both reduce the likelihood of the risk happening, and how to reduce the impact if the risk does happen.

Please categorise the risk into only one of the following categories:
1.1. Human rights
1.2. Gender equality and women’s empowerment
1.3. Grievances (Accountability to stakeholders)
1.4. Biodiversity conservation and sustainable natural resource management
1.5. Climate change and disaster risks
1.6. Community health, safety and security
1.7. Cultural heritage
1.8. Displacement and resettlement
1.9. Indigenous peoples
1.10. Labour and working conditions
1.11. Pollution prevention and resource efficiency
1.12. Stakeholder engagement
1.13. Sexual exploitation and abuse

2.1. Cost recovery
2.2. Value for money
2.3. Corruption and fraud
2.4. Fluctuation in credit rate, market, currency
2.5. Delivery
2.6. Budget availability and cash flow

3.1. Responsiveness to audit and evaluations (Delays in the conduct of and implementation of recommendations)
3.2. Leadership and management
3.3. Flexibility and opportunity management
3.4. Reporting and communication
3.5. Partners’ engagement
3.6. Transition and exit strategy
3.7. Occupational safety, health and well-being
3.8. Capacities of the partners

4.1. Governance
4.2. Execution capacity
4.3. Implementation arrangements
4.4. Accountability
4.5. Monitoring and oversight
4.6. Knowledge management
4.7. Human Resources
4.8. Internal control
4.9. Procurement

5.1. Public opinion and media
5.2. Engagement with private sector partnership
5.3. Code of conduct and ethics
5.4. Communications
5.5. Stakeholder management
5.6. Exposure to entities involved in money laundering and terrorism financing

6.1. Changes in the regulatory framework within the country of operation
6.2. Changes in the international regulatory framework affecting the whole organization
6.3. Deviation from UNDP internal rules and regulations

7.1. Alignment with UNDP strategic priorities
7.2. UN system coordination and reform
7.3. Stakeholder relations and partnerships
7.4. Competition
7.5. Government commitment
7.6. Change/turnover in government
7.7. Alignment with national priorities
7.8. Innovating, piloting, experimenting

8.1. Armed conflict
8.2. Political instability
8.3. Terrorism
8.4. Crime
8.5. Civil unrest
8.6. Natural hazards
8.7. Manmade hazards
8.8. Cyber security and threats
```

While this may seem absurdly long for a system prompt, it is only 684 words long, and given that GPT3.5 has a ~4000 word context and GPT4 has up to ~8,000 words, this is for sure feasible.

Let’s try to run this analysis on some of the chunks. I am using a project document from UNDP Iraq as a test.

![](/media/2023/06/L2T3Zw0x@2x.png)

## Step 4: **Parsing and Saving the Data**.

While the above is promising, it is very difficult to take that unstructured data and then make sense of it. So this step can be split into two parts:

1.  Getting a structure response from the LLM.
2.  Saving that structured response somewhere (i.e. an excel file)

So we need to get them better structure to our responses so then we can actually save this in a structured format. [In a previous effort in detecting high risk projects](/automatic-detection-of-undp-high-risk-projects/) I tried getting the data back in comma separated values because I was only concerned about the presence of a risk without any specific analysis.

I’m asking for an analysis, which could include paragraphs and sentences with commas. Asking for comma-separated values may be problematic because it could be hard to parse the data — there could be many commas in different places where I do not expect them to be.

A good alternative is to ask for JSON, which stands for JavaScript Object Notation, and it is a lightweight data format that is easy for humans to read and write, and also easy for machines to parse and generate. It is often used for exchanging data between web servers and web applications, and it is based on a subset of the JavaScript programming language. JSON consists of key-value pairs, where each key is a string and each value can be a string, number, boolean, array, or another JSON object.

To clarify, here is a simple example:

```
Sure, here's an example of a JSON object that represents information about a person:

{
  "name": "John Doe",
  "age": 30,
  "email": "johndoe@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  },
  "phoneNumbers": [
    {
      "type": "home",
      "number": "555-555-1234"
    },
    {
      "type": "work",
      "number": "555-555-5678"
    }
  ]
}
```

In this example, we have a JSON object with several key-value pairs. The name, age, and email keys have string values, while the address key has another JSON object as its value. The phoneNumbers key has an array of JSON objects as its value, each representing a different phone number for the person.

So we can try changing our system prompt to specify the output

```
Format your response as a JSON object:
"event": The specific risk,
"cause": What might cause the event to occur,
"impacts": Potential consequences of the event,
"impactLevel": Severity of the consequences, rate on a scale of 1 to 5,
"likelihoodLevel": Probability of the event occurring, rate on a scale of 1 to 5,
"significanceLevel": Overall assessment of the risk, rate on a scale of 1 to 5,
"riskTreatment": Potential strategies for managing the risk.'''
```

Let’s see what we get when we run this!

![](/media/2023/06/Qe718hfe@2x.png)

Fantastic, this is now returning risks is a structured manner! 🙂

However, during testing I did see that sometimes the JSON format was not returned correctly a few times:

![](/media/2023/06/QB7agt9E@2x.png)

And so, I edited my system prompt to make it even more specific:

```
Please respond in proper JSON format, with each key-value pair enclosed in quotes, a comma between each key-value pair,
and the entire object enclosed in curly braces as shown in the example below:

{
  "event": "Name of the event",
  "cause": "What might cause the event to occur",
  "impacts": "Potential consequences of the event",
  "impactLevel": 3,
  "likelihoodLevel": 2,
  "significanceLevel": 4,
  "riskTreatment": "Potential strategies for managing the risk"
}
```

Unfortunately, even this could not guarantee that I would get correct JSON 100% of the time, and I did not want to go down the road of having to check the JSON formatting, do error checks, etc.

However, there may be an even better and simpler approach, which could be to just to give instructions such as:

```
EVENT: The specific risk.
CAUSE: What might cause the event to occur.
IMPACTS: Potential consequences of the event.
IMPACT LEVEL: Severity of the consequences.
LIKELIHOOD LEVEL: Probability of the event occurring, rate on a scale of 1 to 5.
SIGNIFICANCE LEVEL: Overall assessment of the risk, rate on a scale of 1 to 5.
RISK TREATMENT: Potential strategies for managing the risk.
```

This appeared to be much easier for the AI to follow:

![](/media/2023/06/xniw39WT@2x.png)

And so we will stick with that for now instead of JSON. I think JSON is ultimately the better choice here, but I need further practice and research on how to ensure that I get correct JSON consistently.

So I think there are a few key ideas here to consider in our prompt. We have to be very clear of the format that we want the response to be in, but it is also worth giving a specific example to “train” the LLM on during the prompt, and I believe that this will increase the likelihood that we can a high-quality response back.

So let’s get the full updated system prompt:

```
You are an AI model trained to identify potential risks in the context of UNDP projects. Your output helps to draft risk registers that are attached to project documents. Review the text and identify any risks based on the following aspects.

EVENT: A description of the risk itself.
Cause — The potential causes of the events.
Impact — This is a description of the impact that this risk could have on the project, people, and environment.
Impact Level — This is scored from 1—5. These are the impact levels that you can use to evaluate the impact of the risk:
    Negligible — Negligible/no impact on project results, positive or negative.
    Negligible or no potential adverse impacts on people and/or environment Minor — 5-20 % of the applicable and planned results affected, positively or negatively. Potential adverse impacts on people and/or environment very limited and easily managed.
    Intermediate — 20-30% of the applicable and planned results affected positively or negatively. Potential adverse impacts on people and/or environment of low magnitude, limited in scale and duration, can be avoided, managed or mitigated with accepted measures.
    Extensive — 30-50% of the applicable and planned results/outcome affected positively or negatively. Potential adverse impacts on people and/or environment of medium to large magnitude, spatial extent and duration.
    Extreme — More than 5O% of the applicable and planned results/outcome affected positively or negatively. Adverse impacts on people and/or environment of high magnitude, spatial extent and/or duration.

Then pick a Likelihood Level — This is scored from 1—5. These are the Likelihood levels that you can use to evaluate the impact of the risk:
    Not Likely — Every 5 years or less and/or very low chance (<20%) of materializing.
    Low likelihood — Every 3-5 years and/or low chance (20% - 40%) of materializing.
    Moderately Likely — Every 1-3 years and/or chance of materializing between 40% - 60%.
    Highly Likely — Once or twice a year  and/or high chance of materializing (60% - 80%).
    Expected — Several times a year  and/or chance of materializing above 80%
Significance Level — This is based on a multiplication of the impact level and likelihood level, to get a number between 1—25. Only return the number, do not show your calculation.
Risk Treatment — This is a description of mitigation and contingency measures to both reduce the likelihood of the risk happening, and how to reduce the impact if the risk does happen.

Please categorise the risk into only one of the following categories: 1.1. Human rights 1.2. Gender equality and women’s empowerment 1.3. Grievances (Accountability to stakeholders) 1.4. Biodiversity conservation and sustainable natural resource management 1.5. Climate change and disaster risks 1.6. Community health, safety and security 1.7. Cultural heritage 1.8. Displacement and resettlement 1.9. Indigenous peoples 1.10. Labour and working conditions 1.11. Pollution prevention and resource efficiency 1.12. Stakeholder engagement 1.13. Sexual exploitation and abuse 2.1. Cost recovery 2.2. Value for money 2.3. Corruption and fraud 2.4. Fluctuation in credit rate, market, currency 2.5. Delivery 2.6. Budget availability and cash flow 3.1. Responsiveness to audit and evaluations (Delays in the conduct of and implementation of recommendations) 3.2. Leadership and management 3.3. Flexibility and opportunity management 3.4. Reporting and communication 3.5. Partners’ engagement 3.6. Transition and exit strategy 3.7. Occupational safety, health and well-being 3.8. Capacities of the partners 4.1. Governance 4.2. Execution capacity 4.3. Implementation arrangements 4.4. Accountability 4.5. Monitoring and oversight 4.6. Knowledge management 4.7. Human Resources 4.8. Internal control 4.9. Procurement 5.1. Public opinion and media 5.2. Engagement with private sector partnership 5.3. Code of conduct and ethics 5.4. Communications 5.5. Stakeholder management 5.6. Exposure to entities involved in money laundering and terrorism financing 6.1. Changes in the regulatory framework within the country of operation 6.2. Changes in the international regulatory framework affecting the whole organization 6.3. Deviation from UNDP internal rules and regulations 7.1. Alignment with UNDP strategic priorities 7.2. UN system coordination and reform 7.3. Stakeholder relations and partnerships 7.4. Competition 7.5. Government commitment 7.6. Change/turnover in government 7.7. Alignment with national priorities 7.8. Innovating, piloting, experimenting 8.1. Armed conflict 8.2. Political instability 8.3. Terrorism 8.4. Crime 8.5. Civil unrest 8.6. Natural hazards 8.7. Manmade hazards 8.8. Cyber security and threats

The format of your response must be as follows. DO NOT separate each section with new lines or line breaks.

#Format Start#
The specific risk.
CAUSE: What might cause the event to occur.
IMPACTS: Potential consequences of the event.
IMPACT LEVEL: Severity of the consequences, rate on a scale of 1 to 5 and only return the number.
LIKELIHOOD LEVEL: Probability of the event occurring, rate on a scale of 1 to 5 and only return the number.
SIGNIFICANCE LEVEL: Overall assessment of the risk, rate on a scale of 1 to 25 and only return the number.
RISK TREATMENT: Potential strategies for managing the risk.
#Format End#

To further clarify, here is an example:

Example:
Consider a UNDP project aiming to construct a new dam in a region prone to frequent landslides. Identify the risks associated with this project based on the given aspects and provide the risks in the specified format.

EVENT: Landslide damaging the dam
CAUSE: Frequent landslides in the region
IMPACTS: Damage to the dam structure compromising its integrity, potential flooding leading to loss of property and displacement of communities, project delays resulting in increased costs and missed deadlines
IMPACT LEVEL: 4
LIKELIHOOD LEVEL: 3
SIGNIFICANCE LEVEL: 12
RISK TREATMENT: Conduct a thorough geotechnical investigation, implement landslide mitigation measures such as slope stabilization and drainage systems, consider alternative locations with lower landslide risks, and design the dam to withstand potential landslides through reinforced structural elements
```

And let’s see what happens.

![](/media/2023/06/ERt9TJC4@2x.png)

This is good, but I am getting line breaks between each area, and also for Significance Level I am not just getting the number but also the underlining calculation, which I have no need for.

Let’s simplify and modify our system prompt:

```
You are an AI model trained to identify potential risks in the context of UNDP projects. Your output helps to draft risk registers that are attached to project documents. Review the text and identify any risks based on the following aspects.

EVENT: A description of the risk itself.
IMPACTS: This is a description of the impact that this risk could have on the project, people, and environment.
IMPACT LEVEL: Severity of the consequences, rate on a scale of 1 to 5 and only return the number.
LIKELIHOOD LEVEL: Probability of the event occurring, rate on a scale of 1 to 5 and only return the number.
SIGNIFICANCE LEVEL: This is based on a multiplication of the impact level and likelihood level, to get a number between 1—25. Only return the number, do not show your calculation.
RISK TREATMENT: Potential strategies for managing the risk. This is a description of mitigation and contingency measures to both reduce the likelihood of the risk happening, and how to reduce the impact if the risk does happen.

These are the impact levels that you can use to evaluate the impact of the risk:
    Level 1: Negligible — Negligible/no impact on project results, positive or negative.
    Level 2: Negligible or no potential adverse impacts on people and/or environment Minor — 5-20 % of the applicable and planned results affected, positively or negatively. Potential adverse impacts on people and/or environment very limited and easily managed.
    Level 3: Intermediate — 20-30% of the applicable and planned results affected positively or negatively. Potential adverse impacts on people and/or environment of low magnitude, limited in scale and duration, can be avoided, managed or mitigated with accepted measures.
    Level 4: Extensive — 30-50% of the applicable and planned results/outcome affected positively or negatively. Potential adverse impacts on people and/or environment of medium to large magnitude, spatial extent and duration.
    Level 5: Extreme — More than 5O% of the applicable and planned results/outcome affected positively or negatively. Adverse impacts on people and/or environment of high magnitude, spatial extent and/or duration.

These are the Likelihood levels that you can use to evaluate the impact of the risk:
    Level 1: Not Likely — Every 5 years or less and/or very low chance (<20%) of materializing.
    Level 2: Low likelihood — Every 3-5 years and/or low chance (20% - 40%) of materializing.
    Level 3: Moderately Likely — Every 1-3 years and/or chance of materializing between 40% - 60%.
    Level 4: Highly Likely — Once or twice a year  and/or high chance of materializing (60% - 80%).
    Level 5: Expected — Several times a year  and/or chance of materializing above 80%

Please categorise the risk into only one of the following categories: 1.1. Human rights 1.2. Gender equality and women’s empowerment 1.3. Grievances (Accountability to stakeholders) 1.4. Biodiversity conservation and sustainable natural resource management 1.5. Climate change and disaster risks 1.6. Community health, safety and security 1.7. Cultural heritage 1.8. Displacement and resettlement 1.9. Indigenous peoples 1.10. Labour and working conditions 1.11. Pollution prevention and resource efficiency 1.12. Stakeholder engagement 1.13. Sexual exploitation and abuse 2.1. Cost recovery 2.2. Value for money 2.3. Corruption and fraud 2.4. Fluctuation in credit rate, market, currency 2.5. Delivery 2.6. Budget availability and cash flow 3.1. Responsiveness to audit and evaluations (Delays in the conduct of and implementation of recommendations) 3.2. Leadership and management 3.3. Flexibility and opportunity management 3.4. Reporting and communication 3.5. Partners’ engagement 3.6. Transition and exit strategy 3.7. Occupational safety, health and well-being 3.8. Capacities of the partners 4.1. Governance 4.2. Execution capacity 4.3. Implementation arrangements 4.4. Accountability 4.5. Monitoring and oversight 4.6. Knowledge management 4.7. Human Resources 4.8. Internal control 4.9. Procurement 5.1. Public opinion and media 5.2. Engagement with private sector partnership 5.3. Code of conduct and ethics 5.4. Communications 5.5. Stakeholder management 5.6. Exposure to entities involved in money laundering and terrorism financing 6.1. Changes in the regulatory framework within the country of operation 6.2. Changes in the international regulatory framework affecting the whole organization 6.3. Deviation from UNDP internal rules and regulations 7.1. Alignment with UNDP strategic priorities 7.2. UN system coordination and reform 7.3. Stakeholder relations and partnerships 7.4. Competition 7.5. Government commitment 7.6. Change/turnover in government 7.7. Alignment with national priorities 7.8. Innovating, piloting, experimenting 8.1. Armed conflict 8.2. Political instability 8.3. Terrorism 8.4. Crime 8.5. Civil unrest 8.6. Natural hazards 8.7. Manmade hazards 8.8. Cyber security and threats

To further clarify, here is an example response:

Example:
Consider a UNDP project aiming to construct a new dam in a region prone to frequent landslides. Identify the risks associated with this project based on the given aspects and provide the risks in the specified format.

EVENT: Landslide damaging the dam
CAUSE: Frequent landslides in the region
IMPACTS: Damage to the dam structure compromising its integrity, potential flooding leading to loss of property and displacement of communities, project delays resulting in increased costs and missed deadlines
IMPACT LEVEL: 4
LIKELIHOOD LEVEL: 3
SIGNIFICANCE LEVEL: 12
RISK TREATMENT: Conduct a thorough geotechnical investigation, implement landslide mitigation measures such as slope stabilization and drainage systems, consider alternative locations with lower landslide risks, and design the dam to withstand potential landslides through reinforced structural elements
```

And wonderful, this what I get out:

![](/media/2023/06/OJnrEHZC@2x.png)

We can make a few edits to ensure that things are nicely separated:

![](/media/2023/06/M4dlXh6v@2x.png)

Okay, next thing is to then try and get this saved somewhere. There is one complexity here. Each time we loop through our code in a chunk, we cannot guarantee that there will only be one risk identified, we may have more than one risk, so this is going to add some complexity.

There is also going to be times when no risks are identified, and this is also something that we need to be able to handle. At the end of my prompt I just added:

If you do not detect any risks, just reply with: NO RISK DETECTED

So my final prompt for now is:

```
You are an AI model trained to identify potential risks in the context of UNDP projects. Your output helps to draft risk registers that are attached to project documents. Review the text and identify any risks based on the following aspects.

EVENT: A description of the risk itself.
IMPACTS: This is a description of the impact that this risk could have on the project, people, and environment.
IMPACT LEVEL: Severity of the consequences, rate on a scale of 1 to 5 and only return the number.
LIKELIHOOD LEVEL: Probability of the event occurring, rate on a scale of 1 to 5 and only return the number.
SIGNIFICANCE LEVEL: This is based on a multiplication of the impact level and likelihood level, to get a number between 1—25. Only return the number, do not show your calculation.
RISK TREATMENT: Potential strategies for managing the risk. This is a description of mitigation and contingency measures to both reduce the likelihood of the risk happening, and how to reduce the impact if the risk does happen.

These are the impact levels that you can use to evaluate the impact of the risk:
    Level 1: Negligible — Negligible/no impact on project results, positive or negative.
    Level 2: Negligible or no potential adverse impacts on people and/or environment Minor — 5-20 % of the applicable and planned results affected, positively or negatively. Potential adverse impacts on people and/or environment very limited and easily managed.
    Level 3: Intermediate — 20-30% of the applicable and planned results affected positively or negatively. Potential adverse impacts on people and/or environment of low magnitude, limited in scale and duration, can be avoided, managed or mitigated with accepted measures.
    Level 4: Extensive — 30-50% of the applicable and planned results/outcome affected positively or negatively. Potential adverse impacts on people and/or environment of medium to large magnitude, spatial extent and duration.
    Level 5: Extreme — More than 5O% of the applicable and planned results/outcome affected positively or negatively. Adverse impacts on people and/or environment of high magnitude, spatial extent and/or duration.

These are the Likelihood levels that you can use to evaluate the impact of the risk:
    Level 1: Not Likely — Every 5 years or less and/or very low chance (<20%) of materializing.
    Level 2: Low likelihood — Every 3-5 years and/or low chance (20% - 40%) of materializing.
    Level 3: Moderately Likely — Every 1-3 years and/or chance of materializing between 40% - 60%.
    Level 4: Highly Likely — Once or twice a year  and/or high chance of materializing (60% - 80%).
    Level 5: Expected — Several times a year  and/or chance of materializing above 80%

Please categorise the risk into only one of the following categories: 1.1. Human rights 1.2. Gender equality and women’s empowerment 1.3. Grievances (Accountability to stakeholders) 1.4. Biodiversity conservation and sustainable natural resource management 1.5. Climate change and disaster risks 1.6. Community health, safety and security 1.7. Cultural heritage 1.8. Displacement and resettlement 1.9. Indigenous peoples 1.10. Labour and working conditions 1.11. Pollution prevention and resource efficiency 1.12. Stakeholder engagement 1.13. Sexual exploitation and abuse 2.1. Cost recovery 2.2. Value for money 2.3. Corruption and fraud 2.4. Fluctuation in credit rate, market, currency 2.5. Delivery 2.6. Budget availability and cash flow 3.1. Responsiveness to audit and evaluations (Delays in the conduct of and implementation of recommendations) 3.2. Leadership and management 3.3. Flexibility and opportunity management 3.4. Reporting and communication 3.5. Partners’ engagement 3.6. Transition and exit strategy 3.7. Occupational safety, health and well-being 3.8. Capacities of the partners 4.1. Governance 4.2. Execution capacity 4.3. Implementation arrangements 4.4. Accountability 4.5. Monitoring and oversight 4.6. Knowledge management 4.7. Human Resources 4.8. Internal control 4.9. Procurement 5.1. Public opinion and media 5.2. Engagement with private sector partnership 5.3. Code of conduct and ethics 5.4. Communications 5.5. Stakeholder management 5.6. Exposure to entities involved in money laundering and terrorism financing 6.1. Changes in the regulatory framework within the country of operation 6.2. Changes in the international regulatory framework affecting the whole organization 6.3. Deviation from UNDP internal rules and regulations 7.1. Alignment with UNDP strategic priorities 7.2. UN system coordination and reform 7.3. Stakeholder relations and partnerships 7.4. Competition 7.5. Government commitment 7.6. Change/turnover in government 7.7. Alignment with national priorities 7.8. Innovating, piloting, experimenting 8.1. Armed conflict 8.2. Political instability 8.3. Terrorism 8.4. Crime 8.5. Civil unrest 8.6. Natural hazards 8.7. Manmade hazards 8.8. Cyber security and threats

To further clarify, here is an example response:

Example:
Consider a UNDP project aiming to construct a new dam in a region prone to frequent landslides. Identify the risks associated with this project based on the given aspects and provide the risks in the specified format.

EVENT: Landslide damaging the dam
CAUSE: Frequent landslides in the region
IMPACTS: Damage to the dam structure compromising its integrity, potential flooding leading to loss of property and displacement of communities, project delays resulting in increased costs and missed deadlines
IMPACT LEVEL: 4
LIKELIHOOD LEVEL: 3
SIGNIFICANCE LEVEL: 12
RISK TREATMENT: Conduct a thorough geotechnical investigation, implement landslide mitigation measures such as slope stabilization and drainage systems, consider alternative locations with lower landslide risks, and design the dam to withstand potential landslides through reinforced structural elements

Please separate each new risk with a new line break.

If you do not detect any risks, just reply with: NO RISK DETECTED
```

887 words —not bad.

As a test, let’s just write the entire full output to a text document. This means creating a list, storing the responses, and then saving everything to a text document:

```
# Initialize an empty list to store the responses
responses = []

[processing loop]
 # Append the response to the list
    responses.append(response['choices'][0]['message']['content'])

# Write the responses to a text document
with open("responses.txt", "w") as file:
    for resp in responses:
        file.write(resp + "\n")
```

The text file looks like this:

![](/media/2023/06/KHJLWhKm@2x.png)

Which makes me realize that I forgot to include a structured response for category, so I’ve updated the system prompt to deal with that, and then we can try this again:

![](/media/2023/06/mLUypyQv@2x.png)

And this is much better, but I notice the line breaks are not always respected, and also sometimes “Event” is called “Risk” instead, so some further editing of the prompt is required.

Let’s tackle the event/risk mislabelling first. I edited the prompt to say:

EVENT: A description of the risk event itself. **Make sure to never label this as RISK: but always as EVENT:**

And this seems to work, no more mislabelling:

![](/media/2023/06/6gmQbxle@2x.png)

And now let’s focus on the line breaks. Because there can be multiple risks within one chunk, it is actually quite difficult to split the risks. I was considering making the chunks very small, perhaps 1-2 sentences, but this would massively increase the total cost and time required to parse one document.

Instead, we can parse through the text, detect the “EVENT:” label, and add line breaks:

```
# Split the response into individual risks
    risks = response['choices'][0]['message']['content'].split("EVENT:")

    # Remove the empty first element
    risks = risks[1:]

    # Add "EVENT:" back to each risk
    formatted_risks = ["EVENT:" + risk.strip() for risk in risks]

    # Join the risks with line breaks
    formatted_response = "\n\n".join(formatted_risks)

    # Append the response to the list
    responses.append(formatted_response)

# Write the responses to a text document
with open("responses.txt", "w") as file:
    for resp in responses:
        file.write(resp + "\n\n")
```

Let’s see what this gives us!

![](/media/2023/06/id2Ce86W@2x.png)

Okay success, this is now working as expected! But, our ultimate goal is not to save this output into a text file, but rather into a excel file that someone can download, open, and then start editing right away.

As an initial way to think through this, we can just write a separate little program that will process our text file and convert it into excel:

```
import pandas as pd

# Read the text document
with open('responses.txt', 'r') as file:
    text = file.read()

# Split the text into individual risk entries
risk_entries = text.split('\n\n')

# Remove any empty entries
risk_entries = [entry for entry in risk_entries if entry.strip()]

# Initialize lists to store the extracted information
events = []
causes = []
impact_texts = []
impact_levels = []
likelihood_levels = []
significance_levels = []
risk_treatments = []
categories = []

# Iterate through each risk entry and extract the information
for entry in risk_entries:
    lines = entry.split('\n')
    event = lines[0].split(':', 1)[1].strip()
    cause = lines[1].split(':', 1)[1].strip()
    impacts = lines[2].split(':', 1)[1].strip()
    impact_level = lines[3].split(':', 1)[1].strip()
    likelihood_level = lines[4].split(':', 1)[1].strip()
    significance_level = lines[5].split(':', 1)[1].strip()
    risk_treatment = lines[6].split(':', 1)[1].strip()
    category = lines[7].split(':', 1)[1].strip()

    events.append(event)
    causes.append(cause)
    impact_texts.append(impacts)
    impact_levels.append(impact_level)
    likelihood_levels.append(likelihood_level)
    significance_levels.append(significance_level)
    risk_treatments.append(risk_treatment)
    categories.append(category)

# Create a DataFrame from the extracted information
df = pd.DataFrame({
    'EVENT': events,
    'CAUSE': causes,
    'IMPACTS': impact_texts,
    'IMPACT LEVEL': impact_levels,
    'LIKELIHOOD LEVEL': likelihood_levels,
    'SIGNIFICANCE LEVEL': significance_levels,
    'RISK TREATMENT': risk_treatments,
    'CATEGORY': categories
})

# Save the DataFrame to an Excel file
df.to_excel('risk_registers.xlsx', index=False)
```

Let’s see what we get when we run this.

![](/media/2023/06/l9EZZF4U@2x.png)

Perfect, we get a structured excel file just as we expected! This has been quite an effort with lots of trial and error, and I am going to end it here for the V1.

For the V2, there is quite a lot more to consider:

1.  Handling chunks that do not contain risks.
2.  Automating the pipeline from GPT response to Excel, without the intermediary text file.
3.  Creating a simple web frontend where a user can drop a PDF, have it processed, and then download the corresponding excel file.
4.  Improving the prompt to be more specific about the type of risks, or perhaps generally providing more information about the risks.
5.  Providing GPT context and information about the risks already found in the document from previous chunks, so we do not get repetition in the risks as each chunk is processed.

## Appendix: Terms & Definitions.

-   **Business process:** A business process is the set of activities supporting an organizational structure in achieving its objectives.
-   **Consequence:** Is the effect that may result from a risk being materialized. There might be several consequences of a risk, including cascading effects. Often, the total impact of a risk is broader than the sum of all its consequences.
-   **Event:** The occurrence or change of a particular set of circumstances. An event can be one or more occurrences, can have several causes, and can consist of something not happening.
-   **Impact:** The totality of all effects of an event affecting objectives.
-   **Likelihood:** The chance of something happening.
-   **Risk:** The effect of uncertainty on organizational objectives, which could be either positive and / or negative (ISO 31000:2018). Risk is described as a ‘future event’, with its causes and its potential consequences. UNDP ERM is concerned with:
-   **Institutional risk:** Existing and emerging uncertainties that could facilitate or hinder the efficiency and effectiveness of core operations within the organization.
-   **Programmatic risk:** Existing and emerging uncertainties that could facilitate or hinder the realization of programme or project objectives.
-   **Contextual risk:** Existing and emerging uncertainties that could facilitate or hinder progress towards development priorities of a given society. ERM considers contextual risk when these external uncertainties also present institutional or programmatic risks. Note that some contextual risks may fall under established risk management practice and definitions that need to be considered (e.g. for climate and disaster risk).
-   **Risk appetite:** The amount and type of risks that projects, programmes/units, and UNDP as a whole is willing to take in order to meet its strategic objectives at each level respectively.
-   **Risk assessment:** The overall process of risk identification, risk analysis and risk evaluation.
-   **Risk categories:** A risk classification system in relation to what organization does to help to systematically identify and track the risks across its main areas of performance.
-   **Risk escalation:** Transfer of risk ownership to the next in line in the organizational hierarchy.
-   **Risk level:** Significance of a risk, expressed as the combination of impact and likelihood.
-   **Risk management:** Coordinated activities to direct and control an organization with regard to risk at all levels. Risk management is concerned with exploring new opportunities and avoiding negative consequences within the realization of UNDP Strategy.
-   **Risk manager:** A designated person responsible for facilitating and coordinating the management of risk.
-   **Risk owner:** The individual who is accountable for ensuring a risk is managed appropriately.
-   **Risk profile:** A description of any set of risks. The set of risks can contain those that relate to the whole organization, part of the organization, a programme or project, or as otherwise defined.
-   **Risk Register:** A risk management tool that serves as a record of all risks across the organization, including at the project level, programme/unit level, and corporate level. For each risk identified, it includes the following information: risk ID, risk description (cause, event, consequences), likelihood, impact, significance level, risk category, risk owner, risk treatment action, risk escalation, and risk status.
-   **Risk treatment:** A measure to modify risk exposure to provide reasonable assurance towards the achievement of objectives. This includes risk treatment, which is response to negative events, and opportunity management, which is response to positive events.
-   **Treatment owner:** The individual who is responsible for executing the risk treatment.
