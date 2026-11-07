---
title: "Automating Risk Registers at UNDP (v2)."
date: 2023-06-14T18:03:48Z
categories: [artificial-intelligence, essays, united-nations]
---

This is a follow on exploration from my essay on [Automating Risk Registers at UNDP.](/automating-risk-registers-at-undp-v1/)

I ended the previous exploration saying that there was still plenty to do:

1.  Handling chunks that do not contain risks.
2.  Automating the pipeline from GPT response to Excel, without the intermediary text file.
3.  Creating a simple web frontend where a user can drop a PDF, have it processed, and then download the corresponding excel file.
4.  Improving the prompt to be more specific about the type of risks, or perhaps generally providing more information about the risks.
5.  Providing GPT context and information about the risks already found in the document from previous chunks, so we do not get repetition in the risks as each chunk is processed.

Today I want to explore handling the first three points.

## 1\. Handling No Risk.

This was actually surprisingly easy, I simply added this to the prompt:

```
If you do not detect any risks, just reply with:

NO RISK DETECTED
```

And this is precisely what happened. I don’t really have much to say on this, other than the fact that I am quite impressed that adding just a few words to an almost 1,000 word prompt can make such a difference. You would think that the longer the prompt, the less impact a set number of additional words would have. Perhaps this is actually the case, but this adding makes a huge difference.

You can see the output into the text file here and how it looks when a risk is *not* detected in a given chunk:

![](/media/2023/06/50mDL3RV@2x.png)

## 2\. Automating The Pipeline.

So obviously having the output as the text file above, and then having to run a separate app to then convert that into an Excel file is a clunky solution.

It would be far better if we can just get script to directly output to Excel.

This requires the use of the “Pandas” library. Pandas is is an open-source data manipulation and analysis tool in Python and is widely used in data analysis, data science, and machine learning projects.

It provides easy-to-use data structures and data analysis tools for handling and manipulating numerical tables and time series data. The key data structures in pandas are the Series (a one-dimensional array-like object) and the DataFrame (a two-dimensional table-like data structure).

Pandas allows users to perform various operations on data such as filtering, grouping, merging, and reshaping data. It also provides functions for handling missing data, handling time-series data, and reading and writing data in various formats such as CSV, Excel, SQL databases, and JSON.

Sounds just like what we need! 😀

The code looks like this:

```
risks = response['choices'][0]['message']['content'].split("EVENT:")
    risks = risks[1:]
    formatted_risks = ["EVENT:" + risk.strip() for risk in risks]
    responses += formatted_risks

events = []
causes = []
impact_texts = []
impact_levels = []
likelihood_levels = []
significance_levels = []
risk_treatments = []
categories = []

for entry in responses:
    if entry.strip() == "NO RISK DETECTED":
        continue

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

df.to_excel('risk_registers.xlsx', index=False)
```

This is what happens:

1.  The program grabs the equivalent of our text document: a list of all the risks in that same format. It then cuts this long text into smaller parts every time it sees “EVENT:”. This is how we split all the risks.
2.  It then tidies up each risk part by adding “EVENT:” back at the start and removing any extra spaces at the beginning or end. These tidied up parts are then added to a list of responses.
3.  The program gets ready to sort the details of each risk by setting up empty buckets (in the form of lists) for different types of information like the event description, cause, impacts, and various levels of risk.
4.  It goes through each response (each tidied up part talking about a risk). If a part only says “NO RISK DETECTED”, it skips it and moves on.
5.  For each risk that’s actually detected, it splits the part into lines (assuming each piece of information is on a new line), and then splits each line at the first colon (:), taking the second half (after the colon) and removing any extra spaces at the beginning or end. This specific information is then placed into its corresponding bucket.
6.  After it has sorted all the information into the right buckets, it creates a table (called a DataFrame) with each bucket as a column and labels the columns appropriately.
7.  This table is then saved as an Excel file named ‘risk\_registers.xlsx’, and it’s set up so that the rows aren’t numbered in the file.

Basically, the program is like a worker at a sorting line. It takes in a messy pile of information, breaks it down, cleans it up, sorts it into the right buckets, and then packs it neatly into an Excel file 🙂

