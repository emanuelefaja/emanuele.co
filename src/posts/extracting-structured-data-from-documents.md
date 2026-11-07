---
title: "Extracting Structured Data from Documents."
date: 2023-06-03T05:43:37Z
categories: [artificial-intelligence, business, productivity, short]
---

After I wrote [Automatic Detection of UNDP High-Risk Projects](/automatic-detection-of-undp-high-risk-projects/), I spent some time actually building a basic implementation of this using Python, and I was actually successful in getting a final structured file that highlighted the risks in a table format for each PDF in a folder. The cost was around $0.04 per document and it took around 1 minute of processing time, which is an incredible improvement over any type of manual review.

However, this made me consider if it possible to further generalize this methodology to make it apply to extracting structured data for any use case across any set of documents.

This would mean that we start at the end, the final result insight that we want to achieve, and work backwards to understand what steps are required to be able to achieve this.

The other important thing to understand is whether this methodology would only work for a final output which is binary (i.e. yes/no, positive/negative — i.e. “*is there any report of domestic violence in this document”)* or whether can ask for more nuance such as *“what type of violence is discussed in this document?”.*

The tricky part with non-binary answers is that we have to decide whether we will provide the LLM (Large Language Model) with a predefined set of categories to choose from, or whether it is free to create its own categorizations based on the data available. We have to get structured data back that we can easily parse and place into a datastore, so this is more difficult than it first appears.

But at a high level, I imagine a program that asks you about your criteria, perhaps gives you a few settings for each criteria, and then you upload your document and it will automatically parse through it and give you an excel file that has an analysis on your criteria for your set of documents. I can imagine this would be hugely useful for a significant number of uses cases in organisations that have thousands of documents that contain information, but where manual review is too time consuming and costly.
