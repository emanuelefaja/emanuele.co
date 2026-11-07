---
title: "Automating Risk Registers at UNDP (v3)."
date: 2023-06-18T07:15:21Z
categories: [artificial-intelligence, united-nations]
---

This is a follow on from my previous two explorations on automating risk registers at UNDP. Here’s [V1](/automating-risk-registers-at-undp-v1/) and here’s [V2](/automating-risk-registers-at-undp-v2/).

At the end of V1, I wrote that there were five major improvement areas to look at:

1.  Handling chunks that do not contain risks.
2.  Automating the pipeline from GPT response to Excel, without the intermediary text file.
3.  Creating a simple web frontend where a user can drop a PDF, have it processed, and then download the corresponding excel file.
4.  Improving the prompt to be more specific about the type of risks, or perhaps generally providing more information about the risks.
5.  Providing GPT context and information about the risks already found in the document from previous chunks, so we do not get repetition in the risks as each chunk is processed.

In V2, I covered improvements 1, 2, and 3, and so we are left with the final two improvements, but I also want to add an additional improvement: *speed*.

My initial code took quite a while to process one project document, to the tune of 4-5 minutes per document with GPT-4. [I wrote up my abstract tests on parallelisation of LLM prompts](/increase-llm-speed/), which resulted in an 8-fold improvement in processing time, and it would be interesting to see if that benchmark hold in this project as well.

So the improvements we will focus on today:

1.  **Improving Speed —** How can we significantly speed up the processing time for each project document?
2.  **Improving Quality —** Can the prompt to be more specific about the type of risks, or perhaps generally providing more information about the risks?

For providing more context and information about the risks already found in the document from previous chunks, I’ll leave that for another day!

## 1\. Improving Speed.

Firstly, let’s run the process on a 21-page project document from UNDP Iraq, and see how long it takes to process with GPT-4.

To start, I need to track the time the entire script takes to run. This is quite easily done with the following code:

```
# Record the start time before the processing
start_time = time.time()

[The processing code goes here]

# Record the end time
end_time = time.time()

# Calculate and print the total processing time
total_time = end_time - start_time
print(f"\nTotal processing time: {total_time} seconds")
```

As a reminder, right now we are breaking up the text into individual pages, and then running of risk analysis on each page, one at a time.

![](/media/2023/06/NzRh5oje@2x.png)

So this took **531.7511432170868** seconds, or almost 9 minutes.

We can then run the exact same analysis, but this enabling parallelisation, which just takes a few lines of code:

```
import concurrent.futures

# Parallelize API calls using concurrent.futures
with concurrent.futures.ThreadPoolExecutor() as executor:
    futures = {executor.submit(analyze_text_chunk, text_chunk): text_chunk for text_chunk in text_chunks}
    for future in tqdm(concurrent.futures.as_completed(futures), total=len(futures), desc="Processing text chunks"):
        responses.append(future.result())
```

Let’s run this and see what happens:

![](/media/2023/06/azPX5RgI@2x.png)

We managed to cut the total processing time to just shy of 1 minute. So this is around 9x faster than before. I am sure that this could be speeded up even more if I had more processors on my computer (I have 8 currently) and so I could run even more threads at the same time.

And as we can see, that is a huge improvements in processing time, and so we can consider this as done. I can then easily port this improvement to the version that includes a front-end to make it easy for users to use the application.

So I can consider this as done. Waiting less than 1 minute for a risk analysis of an entire project document I believe is more than acceptable.

## 2\. Improving Quality.

This is perhaps the most difficult improvement to make, because the quality of the risk register is subjective, and also because I am not an expert in the subject matter of risk.

However, there is an interesting paper[^1] that discussed that simply adding *“Let’s think step by step”* can dramatically improve output :