This is the full code, in case you’re interested:

```
import openai
import PyPDF2
import pandas as pd
from tqdm import tqdm

openai.api_key = 'Your API KEY'
openai_model='gpt-3.5-turbo-16k' #or choose gpt-4-0613
testing = False

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
            # Iterate over words and create chunks
            for i in range(0, len(words), 4000):
                # Get a chunk of  words
                chunk = ' '.join(words[i:i+4000])
                # Append the chunk to the text_chunks list
                text_chunks.append(chunk)
    # Return the list of text chunks
    return text_chunks

text_chunks = extract_text_from_pdf("sample.pdf")

system_prompt = '''
You are an AI model trained to identify potential risks in the context of UNDP projects. Your output helps to draft risk registers that are attached to project documents. Review the text and identify any risks based on the following aspects.

EVENT: A description of the risk event itself. Make sure to never label this as RISK: but always as EVENT:
CAUSE: The cause of the event.
IMPACTS: This is a description of the impact that this risk could have on the project, people, and environment.
IMPACT LEVEL: Severity of the consequences, rate on a scale of 1 to 5 and only return the number.
LIKELIHOOD LEVEL: Probability of the event occurring, rate on a scale of 1 to 5 and only return the number.
SIGNIFICANCE LEVEL: This is based on a multiplication of the impact level and likelihood level, to get a number between 1—25. Only return the number, do not show your calculation.
RISK TREATMENT: Potential strategies for managing the risk. This is a description of mitigation and contingency measures to both reduce the likelihood of the risk happening, and how to reduce the impact if the risk does happen.
CATEGORY: Please categorise the risk into only one of the following categories: 1.1. Human rights 1.2. Gender equality and women’s empowerment 1.3. Grievances (Accountability to stakeholders) 1.4. Biodiversity conservation and sustainable natural resource management 1.5. Climate change and disaster risks 1.6. Community health, safety and security 1.7. Cultural heritage 1.8. Displacement and resettlement 1.9. Indigenous peoples 1.10. Labour and working conditions 1.11. Pollution prevention and resource efficiency 1.12. Stakeholder engagement 1.13. Sexual exploitation and abuse 2.1. Cost recovery 2.2. Value for money 2.3. Corruption and fraud 2.4. Fluctuation in credit rate, market, currency 2.5. Delivery 2.6. Budget availability and cash flow 3.1. Responsiveness to audit and evaluations (Delays in the conduct of and implementation of recommendations) 3.2. Leadership and management 3.3. Flexibility and opportunity management 3.4. Reporting and communication 3.5. Partners’ engagement 3.6. Transition and exit strategy 3.7. Occupational safety, health and well-being 3.8. Capacities of the partners 4.1. Governance 4.2. Execution capacity 4.3. Implementation arrangements 4.4. Accountability 4.5. Monitoring and oversight 4.6. Knowledge management 4.7. Human Resources 4.8. Internal control 4.9. Procurement 5.1. Public opinion and media 5.2. Engagement with private sector partnership 5.3. Code of conduct and ethics 5.4. Communications 5.5. Stakeholder management 5.6. Exposure to entities involved in money laundering and terrorism financing 6.1. Changes in the regulatory framework within the country of operation 6.2. Changes in the international regulatory framework affecting the whole organization 6.3. Deviation from UNDP internal rules and regulations 7.1. Alignment with UNDP strategic priorities 7.2. UN system coordination and reform 7.3. Stakeholder relations and partnerships 7.4. Competition 7.5. Government commitment 7.6. Change/turnover in government 7.7. Alignment with national priorities 7.8. Innovating, piloting, experimenting 8.1. Armed conflict 8.2. Political instability 8.3. Terrorism 8.4. Crime 8.5. Civil unrest 8.6. Natural hazards 8.7. Manmade hazards 8.8. Cyber security and threats

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

To further clarify, here is an example response:

Example:
Consider a UNDP project aiming to construct a new dam in a region prone to frequent landslides. Identify the risks associated with this project based on the given aspects and provide the risks in the specified format.

EVENT: Landslide damaging the dam
CAUSE: Frequent landslides in the region
IMPACTS: Damage to the dam structure compromising its integrity, potential flooding leading to loss of property and displacement of communities, project delays resulting in increased costs and missed deadlines
IMPACT LEVEL: 4
LIKELIHOOD LEVEL: 3
SIGNIFICANCE LEVEL: 12
RISK TREATMENT: Conduct a thorough geotechnical investigation, implement landslide mitigation measures such as slope stabilization and drainage systems, consider alternative locations with lower landslide risks, and design the dam to withstand potential landslides through reinforced structural elements.
CATEGORY: 1.1. Human rights

YOU MUST insert a line break before and after this to separate the different risks.

If you do not detect any risks, just reply with:

NO RISK DETECTED
'''

text_chunks = extract_text_from_pdf("sample.pdf")

responses = []

if testing:
    text_chunks = text_chunks[:7]

# Loop through each chunk with a progress bar
for text_chunk in tqdm(text_chunks, desc="Processing text chunks"):
    # Print an empty line for separation
    print()
    messages = [
        {'role': 'system', 'content': system_prompt},
        {'role': 'assistant', 'content': text_chunk},
    ]

    response = openai.ChatCompletion.create(
        model=openai_model,
        messages=messages,
        temperature=0,
        max_tokens=2000
    )

    risks = response['choices'][0]['message']['content'].split("EVENT:")
    risks = risks[1:]
    formatted_risks = ["EVENT:" + risk.strip() for risk in risks]
    responses += formatted_risks

events = []
causes = []
impact_texts = []
impact_levels = []
likelihood_levels = []
significance_levels = []
risk_treatments = []
categories = []

for entry in responses:
    if entry.strip() == "NO RISK DETECTED":
        continue

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

df.to_excel('risk_registers.xlsx', index=False)
```

