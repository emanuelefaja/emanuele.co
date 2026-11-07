---
title: "Thinking Through Blue Pricing."
date: 2022-09-08T09:00:56Z
categories: [blue, business, economics, essays, project-management, strategy, technology]
---

[Blue](https://blue.cc), my software-as-a-service project management company, has had the exact pricing since its inception four years ago.

Blue only has one package, which is $50/month for an entire organization, regardless of the number of users, projects, or storage space.

This is quite an unusual model, as almost all of the other companies in this space operate on the per-user tiered model, with specific features only being available in the top tiers.

The only exceptions that I know of are ProoHub and Basecamp.

Proofhub currently offers two types of plans, one that is $45/month and has limits on the number of projects and storage, and one that is $89/month and has no limit on projects but does place a limit on storage space.

Basecamp has a free plan called Basecamp Personal, which offers three projects, twenty users, and 1GB of storage.

Their paid offering is $99/month and offers unlimited everything and 500GB of storage space, which is a lot of storage space for a small/medium organization.

As with most of my thinking around Blue and what we do, I decided to go back and think about our customers and how we can best serve them.

From speaking to customers, I understand that we can place any customer into the following buckets:

-   Micro Market — These are either solopreneur based in developed markets such as the North American Continent, Europe, Singapore, and Australia, or small companies in developing markets in Asia, Africa, and Latin America.
-   SME Market — These are well-established companies that may have up to 150 staff and have revenues in the millions. They often use Blue instead of tools such as Salesforce, and save tens or hundreds of thousands of dollars in license fees and implementation efforts.
-   Enterprise Market — These are organisations that have thousands of staff. We’ve had a few customers that have purchased an informal Blue package, up to $16,000 one-off payment for support and some feature modifications.

And so, the current issue with the pricing is that this hits an uncomfortable middle ground that does not make anyone particularly happy.

For the Micro Market, $50 is very expensive, especially if they are solopreneurs. So, these types of companies either pay us $0 (i.e. they do not sign up due to the price), or they have historically taken advantage of one of our LTDs (Life Time Deals) that we have run through third-parties like AppSumo or marketing agencies that we have hired.

While LTDs are great at getting us volume in terms of absolute customer numbers, they essentially do nothing to move the needle on key business metrics such as MRR (Monthly Recurring Revenue), so this does not work out particularly well for Blue itself.

The $50/month pricing does work exceptionally well for SMEs. They would often consider implementing systems that would take months to implement and be a considerable headache to manage. Instead, they can get set up the same day with Blue and have a significant amount of abstraction. They don’t have to worry about servers, database maintenance, security, uptime, etc.

But, this does not work that well for Blue — we’re leaving thousands of dollars on the table for each deal, as these companies could afford to pay a few thousand per year without any trouble or hesitation.

Finally, the Enterprise Market is something that we have traditionally ignored and have had some opportunistic engagements based on requests from organizations that wanted to scale their use of Blue. We’re still missing key features such as SSO (Single Sign On), Enterprise Key Management (essentially, bring your own encryption key for the data stored in Blue), and also the ability for regular, scheduled backups of data to an external location, and far more gradual audit and access control settings. This is expensive to develop and maintain and is an investment that we could only make if there is enough volume and demand from this segment.

And so, I started thinking of how we can create a pricing structure that benefits our customers and Blue as an organization.

How do we create a true win-win situation, and how do we also solve a few additional points?

The ideal situation is that we want to keep the whole idea of “unlimited” across users, projects, and file storage. One thing that we are missing right now is the ability to offer unlimited workspaces (i.e. companies) because one subscription is tied to one company. Surprisingly, this is often a request we receive from the Micro Market more than anyone else because often they have multiple small organizations that an owner is running vs one large company.

Finally, we also want to create our growth vector. Right now, the only way to grow our MRR is to grow our customer base month-on-month. Our goal is 25% growth per month, which we have been hitting, but it would be fantastic to have a second vector of growth, where we grow the amount each customer spends with us each month.

And so, the obvious consideration is to switch to some type of value pricing vs the fixed price that we have now. But, I still wanted to keep Blue affordable because that is one of core philosophies and the main reason I started Blue in the first place! I got sick of paying $1,000+/month for Asana for [Mäd](https://mad.co).

The idea of value pricing is an interesting one. Essentially, one charges customers based on the perceived value of what it is that you are selling, and in the case so software-as-a-service, the price then tracks some specific metrics (such as the number of users or features available) to showcase how much value a particular customer is getting from the software.

The most popular module in our industry is several different tiers with different sets of features, and each tier has a different price per user. The issue I have with this is that it dramatically increases the complexity of maintaining and adding new features to the platform because each feature needs to have specific access control depending on the customer’s tier. Often different features work together and so the testing is quite complex.

We have a relatively small engineering team, certainly not into the dozens or hundreds of engineers like our competitors, so this type of complex multi-tier and feature strategy is a non-starter for us.

Additionally, I don’t like the per-user strategy because that is what almost everyone else is doing, and I’ve always been somewhat of a contrarian regarding business practices. It also makes the comparison more straightforward, which I think Blue would come worse off because we do not have as many features as many of the multi-billion dollar competition we face.

And so, this is the tentative pricing scheme that I am considering:

For Micro Market, we will only charge $1/project, enabling us to lift the 1 Company/workspace restriction that we currently have with the subscriptions. We checked the statistics on our 6,000+ customers; only 27 companies had more than fifty active projects. Interestingly, there was one organization that had 340 projects!

This plan would save quite a bit of money for most existing customers. And for the Micro customers that simply cannot afford $50/month, they can still use Blue and have five to ten active projects and just pay a few dollars per month.

This does then bring up the question of what to do with historical projects that are not active because we do want Blue to be a single-source-of-truth, and the per-project fees may encourage users to delete projects once they are finished, which is not a good idea in case you need to reference something back in the future. Our idea is very much inspired by AWS (Amazon Web Services) and how they have different types of storage in their S3 (Simple Storage Service) product based on how quickly/frequently you need to access this data.

We take full advantage of this, and we automatically move the data that we store in S3 on AWS to cheaper and slower storage once it has not been accessed for a certain period. Our fees for hosting this data reduce by 90%.

In the same spirit, archived projects in Blue would only cost $0.1/month instead of $1/month, so a 90% reduction in fees.

I expect that 80% of our customers will be using this plan, and I would not be against considering having this as our *only* plan, with just some paid add-ons in the future.

So, let’s move on to thinking about an offer for the SME market. The main pain point here is that Blue is leaving lots of money on the table for each deal; I don’t believe there are many pain points from the customer side. But, that said, if we make more money with each deal, we can reinvest more back into the platform, and that does benefit everyone, so I think overall interests are aligned.

And, because we are saving the SME market so much money compared to other offerings such as Salesforce, I believe an increase in pricing would not materially affect them, and they can always switch to the $1/project plan if required.

So, what is the difference between the Micro Market plan and the SME offering?

The first thing is the price. The SME offering would be $150/month, so getting close to the $2,000/year amount, is a sweet spot in terms of having the sales team speak to customers and onboard them personally. There is enough money in the deal for that to be worth it, while at the current $500/year mark, this does not make sense, as the cost of acquiring a customer would be greater than what they pay us.

The second is that this plan would offer unlimited projects.

The third is that this plan would come bundled with our white label feature, which allows organizations to use a custom domain with Blue and have the entire platform branded with their logo and remove any mention of Blue. This is important for many use cases, especially Blue as a client portal. We may add specific additional features to this plan in the future. While this may seem to go against what I was discussing earlier with regards to feature tiers, this will be done in a significantly different approach.

I don’t want Micro Market customers to have as an experience because every other feature they click on contains an upsell to a bigger plan. Asana is extremely guilty of this, and it is annoying as hell if you’re just trying to do your work.

The features we will keep for the SME segment will mostly be company-wide settings that do not affect the single user experience.

We will also offer deep-dive training and onboarding specialists for this segment, which will not be available on the $1/project plan. Our free 30-minute onboarding/training will still be available for all customers.

And finally, let’s discuss enterprise. This is likely to be an offering that will start at $1,500/month and have a variable component as well, and will include the ability to pay via wire transfer and have a dedicated account manager for the customer while also allowing for co-creation of new features and potentially prioritization of certain roadmap items. For very large enterprise customers, we may even consider splitting aside specific engineering resources to work on critical requests, as long as those as abstract enough to be useable by every other customer in Blue.

I’m pretty used to Enterprise sales, as this is the core of what Mäd does. Still, I do wonder if there is underlining friction between the needs of large organizations and those of a small or medium business, and if it is even possible to reconcile those effectively within one application.

Perhaps it is best to focus on small and medium-sized businesses only.

Let’s see.
