---
title: "Centralized vs Decentralized Systems v1."
date: 2022-05-26T14:01:00Z
categories: [business, decision-making, economics, essays, management, politics, productivity, simplicity, strategy, technology]
---

This is one of the key things to consider when designing or thinking through systems at scale. By “system” here I don’t just mean software systems, but any way of doing things that is standardized in an organization.

The key tension is that, of course, any central office wants to see global savings and optimizations, because they are aware of the larger picture. They can see the waste of each country or division doing things their own way and reinventing the wheel.

They can imagine a future state where you only need to solve a problem once, and it is solved for everyone in the organization across the globe.

But, this makes the key assumption that the problem will be solved well, and that the solution will be appropriate to many different teams across the world. This is not always the case. Something that works in New York City or London may not be appropriate in rural Cambodia, and vice-versa.

So the answer here is not total centralization, or total decentralization. It is more about being wise enough to know how much of each to apply. Which abstractions are worth making and will benefit everyone, and where does local custom and on-the-ground knowledge trump the highly paid consultants hired by the head office?

In today’s essays I draw from my experience of being part of the global digital transformation efforts at the United Nations Development Fund, as well as years of private sector work at [Mäd](https://www.mad.co) where I have seen this centralization vs decentralization debate happen over and over again. Finally, I also draw on my experience running [Bloo](https://bloo.io), where we have the ultimate degree of centralization. As a small team, we write software that is used by thousands of organizations across the world. We cannot make custom tweaks on a per-customer basis, so we need to think carefully about how flexible and configurable we want to make things to ensure that different use cases work well.

Clearly, total decentralization is not the answer. In some cases, this would mean not having organizations at all, and everyone in the world acting as individuals. The reason we do have companies and organizations is that the benefits of having them outweigh the costs of running them.

The key benefit to an organization is that they do not have a set lifespan. There is a construction company called Kongo Gumi in Japan that has been operating continuously since 578AD which is 1,444 years at the time of writing. This is around 48 human generations.

The other key thing is that organizations allow individuals to specialize, without having to worry about everything else. So for instance, a software developer in a Software-as-a-Service company “just” needs to turn up to the office, open his computer, and focus on their work. They don’t need to worry about the cleaning of the office, the maintenance contract for the air-conditioning, the sales team quotas, the marketing strategy, or anything else. This has been abstracted away, and others are themselves specializing in those things and will know next to nothing about software development.

This is the thing about good or great management, is that it often becomes invisible because problems are not solved, because things are running smoothly in the first place.

And I think this point gets to the heart of the matter with regards to our centralization vs decentralization debate. The centralization efforts need to somehow just disappear in the background, to allow each division or country operation to work on their specialization with the minimum of overhead.

Let’s take a corporate issue that is not typically debated. If you work at a global company under the same brand, you will use the same email system. The company as a whole does not allow each office to run its own domain and have a completely separate email system, with some offices running things on the cloud and some running it in-house, and so on. This is because email is deemed to be something that just needs to work, and it is clearly a head office’s responsibility to ensure that a functioning email system is running and reliable. If they are smart, they will then push that to the next degree of centralization by allowing a company, such as Google or Microsoft, to run the email system on their behalf, so this reaches a new level of abstraction and centralization. So we have three potential approaches:

1.  **Complete Decentralization —** each office runs its own email and domains, no guidance on how this works.
2.  **Internal Centralization —** Head office runs the email system themselves. This may be hosted at head office, or they provide Standard Operating Procedures on how to host the email at each location. One domain is used across the entire organization.
3.  **External Centralization —** While head office is still responsible for email and one domain is used, they hand over the day-to-day management to a cloud company, which also happens to run the email systems for thousands or millions of other organizations.

With each step, an individual office loses control of the level of customization that they can apply to the email system. But, they swap this for better uptime, and the world’s best engineers at email are then working on the email system at companies that specialize in this.

As you scale the number of “nodes” in an organization (so offices or divisions), the case for centralization gets stronger and stronger. If you get to the point of the UN system, with around 600 offices worldwide, then anything that is not solved at a central level will need to be solved separately 600 times, likely with varying levels of quality.

So, in theory, one could put 600 times more resources towards a central solution than a local solution, but this is in reality never needed. The only problem is if one creates a central solution that is too stiff, and does not work well for local environments.

Then you run into an issue where local solutions are built regardless, or you get lackluster adoption of the central solution because it does not seem to apply to the use cases of the people who are doing the work on the ground. There are techniques to avoid this, such as human-centered design, but even those techniques cannot avoid the sometimes inevitable clash when two different offices need to do things differently.

What’s the solution at that point?

-   Have one office change its ways. This is often easier said than done, especially in industries with a high degree of regulation, where there can be legal constraints in one country and do not exist in another.
-   Build two separate versions of the system, but then you are going to run into complexities maintaining these systems, especially if they keep diverging in the future. Once a local office has seen that they can get their own way, they are likely to push for more local customizations that benefit them, often citing regulations or the same reasoning that caused the system to be split off in the first place.
-   Create a configurable system that allows offices to change parts of the system to better suit themselves, without a head office having to be involved.

This last solution is often called Configuration over Customization, and it can be a very good strategy.

It is more work up front, to ensure that the right set of configurations are built, and it does require a significant understanding of the local environments, but it does have some great benefits.

You keep the overall efficiency of having one system to manage vs multiple. This is especially important in large organizations with a significant number of localized entities.

It allows local entities to customize the system to some degree, but it creates a level of friction in accepting that customization is required. This means that it helps prioritize roadmaps because one local customization will impact the scope of work for the entire global organization. This means that high-priority items are likely to be prioritized over smaller and more menial requests.

Finally, the changes that are made into configurations for one or a set of local offices can then be used by other offices that encounter a similar set of requirements in the future. This helps to future-proof the system and ensure that all requests have an impact at scale.

There’s a lot more that can be said on this topic, but I think this is a good initial mind dump of what I have been thinking lately!

[I continued this line of thinking in a v2.](/centralized-vs-decentralized-systems-v2/)