>  Experimental results demonstrate that our Zero-shot-CoT, using the same single prompt template, significantly outperforms zero-shot LLM performances on diverse benchmark reasoning tasks including arithmetics (MultiArith, GSM8K, AQUA-RAT, SVAMP), symbolic reasoning (Last Letter, Coin Flip), and other logical reasoning tasks (Date Understanding, Tracking Shuffled Objects), without any hand-crafted few-shot examples, e.g. increasing the accuracy on MultiArith from 17.7% to 78.7% and GSM8K from 10.4% to 40.7% with large InstructGPT model (text-davinci-002), as well as similar magnitudes of improvements with another off-the-shelf large model, 540B parameter PaLM. The versatility of this single prompt across very diverse reasoning tasks hints at untapped and understudied fundamental zero-shot capabilities of LLMs, suggesting high-level, multi-task broad cognitive capabilities may be extracted by simple prompting.

Seems promising right? Let’s add this to our prompt and see what happens.

I will just edit these four, and I’ve bolded my changes:

```
EVENT: A detailed description of the risk event itself. Make sure to never label this as RISK: but always as EVENT:
CAUSE: Think step by step and describe, in detail, the cause of the event.
IMPACTS: Think step by step and create a highly detailed description of the impact that this risk could have on the project, people, and environment.
RISK TREATMENT: Think step by step and provide a paragraph of detailed strategies for managing the risk. This is a description and step-by-step logic of mitigation and contingency measures to both reduce the likelihood of the risk happening, and how to reduce the impact if the risk does happen.
```

So I have added 32 words to a prompt which is now 942 words long, so Ive added around 3% to the original prompt. It is interesting to see how much this actually changes the quality of the output.

Notably, I have not changed my example to showcase the level of detail, I wonder if that will somewhat nullify the additional instructions in the prompt.

Let’s run it and see!

I also realize that it would be good to have somewhat to objectively evaluate a risk assessment, and this could be an interesting additional program that could read the original prodoc, and then run an evaluation, then we could compare the results of the prompt changes. Anyway, I am getting ahead of myself. For now, let’s just simply do a manual review of quality.

So I ran this twice, both times with GPT-4, once with the original prompt we had and once with the modified “step-by-step” prompt.

Both identified “Deterioration of the security situation” as a risk, which makes sense as this was a project in Iraq in 2006, when operational security was clearly a risk. Interestingly, both scored Impact at 4 and Likelihood at 3, leading to a significant level of 12.

Let’s take the original one first:

**EVENT:** Deterioration of the security situation

**CAUSE:** Political instability, armed conflict, or civil unrest in the region

**IMPACTS:** Disruption of project activities, potential harm to project staff and local communities, delays in project implementation, increased costs due to security measures

**RISK TREATMENT:** Develop a comprehensive security plan, coordinate with local authorities and security forces, provide security training to staff, consider remote management strategies if necessary, and monitor the security situation closely.

And then our updated one:

**EVENT:** Deterioration of the security situation

**CAUSE:** Political instability, civil unrest, or armed conflict in the region

**IMPACTS:** The deterioration of the security situation can lead to project delays or complete halt, endangering the safety of the project staff, and potentially leading to damage or destruction of project infrastructure. This could result in failure to achieve the project’s objectives of increasing access to potable water and sanitation services, negatively impacting the health and well-being of the local population.

**RISK TREATMENT:** Develop a comprehensive security plan that includes measures such as regular risk assessments, security training for staff, coordination with local authorities and security forces, and contingency plans for evacuation or project suspension if necessary. Regularly monitor the security situation and adjust plans as needed.

Here’s a nice idea, we can use GPT-4 to evaluate both results against each other. Let’s see what happens.

> Both versions have merits, but the updated one is generally stronger due to the following reasons:
>
> 1.  **Specificity**: The updated version provides more detailed and specific impacts of the event. By explicitly stating the project’s objectives (increasing access to potable water and sanitation services), it underscores the real-world implications of the risk event. This level of detail can help stakeholders better understand the gravity of the situation.
> 2.  **Clarity**: The updated version is clearer and more organized. The language and sentence structure make it easier to understand the potential risks and risk treatments.
> 3.  **Comprehensive risk treatment**: The updated version provides a more comprehensive approach to risk treatment, including regular risk assessments and contingency plans. These additions demonstrate a more proactive and systemic approach to risk management.
> 4.  **Dynamic response**: The updated version emphasizes the importance of regular monitoring and adjustments to the plan, showing the need for a dynamic and responsive approach to the changing security situation.
>
> In summary, while the original is solid, the updated version provides more detail, is easier to understand, and offers a more comprehensive and dynamic risk treatment plan. These features can help stakeholders better grasp the risks and the necessary mitigation measures.

