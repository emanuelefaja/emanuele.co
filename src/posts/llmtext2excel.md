---
title: "LLMtext2excel."
date: 2023-06-18T17:51:58Z
categories: [artificial-intelligence, short]
---

I’ve written a small but extremely useful Python script to help take structured responses from LLMs (Large Language Models) and write them to an excel file.

This is a common use case when you want to use LLMs to go through lots of documents and then review the data in a spreadsheet later.

The issue I have encountered is that asking LLMs to output JSON is inherently unreliable, and I kept getting various errors because the JSON response was not stable.

Through trial an error, I found a workaround that seems to work 100% of the time, and this is to ask for a response in this format:

```
LABEL1: {instructions on format}
LABEL2: {instructions on format}
LABEL3: {instructions on format}
LABEL4: {instructions on format}
```

What this might look like in real life, as an example from trying to parse data from UNDP Audit documents:

```
NATURE OF AUDIT: Country Office/Headquarters/Global Fund
AUDITED UNIT:
AUDITED PERIOD START: The format of the response must be 'YYYY/MM/DD'
AUDITED PERIOD END: The format of the response must be 'YYYY/MM/DD'
FIELD WORK START DATE: The format of the response must be 'YYYY/MM/DD'
FIELD WORK END DATE: The format of the response must be 'YYYY/MM/DD'
EXPENSES: Only return a number in $ written out in full (i.e. $77,555,322.34) without any other words.
AUDIT RATING:
REASON FOR AUDIT RATING:
NUMBER OF MEDIUM PRIORITY AUDIT RECOMMENDATIONS: Only reply with a number (i.e "3")
NUMBER OF HIGH PRIORITY AUDIT RECOMMENDATIONS: Only reply with a number (i.e "3")
TOTAL AUDIT RECOMMENDATIONS: This is the sum of the number of medium and high priority recomemendations. nly reply with a number (i.e "3")
TITLES OF AUDIT RECOMMENDATIONS: In this format: {title1} | {title2} | {title3}
```

Where the response would be:

```
NATURE OF AUDIT: Country Office
AUDITED UNIT: UNDP Burkina Faso
AUDITED PERIOD START: 2021/07/01
AUDITED PERIOD END: 2022/12/31
FIELD WORK START DATE: 2023/02/06
FIELD WORK END DATE: 2023/02/17
EXPENSES: $31,430,000.00
AUDIT RATING: Partially satisfactory/major improvement needed
REASON FOR AUDIT RATING: The rating is mainly due to weaknesses noted in the Offices structure and capacities, and programme monitoring and reporting.
NUMBER OF MEDIUM PRIORITY AUDIT RECOMMENDATIONS: 5
NUMBER OF HIGH PRIORITY AUDIT RECOMMENDATIONS: 0
TOTAL AUDIT RECOMMENDATIONS: 5
TITLES OF AUDIT RECOMMENDATIONS: Strengthen programme administration, monitoring, and results reporting | Improve oversight and management of procurement processes | Enhance income generation | Strengthen implementation of DES | Update job descriptions of staff to ensure the achievement of objectives.
```

But then how to turn this into an excel file? And, more importantly, how to do so in a manner that doesn’t mean lots of code changes each time I change the prompt or data structure.

Ideally, we would have something that takes a text input with our format:

```
LABEL1: text1
LABEL2: text2
LABEL3: text3
```

And turns it into this:

<table><tbody><tr><td>LABEL1</td><td>LABEL2</td><td>LABEL3</td></tr><tr><td>text1</td><td>text2</td><td>text3</td></tr></tbody></table>

And when used again and again, it would detect that the header rows (i.e. LABEL1) were already in place, and then just write a new row with the new data. This means that we could use it in our loop as we process various documents, and then get some nicely structured data out.

And the beautiful thing? If you want to change the output, you just need to change the LLM prompt, there is no other code to change!

Here we go:

```
import pandas as pd
from openpyxl import load_workbook

def llmtext2excel(input_text, file_name):
    lines = input_text.strip().split('\n')
    data = {}
    for line in lines:
        label, text = line.split(': ', 1)  # Splits on first occurrence of ': '
        if label in data:
            data[label].append(text)
        else:
            data[label] = [text]

    new_df = pd.DataFrame(data)

    # if file doesn't exist, write the dataframe into a new file
    # else, append without writing the headers
    try:
        existing_df = pd.read_excel(file_name, engine='openpyxl')
        df = pd.concat([existing_df, new_df], ignore_index=True)
        df.to_excel(file_name, index=False, engine='openpyxl')

    except FileNotFoundError:
        new_df.to_excel(file_name, index=False, engine='openpyxl')
```

And this can be imported with:

```
from llmtext2excel import llmtext2excel
```

And then your main file just needs to define two things:

1.  The input text
2.  The file name for the excel file

And then call the function:

```
llmtext2excel(response_text, output_file_name)
```

And that’s that! We have a really neat and abstracted way to handle our LLM responses without any fuss, and we can change the structure any time simply be editing our prompt.
