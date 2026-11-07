---
title: "Extracting Metadata from UNDP Public Audit Disclosures (v1)."
date: 2023-06-18T18:47:31Z
categories: [artificial-intelligence, united-nations]
---

UNDP has a [public portal that shows all Internal Audit Reports issued since 1 December 2012](https://audit-public-disclosure.undp.org/).

There is a requirement to automatically extract more metadata from all of these reports to improve overall reporting, create pattern analysis, and more.

So what do we need to extract? There are certain metadata that can be extracted directly from the Executive Summary.

-   Nature of the Audit: Country Office/Headquarters/Global Fund
-   Audited unit
-   Audited period
-   Field work dates
-   Expenses
-   Audit Rating
-   Reason for the Audit Rating
-   Number of audit recommendations by priority rating

The easiest way to test this out is to copy a few executive summaries into ChatGPT and then ask it to extract the following information and see if this is accurate or not.

Let’s start with [an audit report of UNDP Burkina Faso](https://audit-public-disclosure.undp.org/view_audit_rpt_2.cfm?audit_id=2626), which has a “Major Improvement Needed” result.

The first issue: I am not able to copy and paste from the PDF for some reason, although it does not appear to be a scanned PDF. Nevermind, we can extract all the text with the same methodology that we used for detecting UNDP High Risk Projects.

Here is the executive summary:

> Report on the Audit of UNDP Burkina Faso
> Executive Summary
>
> The UNDP Office of Audit and Investigations (OAIl) conducted an audit of UNDP Burkina Faso (the Office)
> from 6 February to 17 February 2023. The audit aimed to assess the adequacy and effectiveness of the
> governance, risk management and control processes relating to the following areas and sub-areas:
>
> (a) Governance
>
> (b) Development activities
>
> (c) Operations procurement, finance, human resources, administrative services, information
> communication and technology (ICT)
>
> The audit covered the activities of the Office from 1 July 2021 to 31 December 2022. The Office recorded
> programme and management expenses of approximately $31.43 million. The last audit of the Office was
> conducted by OAI in 2019.
>
> The audit was conducted in conformance with the /nternational Standards for the Professional Practice of
> Internal Auditing of The Institute of Internal Auditors (The IIA).
>
> Overall audit rating
>
> OAI issued an audit rating for the Office of partially satisfactory/major improvement needed, which
> means The assessed governance arrangements, risk management practices and controls were
> established and functioning, but need major improvement. Issues identified by the audit could significantly
> affect the achievement of the objectives of the audited entity/area. The rating is mainly due to
> weaknesses noted in the Offices structure and capacities, and programme monitoring and reporting.
>
> The audit team noted that the decentralization of programme activities through integrated project offices
> over the period 20202022 was effective in helping the Office implement the Sustaining Peace initiative.
>
> These findings have been incorporated in the overall auditing rating.
>
> Key recommendations Total = 5, high priority =O
>
> The audit did not result in any high (critical) priority recommendations. There are five medium (important)
> priority recommendations, which means Action is required to ensure that UNDP is not exposed to risks.
>
> Failure to take action could result in negative consequences for UNDP.
>
> The five recommendations aim to ensure the following:
>
> Recommendation No. Priority Rating
>
> Medium
>
> 1,4
> Achievement of the organizations strategic objectives
>
> Compliance with legislative mandates, regulations and 3 Medium
> rules, policies and procedures
>
> Audit Report No. 2626, 17 May 2023: UNDP Burkina Faso Page i
>
> United Nations Development Programme
> Office of Audit and Investigations
>
> Management comments and action plan
>
> The Resident Representative accepted all five recommendations and is in the process of implementing
> them. Comments and/or additional information provided have been incorporated in the report, where
> appropriate.
>
> Low risk issues (not included in this report) have been discussed directly with management and actions
> have been initiated to address them.
>
> Moncef Ghrib
> Officer-in-Charge
> Office of Audit and Investigations
>
> Audit Report No. 2626, 17 May 2023: UNDP Burkina Faso Page ii
>
> United Nations Development Programme
> Office of Audit and Investigations

And here is the output of ChatGPT:

![](/media/2023/06/1ohzH5NL@2x.png)

Which I manually checked and every point is correct.

This was with GPT-4, and it would be interesting to try the same thing with GPT-3.5 and see if we get equally good results. The reason for this is because GPT3.5 now has a 16,000 token context window, which is enough to feed an entire audit report in one go, so that could be quite interesting.

![](/media/2023/06/j9weIARS@2x.png)

This is also fully spot on, if slightly more verbose, but it does show that GPT-3.5 would be more than enough to handle this.

Now, the other key information is about each of the issues that are identified. We need:

-   Title of the issue (including area and sub-area)
-   Audit Observation
-   Audit Risk
-   Priority of Audit Recommendations
-   Audit Recommendations. 
-   Management Action Plan
-   Estimated completion date

So the methodology here seems quite clear.

1.  Extract the first set of data from the executive summary and return in a structured format. The Executive summary can be assumed to always be within the first 3-5 pages of the PDF document.
2.  Then, go through the document and extract a list of high and medium issues
3.  For each issue, then extract the second list of metadata. Initial tests show that getting the exact text vs a summary/paraphrase seems somewhat difficult. GPT4 does a better job that GPT3.5 in this regards.

## Step 1.

So I decide to take the first 2,000 words of each PDF document, as that is bound to include the executive summary.

I then ask for a structured response from the LLM:

```
system_prompt = '''You are a system to identify metadata in UNDP Audit Documents. Please find the following and response in this format:

NATURE OF AUDIT: Country Office/Headquarters/Global Fund
AUDITED UNIT:
AUDITED PERIOD START: The format of the response must be 'YYYY/MM/DD'
AUDITED PERIOD END: The format of the response must be 'YYYY/MM/DD'
FIELD WORK START DATE: The format of the response must be 'YYYY/MM/DD'
FIELD WORK END DATE: The format of the response must be 'YYYY/MM/DD'
EXPENSES: You must only return a number in $ (i.e. $77,555,322.34). Do not use any words!
AUDIT RATING:
REASON FOR AUDIT RATING:
NUMBER OF MEDIUM PRIORITY AUDIT RECOMMENDATIONS: Only reply with a number (i.e "3")
NUMBER OF HIGH PRIORITY AUDIT RECOMMENDATIONS: Only reply with a number (i.e "3")
TOTAL AUDIT RECOMMENDATIONS: This is the sum of the number of medium and high priority recomemendations. nly reply with a number (i.e "3")
TITLES OF AUDIT RECOMMENDATIONS: In this format: {title1} | {title2} | {title3}
'''
```

And I leverage my [own library text2excel](/llmtext2excel/) to take this and automatically convert it to excel.

The loop is rather simple:

```
# Get a list of all .txt files in the directory
text_files = [file for file in os.listdir(folder_path) if file.endswith('.txt')]

# Loop over the files with tqdm to display a progress bar
for file in tqdm(text_files, desc="Processing files"):
    input_file = os.path.join(folder_path, file)
    # Read the input text
    input_text = read_input_text(input_file)

    # Process the first 2000 words from the input text
    text_chunk = ' '.join(input_text.split()[:2000])  # Select the first 2000 words as context

    response = analyze_text_chunk(text_chunk, output_file_name)
```

And let’s check the output:

![](/media/2023/06/tfA4bBcj@2x.png)

And this is precisely the structure that we were looking, wonderful.

I’ll cover step 2 and 3 at a later date.