This looks like this:

![](/media/2023/06/0PFCHnjW@2x.png)

Pretty cool.

## 3\. A Front-End.

As usual, [Streamlit](https://streamlit.io) comes to the rescue here. This is directly from their website: *A faster way to build and share data apps Streamlit turns data scripts into shareable web apps in minutes.All in pure Python. No front‑end experience required.*

This is basic code that I used to modify our command-line Python app above:

```
# Streamlit
st.title('🇺🇳 Automatic Risk Register Creation.')

# Upload PDF file
uploaded_file = st.file_uploader("Upload a project document to automatically create a risk register ", type=['pdf'])
if uploaded_file is not None:
    bytes_data = uploaded_file.read()

    # Create a BytesIO object
    bytes_io = io.BytesIO(bytes_data)

    # Extract the text chunks
    with st.spinner('Extracting text from PDF...'):
        text_chunks = extract_text_from_pdf(bytes_io)
```

Because this can take a while to run, I decided to swap out the “processing” message each time the progress bar was updating:

```
# Process text chunks with OpenAI API
    messages_to_display = [
        "Reading project document...",
        "Analyzing document structure...",
        "Extracting key topics...",
        "Identifying potential risks...",
        "Classifying risk levels...",
        "Preparing final report...",
    ]

    total_chunks = len(text_chunks)
    responses = []
    status_text = st.empty()
    progress_bar = st.progress(0)

    for i, text_chunk in enumerate(text_chunks):
        messages = [
            {'role': 'system', 'content': system_prompt},
            {'role': 'assistant', 'content': text_chunk},
        ]

        response = openai.ChatCompletion.create(
            model=openai_model,
            messages=messages,
            temperature=0,
            max_tokens=2000
        )

        risks = response['choices'][0]['message']['content'].split("EVENT:")
        risks = risks[1:]
        formatted_risks = ["EVENT:" + risk.strip() for risk in risks]
        responses += formatted_risks

        progress_bar.progress((i+1)/total_chunks)
        message_index = int((i+1)/total_chunks * len(messages_to_display))
        if message_index < len(messages_to_display):
            status_text.text(messages_to_display[message_index])

    status_text.text('Risk Register finalized.')
    progress_bar.empty()
```

Let’s see if GPT has a sense of humour, I asked it to rewrite the loading messages:

```
messages_to_display = [
    "Cracking open the project document like a cold one...",
    "Deciphering this document's structure...it's like a game of Jenga gone wrong!",
    "Doing a magic trick and pulling key topics out of a hat...",
    "Spotting potential risks...or as I call it, finding all the 'Oh no!' moments...",
    "Classifying risk levels...or as I like to say, sorting out the 'Oh no!' from the 'Heck no!'...",
    "Drafting the final report...hoping it won't end up as a door stopper...",
]
```

Meh, I think there is still some work to be done in the comedy department at OpenAI.

Let’s see what this looks like:

![](/media/2023/06/qwcaQnFZ@2x.png)

Done.

I am quite interested in how improving the system prompt can help to improve the quality of the risk assessments even further, especially if we provide a specific framework on how to think about risks.

I am also very interested in using GPT itself to further improve prompts, which is very meta.

The full code for the front-end app:

```
import streamlit as st
import openai
import PyPDF2
import pandas as pd
import io
import time
import base64

openai.api_key = 'Your API Key' #or put into the env variable
openai_model='gpt-3.5-turbo-16k' #or choose gpt-4-0613

# Define the function to extract text from a PDF file in chunks
def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    num_pages = len(pdf_reader.pages)
    text_chunks = []
    for page_num in range(num_pages):
        page = pdf_reader.pages[page_num]
        page_text = page.extract_text()
        words = page_text.split()
        for i in range(0, len(words), 4000):
            chunk = ' '.join(words[i:i+4000])
            text_chunks.append(chunk)
    return text_chunks

# Streamlit
st.title('🇺🇳 Automatic Risk Register Creation.')

# Upload PDF file
uploaded_file = st.file_uploader("Upload a project document to automatically create a risk register ", type=['pdf'])
if uploaded_file is not None:
    bytes_data = uploaded_file.read()

    # Create a BytesIO object
    bytes_io = io.BytesIO(bytes_data)

    # Extract the text chunks
    with st.spinner('Extracting text from PDF...'):
        text_chunks = extract_text_from_pdf(bytes_io)

    #System prompt

    system_prompt = '''
You are an AI model trained to identify potential risks in the context of UNDP projects. Your output helps to draft risk registers that are attached to project documents. Review the text and identify any risks based on the following aspects.

EVENT: A description of the risk event itself. Make sure to never label this as RISK: but always as EVENT:
CAUSE: The cause of the event.
IMPACTS: This is a description of the impact that this risk could have on the project, people, and environment.
IMPACT LEVEL: Severity of the consequences, rate on a scale of 1 to 5 and only return the number.
LIKELIHOOD LEVEL: Probability of the event occurring, rate on a scale of 1 to 5 and only return the number.
SIGNIFICANCE LEVEL: This is based on a multiplication of the impact level and likelihood level, to get a number between 1—25. Only return the number, do not show your calculation.
RISK TREATMENT: Potential strategies for managing the risk. This is a description of mitigation and contingency measures to both reduce the likelihood of the risk happening, and how to reduce the impact if the risk does happen.
CATEGORY: Please categorise the risk into only one of the following categories: 1.1. Human rights 1.2. Gender equality and women’s empowerment 1.3. Grievances (Accountability to stakeholders) 1.4. Biodiversity conservation and sustainable natural resource management 1.5. Climate change and disaster risks 1.6. Community health, safety and security 1.7. Cultural heritage 1.8. Displacement and resettlement 1.9. Indigenous peoples 1.10. Labour and working conditions 1.11. Pollution prevention and resource efficiency 1.12. Stakeholder engagement 1.13. Sexual exploitation and abuse 2.1. Cost recovery 2.2. Value for money 2.3. Corruption and fraud 2.4. Fluctuation in credit rate, market, currency 2.5. Delivery 2.6. Budget availability and cash flow 3.1. Responsiveness to audit and evaluations (Delays in the conduct of and implementation of recommendations) 3.2. Leadership and management 3.3. Flexibility and opportunity management 3.4. Reporting and communication 3.5. Partners’ engagement 3.6. Transition and exit strategy 3.7. Occupational safety, health and well-being 3.8. Capacities of the partners 4.1. Governance 4.2. Execution capacity 4.3. Implementation arrangements 4.4. Accountability 4.5. Monitoring and oversight 4.6. Knowledge management 4.7. Human Resources 4.8. Internal control 4.9. Procurement 5.1. Public opinion and media 5.2. Engagement with private sector partnership 5.3. Code of conduct and ethics 5.4. Communications 5.5. Stakeholder management 5.6. Exposure to entities involved in money laundering and terrorism financing 6.1. Changes in the regulatory framework within the country of operation 6.2. Changes in the international regulatory framework affecting the whole organization 6.3. Deviation from UNDP internal rules and regulations 7.1. Alignment with UNDP strategic priorities 7.2. UN system coordination and reform 7.3. Stakeholder relations and partnerships 7.4. Competition 7.5. Government commitment 7.6. Change/turnover in government 7.7. Alignment with national priorities 7.8. Innovating, piloting, experimenting 8.1. Armed conflict 8.2. Political instability 8.3. Terrorism 8.4. Crime 8.5. Civil unrest 8.6. Natural hazards 8.7. Manmade hazards 8.8. Cyber security and threats

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

To further clarify, here is an example response:

Example:
Consider a UNDP project aiming to construct a new dam in a region prone to frequent landslides. Identify the risks associated with this project based on the given aspects and provide the risks in the specified format.

EVENT: Landslide damaging the dam
CAUSE: Frequent landslides in the region
IMPACTS: Damage to the dam structure compromising its integrity, potential flooding leading to loss of property and displacement of communities, project delays resulting in increased costs and missed deadlines
IMPACT LEVEL: 4
LIKELIHOOD LEVEL: 3
SIGNIFICANCE LEVEL: 12
RISK TREATMENT: Conduct a thorough geotechnical investigation, implement landslide mitigation measures such as slope stabilization and drainage systems, consider alternative locations with lower landslide risks, and design the dam to withstand potential landslides through reinforced structural elements.
CATEGORY: 1.1. Human rights

YOU MUST insert a line break before and after this to separate the different risks.

If you do not detect any risks, just reply with:

NO RISK DETECTED
'''

    # Process text chunks with OpenAI API
    messages_to_display = [
        "Reading project document...",
        "Analyzing document structure...",
        "Extracting key topics...",
        "Identifying potential risks...",
        "Classifying risk levels...",
        "Preparing final report...",
    ]

    total_chunks = len(text_chunks)
    responses = []
    status_text = st.empty()
    progress_bar = st.progress(0)

    for i, text_chunk in enumerate(text_chunks):
        messages = [
            {'role': 'system', 'content': system_prompt},
            {'role': 'assistant', 'content': text_chunk},
        ]

        response = openai.ChatCompletion.create(
            model=openai_model,
            messages=messages,
            temperature=0,
            max_tokens=2000
        )

        risks = response['choices'][0]['message']['content'].split("EVENT:")
        risks = risks[1:]
        formatted_risks = ["EVENT:" + risk.strip() for risk in risks]
        responses += formatted_risks

        progress_bar.progress((i+1)/total_chunks)
        message_index = int((i+1)/total_chunks * len(messages_to_display))
        if message_index < len(messages_to_display):
            status_text.text(messages_to_display[message_index])

    status_text.text('Risk Register finalized.')
    progress_bar.empty()

    # Create DataFrame
    # st.write("Creating Excel File...")
    events = []
    causes = []
    impact_texts = []
    impact_levels = []
    likelihood_levels = []
    significance_levels = []
    risk_treatments = []
    categories = []

    for entry in responses:
        if entry.strip() == "NO RISK DETECTED":
            continue
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

    # Convert DataFrame to Excel and let the user download it
    towrite = io.BytesIO()
    downloaded_file = df.to_excel(towrite, encoding='utf-8', index=False, header=True)
    towrite.seek(0)
    b64 = base64.b64encode(towrite.read()).decode()
    st.markdown(f'<a href="data:application/octet-stream;base64,{b64}" download="risk_registers.xlsx">Download Risk Register</a>', unsafe_allow_html=True)
```
