---
title: "Extracting Metadata from UNDP Public Audit Disclosures (v2)."
date: 2023-10-01T22:01:37Z
categories: [artificial-intelligence, essays, united-nations]
---

This work builds on the [initial discussion I had on this.](/extracting-metadata-from-undp-public-audit-disclosures/)

We extracted basic Metadata using a Python script, GPT4, and my own [LLMtext2excel library.](/llmtext2excel/)

But now we want to go further than this, because the metadata we had extracted previously is already available in the [UNDP public audit disclosure site](https://audit-public-disclosure.undp.org/). So we are not adding any value — yet.

Now we want to extract all the issues available in an audit report.

Let’s go back to basics, and simply try and submit an entire audit report to GPT4 via chat and ask it to list all the issues and see what we get.

This is the eventual data that we want to get:

-   Audit ID
-   Audit Conductor
-   Field Start Date
-   Field End Date
-   Field Work Total Days
-   Reason for Audit Ratings
-   Number of audit recommendations by priority rating
-   Issue
-   Issue Number
-   Issue Criteria
-   Issue Condition
-   Issue Cause
-   Issue Effect
-   Priority of Audit Recommendations
-   Management Action Plan
-   Estimate Completion Date

We are going to use a country office audit for [UNDP Dominican Republic.](https://audit-public-disclosure.undp.org/view_audit_rpt_2.cfm?audit_id=2599)

We will start by loading the text into ChatGPT, and we get the first error — there is too much text!

![](/media/2023/10/DdVoepqb@2x.png)

But that’s fine, I will use the fantastic MacGPT which uses the GPT4 API that has a much longer context limit (8k tokens).

The results are a mixed bag.

GPT4 did not, surprisingly, find the field work dates that are in the introduction of the document:

> The UNDP Office of Audit and Investigations (OAI) conducted an audit of UNDP Dominican Republic (the
> Office) from 17 to 28 April 2023.

Perhaps because we gave it too much information in one go. In my v1 attempt I knew that all the initial information I was looking for would be in the first two pages, and so I limited the input to the first 2,000 words of the report.

It did very well for the first two issues — but it only listed the first two issues, out of 5. With further prompting, it found issues 3 and 4, but not the remaining 5th issue.

The default response format was quite good, but of course, we could specify a specific format in the final output if we so wanted:

-   Issue 1: Outstanding Government Contributions to Local Office Costs (GLOC)
-   Issue Number: 1
-   Issue Criteria: The host governments are expected to contribute towards the local costs of Country Offices to ensure their financial sustainability and operational continuity.
-   Issue Condition: The outstanding GLOC balance accumulated since 2001 was $7,417,760.
-   Issue Cause: Not specified in the document.
-   Issue Effect: Not recovering GLOC in a timely manner may negatively impact the financial sustainability of the Office.
-   Priority of Audit Recommendations: Medium (Important)
-   Management Action Plan: The Office will continue meetings with official government counterparts, including the involvement of the Regional Bureau for Latin America and the Caribbean and the Permanent Mission of the Dominican Republic to the United Nations, to negotiate the payment of GLOC accumulated outstanding balance.
-   Estimate Completion Date: December 2023

I manually checked this, and it appears to be correct.

Let’s now try Claude V2 which has a 100k token context window, I think it may be significantly superior to GPT4 in this regard.

The initial question returned this:

-   NATURE OF AUDIT: Country Office
-   AUDITED UNIT: UNDP Dominican Republic
-   AUDITED PERIOD START: 2022/01/01
-   AUDITED PERIOD END: 2023/03/31
-   FIELD WORK START DATE: 2023/04/17
-   FIELD WORK END DATE: 2023/04/28
-   FIELD WORK TOTAL DAYS: 12
-   EXPENSES: $48,000,000
-   AUDIT RATING: Satisfactory/Some Improvement Needed
-   REASON FOR AUDIT RATING: The assessed governance arrangements, risk management practices and controls were generally established and functioning but need some improvement. Issues identified by the audit do not significantly affect the achievement of the objectives of the audited entity/area.

When I asked the question, “*How many key recommendations were there?*“, Claude V2 answered correctly:

> Based on my review of the audit report, there were 5 key recommendations made, all with a priority rating of Medium (Important).
>
> The 5 medium priority recommendations aim to improve:
>
> -   Efforts to collect outstanding government contributions (GLOC)
> -   Oversight of procurement activities and staff capacity
> -   Procurement planning
> -   Payment processes
> -   Travel management

When I asked for structured data back for this, for each key recommendation, I received an excellent response:

```
Absolutely, here are the details for each of the 5 key recommendations:

1. Issue: Outstanding Government Contributions to Local Office Costs (GLOC)

Issue Number: 1

Issue Criteria: Host governments expected to contribute to local office costs as per UNDP policies.

Issue Condition: Outstanding GLOC balance of $7.4 million accumulated since 2001. 2023 GLOC cash target is $393,878.

Issue Cause: Lack of timely recovery of GLOC from the government.

Issue Effect: Potential negative impact on financial sustainability of the Office.

Priority: Medium (Important)

Recommendation: Collect outstanding GLOC with support from Regional Bureau and Permanent Mission.

Management Action Plan: Continue meetings with government counterparts to negotiate payment of outstanding balance. Follow up on 2023 commitment for contribution.

Estimated Completion Date: December 2023

2. Issue: Lapses in procurement activities

Issue Number: 2

Issue Criteria: Efficient and timely procurement as per UNDP policies.

Issue Condition: Delays in various procurement processes. Insufficient procurement capacity.

Issue Cause: Limited capacity and oversight over procurement activities.

Issue Effect: Risk of delays in project implementation.

Priority: Medium (Important)

Recommendation: Improve oversight, implement standard processes and timeframes. Strengthen staff capacities.

Management Action Plan: Develop SOPs and flowcharts to improve processes. Training plan for staff.

Estimated Completion Date: October 2023

3. Issue: Weaknesses in procurement planning and requisitions

Issue Number: 3

Issue Criteria: Development of procurement plans and adequate requisitions as per UNDP policies.

Issue Condition: No project-level procurement plans. Incomplete information in requisitions.

Issue Cause: Lack of plans from partners, insufficient use of requisition checklists.

Issue Effect: Lack of value for money, risk of inefficiencies and delays.

Priority: Medium (Important)

Recommendation: Improve planning and requisitions.

Management Action Plan: Prioritize remaining plans for 2023-2024. Monitor planning process. Improve requisitions.

Estimated Completion Date: August 2023

4. Issue: Inadequate payment processes

Issue Number: 4

Issue Criteria: Review of payment requests as per UNDP policies.

Issue Condition: Lack of delivery evidence, delays in processing, missing signatures.

Issue Cause: Lack of oversight over payment processes.

Issue Effect: Risk of unauthorized payments, business disruption.

Priority: Medium (Important)

Recommendation: Strengthen oversight of payments. Provide training on processes.

Management Action Plan: Centralize voucher review. Monitor process. Conduct training.

Estimated Completion Date: August 2023

5. Issue: Weaknesses in travel management

Issue Number: 5

Issue Criteria: Adequate travel documentation as per UNDP policies.

Issue Condition: Incorrect entitlement calculations, outstanding claims, lack of LTA.

Issue Cause: Uneven distribution of work, lack of LTA process.

Issue Effect: Inefficiencies, loss of value, waste of resources.

Priority: Medium (Important)

Recommendation: Ensure adequate documentation. Reassess roles. Conduct LTA procurement.

Management Action Plan: Review and adjust travel processes. Appoint dedicated staff. Initiate LTA procurement.

Estimated Completion Date: December 2023
```

I then asked ClaudeV2 to do this again, but this time to not summarize but use the precise words in the report.

This worked brilliantly!

<figure><img src="/media/2023/10/EmYEF964@2x.png" alt="" width="750" height="240" loading="lazy"><figcaption>Claude V2</figcaption></figure>

The original report:

<figure><img src="/media/2023/10/Ng0hGqmi@2x.png" alt="" width="750" height="220" loading="lazy"><figcaption>Original Audit Report</figcaption></figure>

And so this is extremely promising.

Now let’s try again and use only one prompt, including the entire audit report.

> You are a UNDP Audit Report analysis expert. Review this audit report and identify the key recommendations. Figure out the amount of recommendations and the names of each recommendation as you review. For each recommendation, provide the following information, but do not summarize or use your own words, but take them directly from the audit report that has been provided for context. Give it in this format
>
> Issue: {Issue Name}
> Issue Number {Issue Number}
> Issue Condition: {Issue Condition Text}
> Issue Cause: {Issue Cause}
> Issue Effect: {Issue Effect}
> Priority: {Priority Level}
> Recommendation: {Recommendation Text}
> Management Action Plan: {Management Action Plan}
> Estimated Completion Date: {Estimated Completion Date}

And this gave us exactly what we wanted:

```
Based on my review of the audit report, here are the key recommendations:

Issue: Outstanding Government Contributions to Local Office Costs (GLOC)
Issue Number: 1
Issue Condition: As of 31 December 2022, the outstanding GLOC balance accumulated since 2001 was $7,417,760. The 2023 GLOC cash target was $393,878.
Issue Cause: The Office had made several efforts to recover GLOC by sending formal letters and exchanging communications with relevant ministries.
Issue Effect: Not recovering GLOC in a timely manner may negatively impact the financial sustainability of the Office.
Priority: Medium (Important)
Recommendation: With the support of the Regional Bureau for Latin America and the Caribbean and the Permanent Mission of the Dominican Republic to the United Nations, the Office should collect GLOC, including the long-outstanding amounts.
Management Action Plan: The Office will continue the meetings with the official government counterparts, including the involvement of the Regional Bureau for Latin America and the Caribbean and the Permanent Mission of the Dominican Republic to the United Nations, to negotiate the payment of GLOC accumulated outstanding balance. For 2023, there was a commitment from relevant ministries to make a GLOC contribution. This payment would be extremely important to re-start yearly payments, while continuing the conversation with the Government on the accumulated balance from previous years.
Estimated Completion Date: December 2023

Issue: Lapses in procurement activities
Issue Number: 2
Issue Condition: Delays in procurement processes; Insufficient procurement capacity
Issue Cause: Limited capacity of the Procurement Unit and insufficient oversight from senior management over procurement activities
Issue Effect: Delays in procurement processes increase the risk of delays in project implementation; Limited procurement capacity may result in inefficient and long procurement processes, which may hinder the Office's ability to achieve its programmatic objectives.
Priority: Medium (Important)
Recommendation: The Office should strengthen procurement activities by: (a) improving oversight and implementing standardized processes and timeframes to improve the effectiveness and efficiency of procurement processes; and (b) strengthening capacities of procurement staff, and of other relevant staff involved in procurement activities by establishing training requirements such as the CIPS in accordance with their functions and level of responsibilities.
Management Action Plan: The Office is conducting a review of all procurement processes, and the roles and functions of personnel and national counterparts involved. Actions to strengthen the implementation of standardized processes include: Development and dissemination of specific standard operating procedures (SOPs) and process flowcharts, in a participatory exercise with the procurement and programme staff involved, with the objective of achieving clarity in responsibilities, eliminating time lapses and improving quality in each stage of the processes; Development of SOPs, including formulation of a training plan identifying specific issues like training of the Evaluation Committees to reduce the time required for this process; Incorporation of sustainable procurement considerations strategically into procurement plans and actions. Programme staff involved in procurement processes have been instructed to take the CIPS training, to ensure each programme unit has at least two staff trained. In the Procurement Unit all personnel will take CIPS level 1 and at least two additional personnel will take CIPS level 2 certification. At least one member of the Contracts, Assets and Procurement Committee will take CIPS level 2.
Estimated Completion Date: October 2023

Issue: Weaknesses in procurement planning and creation of requisitions
Issue Number: 3
Issue Condition: Weak procurement planning; Incomplete information in requisitions
Issue Cause: Challenges in obtaining procurement plans from the implementing partners of projects under national implementation; Requisitioners were not utilizing the requisition checklists because they were not part of established procedures.
Issue Effect: Lack of procurement plans prevented the Office from achieving value for money and economies of scale, and increased the risks of inefficiencies and delays which can negatively impact the implementation of project activities; Insufficient or inadequate information in the requisitions could significantly increase procurement processing time as it necessitates additional communication between the procurement team and the requesting units, affecting the timely delivery of goods and services.
Priority: Medium (Important)
Recommendation: The Office should improve procurement planning and the preparation of requisitions by: (a) preparing procurement plans for all projects at or before the start of each year; and (b) enhancing its control mechanism to ensure that requisitions are in place and have the required information before their submission to the Procurement Unit.
Management Action Plan: (a) The Office has prioritized the development of the remaining 2023 and 2024 procurement plans by the end of July 2023. For future years, the Office will ensure that, for ongoing projects, the elaboration of the procurement plans for the following year occurs during the months of June-October (except for pre-electoral years, when procurement plans will cover two years). For new projects, the Office will ensure that procurement plans are established as a pre-requisite for the projects approval at the project appraisal stage and follow-ups will be undertaken during project board meetings. This process will be monitored by senior management in coordination with the procurement and planning, and monitoring & evaluation teams. (b) The Office will ensure that the checklist for requisitions is being used by the requesters and will develop the capacity to provide technical inputs. Training sessions for counterpart project staff and programme staff have been scheduled for July 2023 to further develop this area.
Estimated Completion Date: August 2023

Issue: Inadequate payment processes
Issue Number: 4
Issue Condition: In five instances, totalling $1.27 million, there was no evidence of delivery of the service or payment for goods. In 20 instances, totalling $4.07 million, the payments took more than 50 days after the invoice date to be processed. In 10 instances, the Direct Payment Request for payments processed by the Office, and the Funding Authorization and Certification of Expenditures (FACE) forms used by implementing partners to request and liquidate cash advances, were not signed by the respective programme officer.
Issue Cause: Lack of oversight over the payment processes.
Issue Effect: Inadequate reviews of voucher supporting documentation may result in loss of value and risk of unauthorized payments being processed. In addition, delays in payments to vendors may disrupt business continuity.
Priority: Medium (Important)
Recommendation: The Office should improve its payment processes by: (a) strengthening oversight and ensuring that payment vouchers have adequate supporting documentation, including evidence of delivery of goods and services, before payment are approved; and (b) providing training to relevant staff and responsible parties on payment processes and lead times, as well as voucher documentation.
Management Action Plan: The Office will take following actions: (a) In May 2023, the Office centralized, within the Finance Unit, the process of reviewing vouchers and supporting documents. The Office will closely monitor this process and will conduct spot checks to ensure consistency. (b) The Office will organize training sessions on adequate voucher documentation and support, both for programme units and for implementing partners for the second semester of 2023.
Estimated Completion Date: August 2023

Issue: Weaknesses in travel management
Issue Number: 5
Issue Condition: Weaknesses in the calculation of travel entitlements; Outstanding travel claims; Lack of a Long Term Agreement (LTA) with a travel agency
Issue Cause: The travel processor role was assigned to three individuals. However, approximately 88 percent of all travel transactions entered in the module were processed by only one of the three travel processors, who was responsible for liaising with the travel agent to authorize the issuance of travel tickets. The exceptions noted above were due to the uneven distribution of workload among the travel processors.
Issue Effect: Inadequate travel management may lead to operational inefficiencies, loss of value, and inefficient use of resources. When LTAs are not established, there is an increased risk that the Office will not achieve value for money.
Priority: Medium (Important)
Recommendation: The Office should enhance travel management by: (a) ensuring that official travel, including any personal deviation, is adequately documented and that the calculation of travel entitlements is accurate; (b) reassessing the current travel functions, roles, and workflows to ensure efficiency; and (c) conducting a procurement process to engage a travel service provider (LTA).
Management Action Plan: The Office will implement the following corrective actions: (a) The flowchart of the travel process has been reviewed and adjusted considering the established Quantum (enterprise resource planning system of UNDP) policies and procedures. Training has been carried out in the selfmanagement travel module within UNall. The Office has sent a communication to all personnel, including the SOPs and the flowchart, the roles and functions of the traveler, travel arranger and travel processor to staff. The implementation of these SOPs and guidelines will be evaluated monthly. (b) The Office has appointed a travel processor, responsible for all compliance work, and another as a backup. Both have been trained in the use of the travel module and in the role of travel processing. Their performance will be evaluated monthly. (c) The Office is preparing the launch of an Invitation to Bid process for the establishment of an LTA with travel agencies. The mechanism that is being implemented is being coordinated with the Office of the Resident Coordinator and other UN agencies that are interested in participating to support the Business Operation Strategy.
Estimated Completion Date: December 2023
```

## Getting Nuanced.

Okay, now we have to change the prompt to handle a few things. Firstly, we want to remove the initial text:

> Based on my review of the audit report, here are the key recommendations:

While that is very nice — it is simply going to get in the way of us trying to extract the data programmatically.

I will add the following:

You are a UNDP Audit Report analysis expert. Review this audit report and identify the key recommendations. As you review, figure out the number of recommendations and each recommendation’s name. For each recommendation, provide the following information, but do not summarize or use your own words, but take them directly from the audit report that has been provided for context. Give it in this format, **and do not provide any introductory remarks before providing the format.**

Interestingly, this did not actually work, but we can strip out any text we find before the first mention of “ISSUE:” and solve it that way when we are ready to pull the data programmatically.

The other key thing to solve is that we may need to handle multiple recommendations and management actions.

This is harder than it first sounds, and we also have to consider the data structure that we want to get out of this, because it will affect if we do a one-shot or a recursive approach.

By one shot, I mean that we try to process the entire document and get back everything we need within one response, while the recursive approach would be doing a chain-of-thought prompting.

So, we may ask to identify the number of named issues, and then create a loop where we get x number of separate responses, one per named issue. My feeling is that this is going to get us the best results because we will likely want to have one row in our final Excel per audit issue. So we will eventually go through all 2000+ audit reports and end up with around 10,000 rows in our Excel file.

This chain-of-thought prompting seems to work well in the ClaudeV2 interface:

![](/media/2023/10/KaorK6T3@2x.png)

The question is how to do this programmatically — because we have to make a new loop based on the response from the initial LLM request. I’ve also never worked with the ClaudeV2 API, so that should be interesting. Still, I do wonder from a cost perspective if GPT3.5 with the 16k context window would be more than enough, as a typical audit report is around 4,000 words, which could be anywhere between 5,000 to 6,000 tokens.

Okay — let’s code this.

To kick things off, I set up the necessary libraries and configurations. The `openai` library is the gateway to interacting with the GPT-3 model, while `os`, `tqdm`, and `text2excel` are crucial for file handling, progress tracking, and data exporting, respectively.

```
import openai
import os
from tqdm import tqdm
from text2excel import text2excel
```

The configurations below are essential for connecting to the GPT-3.5-16k model, specifying the audit report folder, and designating the output file name for the analyzed data.

```
openai.api_key = 'sk-...'
openai_model = 'gpt-3.5-turbo-16k'
folder_path = 'auditreports'
output_file_name = 'audit_results.xlsx'
```

Yes, I am hard coding the API key in my code 😉

*This isn’t a production release!*

I devised a straightforward function `read_input_text` to read the contents of each audit report file, paving the way for further analysis.

```
def read_input_text(input_file):
    with open(input_file, 'r') as file:
        text = file.read()
    return text
```

To pinpoint the various recommendations within each audit report, a function named `extract_recommendation_titles` was brought to life. It sifts through a chunk of text, fishing out the titles of audit recommendations.

```
def extract_recommendation_titles(text_chunk):
    messages = [
        {'role': 'system', 'content': 'TITLES OF AUDIT RECOMMENDATIONS: In this format: {title1} | {title2} | {title3}'},
        {'role': 'assistant', 'content': text_chunk},
    ]

    response = openai.ChatCompletion.create(
        model=openai_model,
        messages=messages,
        temperature=0,
        max_tokens=4000
    )

    response_text = response['choices'][0]['message']['content']
    titles = response_text.split(" | ")
    return titles
```

Once the recommendation titles are in the bag, it’s time to dig deeper. The `get_recommendation_details` function, armed with a more detailed prompt, beckons GPT-3 to fetch comprehensive information regarding each recommendation from the audit text.

```
def get_recommendation_details(title, text_chunk):
    detailed_prompt = f'''
    You are a UNDP Audit Report analysis expert. Review this audit report and for the recommendation "{title}" provide the following information, but do not summarize or use your own words, but take them directly from the audit report that has been provided for context. Give it in this format, and do not provide any introductory remarks before providing the format.

    Issue Name: {{IssueName}}
    Issue Name: {{IssueName}}
    Issue Number {{Issue Number}}
    Issue Condition: {{Issue Condition Text}}
    Issue Cause: {{Issue Cause}}
    Issue Effect: {{Issue Effect}}
    Priority: {{Priority Level}}
    Recommendation: {{Recommendation Text}}
    Management Action Plan: {{Management Action Plan}}
    Estimated Completion Date: {{Estimated Completion Date}}
    '''

    messages = [
        {'role': 'system', 'content': detailed_prompt},
        {'role': 'assistant', 'content': text_chunk},
    ]

    response = openai.ChatCompletion.create(
        model=openai_model,
        messages=messages,
        temperature=0,
        max_tokens=4000
    )

    response_text = response['choices'][0]['message']['content']
    text2excel(response_text, output_file_name)  # Use output_file_name instead of f'{title}.xlsx'

    return response_text
```

Avoiding concurrency for the sake of API limitations, a simple for-loop marches through each text file in the designated folder, ensuring a structured and sequential analysis.

```
for file in tqdm(text_files, desc="Processing files"):
    analyze_text_chunk(file)
```

With the script in motion, the journey from a heap of raw audit reports to a well-organized Excel file is well underway! Getting the crux of each recommendation is now an automated breeze. This venture not only underscores the potential of LLM in text analysis but also hints at the promising horizon in easing the cumbersome manual analysis of documents.

There are a few extra bits that I want to improve in the future, including passing the audit ID and the Recommendation title into LLMtext2excel to ensure that this is captured in the Excel file, but this will be relatively trivial.