And I generally agree with this assessment. So adding 32 words to the prompt has made some noticeable increase in quality, but I don’t think we should stop there!

Let’s improve our example in our prompt to align with our new more detailed output:

```
Example:
Consider a UNDP project aiming to construct a new dam in an area characterized by frequent landslides. This project's primary objective is to provide a reliable water supply for agricultural irrigation, thus ensuring food security for the region.

EVENT: Landslide potentially damaging the dam
CAUSE: The region's geological instability makes it prone to frequent landslides, exacerbated by climate patterns and potential deforestation in the area.
IMPACTS: A landslide could cause severe damage to the dam, compromising its structural integrity. Such an event could potentially cause catastrophic flooding, leading to the loss of life and property, and displacing local communities. Moreover, it could disrupt the dam's primary function as a water supply for agricultural purposes, threatening food security in the region. The project timeline may also suffer significant delays, increasing costs due to required reparations and additional preventive measures.
IMPACT LEVEL: 4
LIKELIHOOD LEVEL: 3
SIGNIFICANCE LEVEL: 12
RISK TREATMENT: To mitigate these risks, conduct a thorough geotechnical investigation to understand the region's geological profile better. Implement landslide mitigation measures such as slope stabilization, afforestation, and proper drainage systems. Consider alternative locations with lower landslide risks if viable. Ensure the dam's design includes reinforced structural elements to withstand potential landslides. Develop contingency plans in case of severe landslides, including evacuation strategies and emergency response protocols.
CATEGORY: 1.1. Human rights
```

This will surely help our output better align with our expectations.

There is also an interesting paper[^2] which discusses Chain-of-Thought Prompting, which essentially provides examples of clear chain of thinking, essentially extending the concept of step by step thinking. This shows extremely promising results:

> We show how such reasoning abilities emerge naturally in sufficiently large language models via a simple method called chain of thought prompting, where a few chain of thought demonstrations are provided as exemplars in prompting. Experiments on three large language models show that chain of thought prompting improves performance on a range of arithmetic, commonsense, and symbolic reasoning tasks. The empirical gains can be striking. For instance, prompting a 540B-parameter language model with just eight chain of thought exemplars achieves state of the art accuracy on the GSM8K benchmark of math word problems, surpassing even finetuned GPT-3 with a verifier.

And we can see the improvements visually:

![](/media/2023/06/jnpQtfmk@2x.png)

*Comparison of models on the GSM8K benchmark (Wei et al.)*

Significantly, Wei et al. affirm that “CoT only yields performance gains when used with models of ∼100B parameters”. It was observed that smaller models produced irrational sequences of ideas, subsequently resulting in reduced accuracy compared to conventional prompting. The enhancement in performance attributable to CoT prompting typically corresponds to the model’s size. However, this should not cause any issues if we use GPT-4, and it would be interesting to see the results with GPT-3.5, and we can also assume that any issues we may encounter will be quickly overcome as the technology is advancing at such a rapid pace.

I won’t try to implement CoT at this time, but it is an extremely interesting approach, which would likely require the system prompt to be split into multiple smaller prompts that feed into each other.

There is also another interesting method that requires us to run the same query multiple times and then using the difference results (as LLMs will never quite return the same answer, especially if we turn the temperature setting up).

![](/media/2023/06/DfZmld2i@2x.png)

This would probably not be useful for the descriptions themselves, but for the weighted scoring or confidence levels in other similar related tasks, this could be hugely useful.

