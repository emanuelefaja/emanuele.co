---
permalink: false
eleventyExcludeFromCollections: true
title: "Automatic Detection of UNDP High-Risk Projects (v2)."
date: 2023-06-18T12:59:29Z
categories: [uncategorized]
modified: 2023-06-18T12:59:29Z
---

<!-- WordPress draft 3356 from emanuele.cc, imported 2026-11-16. Unpublished: 898 words. Excluded from the build by the front matter above. -->

This is a continuation of the thinking that I did when [I first started to consider how to automatically detect high-risk project at UNDP](/automatic-detection-of-undp-high-risk-projects/) and also [with regards to confidence score from LLMs.](/confidence-scores/)

So in my previous exploration, I just put an overview of the methodology together, and now it's all about trying to get this done in a concrete manner.

First step is to get the data. [The UNDP Transparency portal](https://open.undp.org) lists out all the projects at UNDP, and a colleague was kind enough to pass me an excel file of all the currently active projects.

This is structured like this:

<table><tbody><tr><td>Project Number</td><td>ProDoc URL</td></tr></tbody></table>

So this was quite straight-forward to create a script that downloaded all of this:

```
import os
import pandas as pd
import requests
from urllib.parse import urlparse
from tqdm import tqdm
import concurrent.futures

# Load the csv file
df = pd.read_csv('prodocs.csv', dtype={'project_num': str})

# Create a directory for the downloads, if it doesn't already exist
os.makedirs('downloads', exist_ok=True)

# Group the urls by the project number
grouped = df.groupby('project_num')

# Prepare the progress bar
pbar = tqdm(total=len(df), desc='Downloading files', ncols=75)

def download_file(data):
    name, group = data
    urls = group['document_url']
    index = 0  # We'll use this to count only the PDFs

    for url in urls:
        # Parse the url to get the file extension
        parsed_url = urlparse(url)
        extension = os.path.splitext(parsed_url.path)[1]

        # Check if the file is a .pdf
        if extension.lower() != '.pdf':
            print(f'Skipping non-PDF file {url}')
            pbar.update()  # Increment the progress bar even if we skip a file
            continue

        # Use the project number and the index as the file name, and append the extension
        filename = f'downloads/{name}_{chr(97 + index)}{extension}'

        # Check if the file already exists
        if os.path.exists(filename):
            print(f'File {filename} already exists, skipping download.')
            index += 1  # Increment the index and move on to the next file
            pbar.update()  # Increment the progress bar even if we skip a file
            continue

        # Send a GET request to the url
        response = requests.get(url)

        # Write the content of the response to a file
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f'Downloaded file {filename}')

        index += 1  # Only increment the index for PDFs
        pbar.update()  # Increment the progress bar when a file is downloaded
    return

with concurrent.futures.ThreadPoolExecutor() as executor:
    executor.map(download_file, list(grouped))

# Close the progress bar
pbar.close()
print('Download complete!')
```

There were a couple of hiccups, mostly around the fact that all of the project numbers started with two or three "zeros" (0) which I had to account for by passing the number as a string instead of a integer, otherwise those zeros would be lost. I also found that there were some links that contained non-PDF files types, so we automatically skipped these.

You can note that I also used the [parallelisation trick that I covered in speeding up LLMs](/increase-llm-speed/).

![](/media/2023/06/5ZtcqmqW@2x-1024x766.png)

This was quite fast, 6,094 items totalling around 24GB+ of data.

The next thing to do is to sort out the PDFs that are machine readable vs the ones that would require OCR (Optical Character Recognition). The OCR I will skip for the sake of this first practical exploration, and so I decided to write a separate script to do this sorting so my main script that will organise all the risks can be simpler.

The script to sort out the files that need OCR from those is quite simple:

```
import os
import shutil
import PyPDF2
from tqdm import tqdm

pdf_directory = './prodocs'
ocr_directory = './OCR'

if not os.path.exists(ocr_directory):
    os.makedirs(ocr_directory)

pdf_files = [f for f in os.listdir(pdf_directory) if f.endswith('.pdf')]

# Wrap your iterable with tqdm() for a progress bar
for filename in tqdm(pdf_files, desc="Processing PDFs", unit="file"):
    full_path = os.path.join(pdf_directory, filename)

    try:
        with open(full_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ''
            for page in range(len(reader.pages)):
                text += reader.pages[page].extract_text()

            if not text or len(set(text)) < 5:
                # If the PDF requires OCR, move it to the OCR directory
                shutil.move(full_path, os.path.join(ocr_directory, filename))

    except PyPDF2.errors.PdfReadError:
        print(f"PdfReadError: Skipping corrupted file: {filename}")
        continue  # Skip to the next file
```

This script tries to open each PDF, If it can't extract the text or if the extracted text has less than 5 distinct characters, it moves the file to the OCR directory.

This is the script in progress below, it takes a few seconds to process each PDF, which means the whole thing can be done in an hour two if I leave it running.

![](/media/2023/06/lb17vUi8@2x-1024x669.png)

Once this is done, we can then start with our main work of the risk detection of the PDFs that *are* machine readable.

For this, we're going to use an Azure OpenAI instance from UNDP instead of my personal account, because of the numbers involved.

This is actually quite straight-forward, everything is almost the same, with the exception that instead of just defining the API key, we need to add few more things:

```
import openai

openai.api_type = "azure"
openai.api_key = 'API KEY'
openai.api_base = 'URL'
openai.api_version = "yyyy-mm-dd"

#other code then:

response = openai.ChatCompletion.create(
        engine=openai_model,
        messages=messages,
        temperature=0,
        max_tokens=2000
    )

```

And also change "model" to "engine" in our API call. I found this slightly frustrating, because it means that Python scripts cannot be seamlessly executed between different versions of OpenAI (i.e. from OpenAI directly vs Azure). This feels like a very "Microsoft" thing to do.

While I am here and waiting for all this processing to finish, we can also briefly discuss what we can do with all these PDFs that *do* require OCR. We eventually do also want to process them, and we can do this quite easily. Let's make a little app that asks us for the name a PDF in that directory and then processes it using the pytesseract library, which is a wrapper for Google's Tesseract-OCR Engine.

```
from pdf2image import convert_from_path
import pytesseract
import os
from tqdm import tqdm
import concurrent.futures

# Set the tesseract path in the script
pytesseract.pytesseract.tesseract_cmd = r'/opt/homebrew/Cellar/tesseract/5.3.1/bin/tesseract'

# Prompt for the PDF filename
pdf_filename = input("Enter the name of the PDF file: ")
pdf_path = os.path.join(os.path.dirname(__file__), pdf_filename)

# Load your PDF
pages = convert_from_path(pdf_path, 500)

# Function to remove non-latin1 characters
def remove_nonlatin1(text):
    return text.encode('latin1', 'ignore').decode('latin1')

# Create a function to OCR a page and return the text
def ocr_page(page):
    text = pytesseract.image_to_string(page)
    text = remove_nonlatin1(text)
    return text

# Use a ThreadPoolExecutor to perform OCR on each page concurrently
with concurrent.futures.ThreadPoolExecutor() as executor:
    texts = list(tqdm(executor.map(ocr_page, pages), total=len(pages), desc="Processing pages"))

# Write the texts to a .txt file
with open("output.txt", 'w') as f:
    for text in texts:
        f.write(text + '\n\n')
```

We for sure would want to improve this if we do it at scale, but as an initial test the results are promising. This writes the output to a text file and this is what it looks like:

![](/media/2023/06/gEZNikrF@2x-1024x991.png)

And then converted to PDF:

![](/media/2023/06/kzhYOoM0@2x-1024x675.png)

So let's now focus on the main task, processing all the machine-readable PDFs and looking at the high risk criteria.

My system prompt for this is:

```
messages = [
        {'role': 'system', 'content': 'You are a risk analyzer assistant.'},
        {'role': 'user', 'content': chunk},
        {'role': 'system', 'content': 'Evaluate the 500 word chunk and see if any of the following risks are present:\n'
                                       '- Cash Transfer — Cash transfers to vulnerable people (i.e., cash for work, cash for food, cash to people after disasters, cash to beneficiaries to do/build something, etc.)\n'
                                       '- Displacement — Anything that requires displacement or forced eviction of populations\n'
                                       '- Construction — (incl. small scale infrastructure) for core services including water, sanitation, healthcare and education\n'
                                       '- Infrastructure — Large scale infrastructure, i.e., constructing bridges, airports, national roads of 4 or more lanes, dams\n'
                                       '- Oil & Gas Partnership — involving Oil & Gas industry – either with a private sector energy company, or with activities that relate to oil and/or gas (i.e., safer tanker in Yemen)\n'
                                       '\n'
                                       'Return the risks present along with a confidence score from 0-100 for each risk. For example, if Cash Transfer and Displacement risks are present with confidence scores of 80 and 90 respectively, your response should be: "Cash Transfer [80], Displacement [90]". '
                                       'Remember, your answer should ONLY be a comma-separated list of risks and scores and should not include any other analysis or text.'}
    ]
```

There is a clear method for returning the data in structured manner:

-   *Return the risks present along with a confidence score from 0-100 for each risk. For example, if Cash Transfer and Displacement risks are present with confidence scores of 80 and 90 respectively, your response should be: "Cash Transfer \[80\], Displacement \[90\]".*
-   *Remember, your answer should ONLY be a comma-separated list of risks and scores and should not include any other analysis or text.*

This ensures that we can then parse the data into our CSV file quite easily.

The next thing to consider is the OpenAI limits. I have a 120,000 tokens per minute as a limit, and so this needs to be factored in to ensure we stay below the limits. We can create a few definitions:

```
requests_per_minute_limit = 3500 #not used for now, but here for reference.
tokens_per_request = 800  #  Estimated tokens per request
max_tokens_per_minute = 120000  # Rate limit of tokens per minute
```

I am estimating that there are around 800 tokens per request and response, because we send across a 500 word chunk (up to 750 tokens) and then get back a pretty small response back.

Then I add in a delay to ensure we stay within the token limit:

```
# delay in seconds to respect the tokens per minute limit
    delay = tokens_per_request / max_tokens_per_minute * 60
    time.sleep(delay)
```

Now that this covered, the next thing to discuss is calculating and processing the confidence score. You can see in the prompt above that I ask the LLM to provide a confidence score, [and this is something that I did a write up before as well](/confidence-scores/).

Let's cover it again for the sake of being complete.

Let's calculate a quantitative score. This is essentially how many times the risk shows up in a document.

-   `Ri` as the risk category `i`.
-   `Ci` as the count of chunks in which risk `Ri` appears.
-   `N` as the total number of chunks the document was divided into.

The frequency `Fi` of each risk category `Ri` is calculated as:

```
Fi = Ci / N
```

This formula results in a score between 0 and 1 for each risk category `Ri`, which represents the proportion of the document in which that risk is mentioned.

For example, if a document is broken into 10 chunks (`N = 10`), and a risk category such as “Cash Transfer” appears in 3 of those chunks (`Ccash_transfer = 3`), the frequency score for “Cash Transfer” would be calculated as:

```
Fcash_transfer = Ccash_transfer / N
Fcash_transfer = 3 / 10
Fcash_transfer = 0.3
```

This means that the “Cash Transfer” risk was mentioned in 30% of the document.

And so this is how we calculate the quantitative risk.

For qualitative risk, this is where the LLM itself provides a confidence score as per our above promt.

Then we put both together using a weighted average approach.

1.  Assign a confidence score (between 0 and 100) to each identified risk based on qualitative analysis (as above)
2.  Calculate the average confidence score for the qualitative risk analysis by summing up the individual scores and dividing by the number of risks.
3.  Determine the weight to assign to the qualitative risk analysis and the quantitative confidence score. These weights represent the relative importance or reliability we want to place on each factor.
4.  Multiply the average confidence score from qualitative analysis by its weight, and multiply the quantitative confidence score by its weight.
5.  Sum up the weighted scores obtained in step 4 to calculate the combined confidence score.

For example, let’s say we assign a weight of 0.6 to the qualitative risk analysis and a weight of 0.4 to the quantitative confidence score. If the average confidence score from qualitative analysis is 80, and the quantitative confidence score is 90, the calculation would be as follows:

Combined confidence score = (0.6 \* 80) + (0.4 \* 90) = 48 + 36 = 84

In this example, the combined confidence score would be 84.

However, I don't think we need to get our code to actually do the weighted scoring, because the final output is a CSV file, which we can easily open in Excel and then do custom weights very easily with a formula. So if we just output the quantitative score and qualitative confidence scores, we then give the ultimate flexibility to the end user to define the weights at a later date.

This is how we can go about doing this:

```
def analyze_chunk(chunk):
    messages = [
        {'role': 'system', 'content': 'You are a risk analyzer assistant.'},
        {'role': 'user', 'content': chunk},
        {'role': 'system', 'content': 'Evaluate the 500 word chunk and see if any of the following risks are present:\n'
                                       '- Cash Transfer — Cash transfers to vulnerable people (i.e., cash for work, cash for food, cash to people after disasters, cash to beneficiaries to do/build something, etc.)\n'
                                       '- Displacement — Anything that requires displacement or forced eviction of populations\n'
                                       '- Construction — (incl. small scale infrastructure) for core services including water, sanitation, healthcare and education\n'
                                       '- Infrastructure — Large scale infrastructure, i.e., constructing bridges, airports, national roads of 4 or more lanes, dams\n'
                                       '- Oil & Gas Partnership — involving Oil & Gas industry – either with a private sector energy company, or with activities that relate to oil and/or gas (i.e., safer tanker in Yemen)\n'
                                       '\n'
                                       'Return the risks present along with a confidence score from 0-100 for each risk. For example, if Cash Transfer and Displacement risks are present with confidence scores of 80 and 90 respectively, your response should be: "Cash Transfer [80], Displacement [90]". '
                                       'Remember, your answer should ONLY be a comma-separated list of risks and scores and should not include any other analysis or text.'}
    ]
    response = openai.ChatCompletion.create(
        engine=openai_model,
        messages=messages,
        temperature=0,
        max_tokens=2000
    )

    # delay in seconds to respect the tokens per minute limit
    delay = tokens_per_request / max_tokens_per_minute * 60
    time.sleep(delay)

    result = response.choices[0].message.content.strip().split(',')
    risk_scores = {risk: [0, 0] for risk in risks}  # [frequency, total model confidence]

    for res in result:
        for risk in risks:
            if risk in res:
                risk_scores[risk][0] += 1
                risk_scores[risk][1] += int(res.split('[')[1].split(']')[0])  # Extract model confidence score

    return risk_scores
```

So we have made a lot of progress!

We have collected and downloaded all the Prodocs, and sorted them between machine readable and those requiring OCR. We've got a handle on how to prompt the LLM to define the risk and return structured data back, now we just need to parse it!

The key components are:

**Parsing the response**: The response from the OpenAI model is parsed in the `analyze_chunk()` function, which extracts the risks and associated confidence scores. This function is called within our main processing loop:

```
for chunk in progress_bar: risk_scores = analyze_chunk(chunk) ...
```

**Aggregating the data**: As each chunk is processed, the function updates a dictionary (`risk_presence`) with the frequency of each risk and the total of the confidence scores. This is done in the following lines:

```
for risk in risks:
    risk_presence[risk][0] += risk_scores[risk][0]  # Update frequency
    risk_presence[risk][1] += risk_scores[risk][1]  # Update total model confidence
```

**Calculating final scores**: After all chunks have been processed, the script calculates the average confidence score for each risk. This corresponds to the qualitative risk score in our methodology:

```
for risk in risks:
    if risk_presence[risk][0] > 0:  # To avoid division by zero
        risk_presence[risk][1] /= risk_presence[risk][0]  # Calculate average confidence
```

**Writing to the CSV file**: The code then creates a new row with the data for the current document, appends this row to a DataFrame (`df_existing`), and writes the updated DataFrame to a CSV file:

```
row = [project_number] + [value for risk in risks for value in risk_presence[risk]] + [status]  # Flatten the values
df_existing = df_existing.append(pd.DataFrame([row], columns=df_existing.columns), ignore_index=True)

# Write the updated DataFrame to the CSV file
df_existing.to_csv('risk_analysis.csv', mode='w', index=False)
```

This approach ensures that each document's data is written to the CSV file as soon as it's processed, which can be helpful if the script is interrupted or crashes, as it prevents loss of all data.

And this leads us to an entire conversation around the tracking of the status. I doubt that I will have this script run continuously to process thousands of PDF files, and so this means that we need a way to keep track of progress and status for each PDF file.

The way we do this is using our CSV file, we create a "Status" column that marks each PDF as unprocessed and then marks it as processed once the risks have been calculated. Each time the script is run, it checks the PDFs in our folder against the list in our CSV file to ensure that we are not processing the same PDF more than once. We can also handle corrupted PDFs in the same manner. If the PDF document can't be read because of a `PdfReadError`, the status is set to 'Corrupted'.