Another obvious source of improvements is to reread the [UNDP Enterprise Risk Management (ERM) Policy and Procedures](https://popp.undp.org/_layouts/15/WopiFrame.aspx?sourcedoc=/UNDP_POPP_DOCUMENT_LIBRARY/Public/AC_Accountability_Enterprise%20Risk%20Management%20Policy.docx&action=default) and put more of the thinking that has been done in writing this policy into our prompt.

The policy document has a great definition of risk assessment that we could leverage:

> Risk assessment is the iterative process of risk identification, analysis, and evaluation. The objective is to provide sufficient information at appropriate intervals for risk-informed management decisions. High quality risk assessments enable greater acceptance of risk-taking opportunities (e.g. innovation) while ensuring rigorous due diligence, treatment, monitoring and control.

There is also a suggestion:

> Potential risks across the ERM risk categories (see Appendix 2) should be considered to ensure that all relevant risks are identified.

That perhaps hint that we are doing things the wrong way round. Our current program identifies the risks and then tries to categorize them, but perhaps we should be scanning for risks *based* on the categories. This would mean starting with the categories and looking for risks that belong to those categories. I wonder if this would generate a substantially larger amount of overall risks?

And there is also a lot more information with regards to risk treatment, that we could perhaps “templatize”:

> For each High, Substantial or Moderate level risk one or more risk treatment measures must be identified.
>
> In case of threats to organizational objectives, risk treatment may be of four types: terminate (seeking to eliminate activity that triggers such a risk), transfer (passing ownership and/or liability to a third party), mitigate (reducing the likelihood and/or impact of the risk below the threshold of acceptability), and tolerate (tolerating the risk level).
>
> In case of opportunities, risk treatment may be of four types: exploit (making the opportunity happen), experiment (testing new solutions in uncertain contexts), enhance (enhance the likelihood or impact through reinforcing the trigger condition or increasing exposure), and accept (no proactive actions).

So let’s give a shot at improving our prompt based on this. The easiest things I see is simply adding the risk treatment categorise for threats to organisational objectives:

In case of threats to organizational objectives, risk treatment may be of four types: terminate (seeking to eliminate activity that triggers such a risk), transfer (passing ownership and/or liability to a third party), mitigate (reducing the likelihood and/or impact of the risk below the threshold of acceptability), and tolerate (tolerating the risk level). **Please clearly specify which type we are dealing with and your step-by-step reasoning.**

I added the bold part to provide further clarity. Let’s see if we can notice a difference on the risk treatment section based on this.

Let’s review our original improvement:

**RISK TREATMENT:** Develop a comprehensive security plan that includes measures such as regular risk assessments, security training for staff, coordination with local authorities and security forces, and contingency plans for evacuation or project suspension if necessary. Regularly monitor the security situation and adjust plans as needed.

And this is the new version:

**RISK TREATMENT:** To mitigate this risk, it is crucial to closely monitor the security situation in the region and develop contingency plans to ensure the safety of project staff and local communities. This could include measures such as security training for staff, establishing secure project sites, and developing evacuation plans. If the security situation deteriorates significantly, it may be necessary to temporarily suspend project activities until it is safe to resume. In the long term, efforts should be made to engage with local communities and authorities to promote peace and stability in the region.

While the second version is for sure a bit longer (92 words vs 44 words), that does not automatically mean that it is better, but overall I feel that there is a slight improvement here.

What is interesting is that if we take this final output and then further prompt it simply:

> *Can you break this down into detailed step-by-step instructions*.

We get this:

1.  **Monitor the Security Situation**: Implement a system for constant surveillance of the security situation in the region. This could involve a combination of on-the-ground reports, liaising with local authorities, and consulting security advisories from relevant national and international agencies.
2.  **Develop Contingency Plans**: Create a detailed action plan for various scenarios that may arise due to security deterioration. These plans should prioritize the safety of project staff and local communities.
3.  **Implement Security Training**: Arrange for comprehensive security training for all project staff. This training should cover possible security threats, ways to mitigate them, and steps to take in case of a security breach or deterioration.
4.  **Establish Secure Project Sites**: Review the physical security of project sites and implement necessary measures to ensure their security. This could include measures such as perimeter fencing, access controls, surveillance systems, and security personnel.
5.  **Develop Evacuation Plans**: For each project site, prepare a detailed evacuation plan for scenarios where immediate departure is necessary. The plan should include safe routes, modes of transportation, assembly points, and potential safe locations for temporary relocation.
6.  **Monitor and Adapt**: Continue to monitor the security situation. If the situation worsens significantly, be ready to execute the contingency and evacuation plans, and even suspend project activities until it’s safe to resume.
7.  **Engage with Local Communities and Authorities**: Build strong relationships with local communities and authorities. This engagement should focus on promoting mutual understanding, addressing potential grievances, and collaborating on peace and stability initiatives.
8.  **Promote Peace and Stability**: In the long term, invest in initiatives that aim to promote peace and stability in the region. This might include supporting local community projects, participating in conflict resolution efforts, or contributing to development projects that address root causes of the instability.

And then a further prompt:

> Can you go one level deeper and provide lots of detail and guidance, providing a format such as :
>
> 1\. Monitor the Security Situation:
> 1.1 \[next subpoint\] — description of subpoint
> 1.2 \[next subpoint\] — description of subpoint
> 2\. Develop Contingency Plans:
> 2.1 \[next subpoint\] — description of subpoint
> 2.2 \[next subpoint\] — description of subpoint

We get this:

1.  **Monitor the Security Situation**

    -   **Set up a Monitoring System** — Establish a security monitoring system that can provide real-time updates about the situation in the region. This could involve technology like surveillance cameras or tracking software, as well as personal accounts from local contacts or staff members.
    -   **Establish Communication with Local Authorities** — Maintain open lines of communication with local law enforcement and other relevant authorities. They can provide valuable insights and early warnings about potential threats.

    -   **Consult Security Advisories** — Regularly review travel and security advisories issued by national and international organizations. This can help you stay aware of any potential threats or issues.
2.  **Develop Contingency Plans**
    -   **Identify Potential Scenarios** — Identify a variety of scenarios that could occur if the security situation deteriorates. Consider everything from minor disruptions to major threats.
    -   **Create Action Plans** — For each identified scenario, create a detailed action plan. This should outline the steps to be taken, responsible personnel, necessary resources, and desired outcomes.
    -   **Practice Drills** — Regularly conduct drills to ensure staff are familiar with the contingency plans and can execute them effectively under stress.
3.  **Implement Security Training**
    -   **Identify Training Needs** — Assess the specific security training needs for your staff. This will depend on the nature of the threats in the region and the roles of your staff members.
    -   **Provide Training Programs** — Arrange for security training programs that meet these needs. These programs should be tailored to your specific context and might include training on conflict resolution, first aid, and emergency procedures.
    -   **Regularly Update and Refresh Training** — Security threats and best practices can evolve over time, so it’s important to update and refresh training regularly.
4.  **Establish Secure Project Sites**
    -   **Evaluate Existing Security Measures** — Conduct a comprehensive evaluation of the existing security measures at your project sites. Identify any potential weaknesses or gaps in security.
    -   **Implement Enhanced Security Measures** — Depending on the results of your evaluation, implement enhanced security measures. This might involve adding physical barriers, increasing security personnel, or introducing advanced surveillance systems.
    -   **Review and Adapt** — Regularly review the effectiveness of your security measures and adapt them as necessary. If a security breach occurs, conduct a thorough investigation to learn from the incident and prevent future breaches.
5.  **Develop Evacuation Plans**
    -   **Identify Safe Routes and Modes of Transportation** — Map out multiple safe evacuation routes from the project site to a designated safe location. Consider different modes of transportation and their availability and reliability under various circumstances.
    -   **Specify Assembly Points** — Designate safe assembly points for staff members to gather in the event of an evacuation. Ensure these points are easily accessible from different parts of the project site.
    -   **Communicate and Train** — Clearly communicate the evacuation plans to all staff members and conduct regular drills to ensure everyone knows what to do in case of an emergency.
6.  **Monitor and Adapt**
    -   **Continual Surveillance** — Continue to monitor the security situation in real-time. Use the information gathered to adjust your plans and actions as needed.
    -   **Contingency Plan Execution** — Be ready to execute the contingency and evacuation plans swiftly in response to changing circumstances.
    -   **Project Suspension Readiness** — Be prepared to suspend project activities temporarily if the security situation warrants it. Have a plan in place for how to secure project sites and assets during a suspension.
7.  **Engage with Local Communities and Authorities**
    -   **Community Engagement** — Build relationships with local communities through regular communication, community meetings, and involvement in local events. Understand their concerns and provide transparent information about the project.
    -   **Authority Liaison** — Establish regular contact with local authorities. Share information and collaborate on efforts to maintain security and peace in the region.
8.  **Promote Peace and Stability**
    -   **Support Local Projects** — Identify and support local community projects that contribute to peace and stability. This could involve funding, providing resources, or volunteering time and expertise.
    -   **Participate in Conflict Resolution** — If appropriate and possible, participate in conflict resolution efforts in the region. This could involve mediating disputes, facilitating discussions, or supporting reconciliation initiatives.
    -   **Contribute to Development Initiatives** — Consider how your project can contribute to broader development initiatives in the region. By addressing underlying issues such as poverty, inequality, or lack of resources, you can help promote long-term peace and stability.

Now we’re getting somewhere, this is really quite a lot of details and some decent recommendations, but then the open question is how do we get this result in one prompt instead of having to run it through several times.

And just to take this to an extreme level, we can try a further prompt!

> Can you do this again with even more granular detail and steps by steps, you can go into sub sub bullet points.

1.  **Monitor the Security Situation**
    -   **Set up a Monitoring System**
        -   **Define Monitoring Objectives** — Determine what specific security information you need to monitor. This could include local crime rates, political unrest, terrorist activities, etc.
        -   **Select Monitoring Tools** — Based on your objectives, choose suitable tools for monitoring. This might involve surveillance cameras, tracking software, local news sources, or social media monitoring.
        -   **Train Monitoring Staff** — Ensure your staff members understand how to use these tools effectively and know what to look out for.
    -   **Establish Communication with Local Authorities**
        -   **Identify Relevant Authorities** — Determine which local government and law enforcement agencies are relevant to your project’s security.
        -   **Establish Contact Points** — Set up regular meetings or communication channels with these authorities.
        -   **Maintain Regular Communication** — Keep up regular communication to stay updated on potential security issues.
    -   **Consult Security Advisories**
        -   **Identify Relevant Advisories** — Determine which national or international agencies issue security advisories relevant to your project.

And so on. I feel that perhaps this is getting into too much detail, but perhaps this may be useful, and it is for sure worth exploring how we can get this level of detail out of the initial prompt, and then we can always dial it back based on user feedback.

Let’s give the following a shot, without providing a specific example, but we can add that in later if required:

> RISK TREATMENT: Please provide an in-depth, step-by-step strategy to manage the identified risk. Each step should be broken down into its essential components and should describe the necessary actions, personnel involved, tools or systems required, and the expected outcomes. The strategy should focus on both reducing the likelihood of the risk occurring, as well as managing its impact if it does occur. Please consider four types of risk treatment: terminate (eliminating the activity that triggers such a risk), transfer (passing ownership and/or liability to a third party), mitigate (reducing the likelihood and/or impact of the risk below the threshold of acceptability), and tolerate (accepting the risk level). Please clearly specify which type of treatment is most appropriate for the identified risk, providing a detailed rationale and potential implications of the chosen treatment type.

And this also a slightly more granular risk treatment.

**RISK TREATMENT:** To mitigate this risk, the project should develop a comprehensive security plan that includes measures such as regular risk assessments, security training for staff, and coordination with local authorities and security forces. The project should also have contingency plans in place to ensure the continuity of operations in the event of a security incident. These plans could include alternative methods of service delivery, backup facilities, and emergency evacuation procedures. The project should also consider engaging with local communities and stakeholders to build trust and support for the project, which could help to reduce security risks.

It is clear that further improving the prompt and examples will significantly improve the output, and this is something that can be continuously improved upon based on expert feedback.

### References.

-   1

    [Large Language Models are Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916)

-   2

    [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)

[^1]: [Large Language Models are Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916)
[^2]: [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
