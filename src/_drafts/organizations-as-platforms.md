---
permalink: false
eleventyExcludeFromCollections: true
title: "Organizations as Platforms."
date: 2023-06-23T09:21:43Z
categories: [uncategorized]
modified: 2023-06-23T09:21:43Z
---

<!-- WordPress draft 3406 from emanuele.cc, imported 2026-11-16. Unpublished: 1549 words. Excluded from the build by the front matter above. -->

One major insight that I had in the past year is that the vast majority of individuals working in large organisations serve internal customers. That is, their primary focus is not helping the ultimate customer who consumes the information, goods, and services that the organisation creates, but rather assisting colleagues who do so.

It is surprisingly difficult to work with many individual in a large organisation, unless certain practices are followed. The optimal team size for effective work are surprisingly small \[mfn\] [The optimum team size that may be adopted in a collaborative learning of computer programming is four.](https://www.researchgate.net/publication/276498523_An_Empirical_Study_of_the_Optimum_Team_Size_Requirement_in_a_Collaborative_Computer_ProgrammingLearning_Environment)\[/mfn\] and innovation goes down as team size goes up. \[mfn\][Effects of relative team size on teams with innovative tasks: An understaffing theory perspective.](https://core.ac.uk/download/pdf/216479925.pdf) \[/mfn\]

However, we can't solve world hunger or build a spaceship with a team of five people — there's simply too much work that needs to get done. So what's the solve? How do we ensure that there are enough people to do the required work for an organisation to move towards its mission, without ending up stuck in the mud, trying to collaborate at scale?

**The answer is to turn our organisations into platforms.**

This sounds interesting, but what does that mean?

Well, let's start by getting a definition of a platform:

> A raised level surface on which people or things can stand.

Ok, bad joke. But there is actually something in this. That is the original definition.

There political meaning evolved as a metaphor from this.

> The declared policy of a political party or group.

So in politics, a platform refers to a set of principles, policies, or stances adopted by a party, candidate, or organisation. The metaphor comes from the idea of politicians or speakers standing on a physical platform, declaring their positions and rallying support.

So when it comes to the *platform* that we are talking about, we can start to gather definitions such as:

-   A product platform is a set of shared components, technology, or processes from which a range of products can be efficiently developed and launched. For example, a car platform used across models.
-   A technology platform is a foundation of tools and services that third-party developers can build upon. For example, iOS and Android as platforms for mobile apps.
-   A platform business model is one where value is created primarily by facilitating interactions between users and third-party contributors. For example, video game consoles, mobile app stores, and marketplaces like eBay.

And so I think we can take from the above to come with the concept of an organisational platform:

> An organisational platform is a foundation of shared standards, infrastructure, and interfaces that enable connections, interactions, and collaboration across teams.

Here are a few potential variations I came up with:

-   An organizational platform is an open, flexible foundation that facilitates alignment and cooperation between diverse groups. It provides a common ground for interaction and value creation through shared standards, tools, data, and processes.
-   An organizational platform is the infrastructure and set of guiding principles that enable effective working relationships, knowledge sharing, and collaboration across team boundaries. It strikes a balance between standardization and autonomy, allowing both efficiency and innovation to thrive.
-   An organizational platform is the ecosystem of technical, social, and organizational elements that support seamless partnerships and collective progress across a complex entity. By providing shared foundations for working together, it transforms bureaucracy into community and distances into proximity.

So, let's run with this and simplify further. I don't think we want to end up obsessed with definitions, but we do want very clear steps and principles on how to turn an organisation into a platform.

So let's look at some of the building blocks:

-   **It is foundational —** so the one thing that a "platform" is not is *optional.*
-   **The Standardisation & Autonomy Tension —** In any significantly large organisation, there are plenty of benefits to standardisation, but we also have to be careful not to take a cookie-cutter approach where we roll out the same solution to any problem, regardless of local context.
-   **Not just technology —** This is about standards, practices, and even culture.
-   **Clear benefits —** A platform must bring clear benefits such as reduce need for collaboration, self-service of information, and lower overall transaction costs.

So let's give this another shot:

**An organisational platform is a set of foundational standards, infrastructure, and interfaces that reduce complexity and transaction costs, while striking a clear balance between shared centralisation and autonomy.**

So I've categorised standards, infrastructure and interfaces as foundations, which means that they are not optional components that teams need to consider, but a critical part of their daily work.

Let's further add some further definitions:

-   **Standards —** this is the way we do things, described in writing. They are rules that describe the minimum acceptable levels that teams need to reach.
-   **Infrastructure —** These are the tools that we use. It can be physical tools, hardware, and software.
-   **Interfaces —** This is how different teams exchange information. Typically this will be via documented API (Application Programming Interfaces), not via calls or "knowing someone".

Let's give a simplified and hypothetical example for an armed police force:

-   **Standards:** Protocols defining when use of firearms is authorized (e.g. only in situations of imminent threat), why they may be discharged (e.g. to protect life), and how (e.g. aim for center mass, fire warning shot into the air first). These govern how and when police may deploy their weapons.
-   **Infrastructure:** Firearms issued to police officers such as pistols, shotguns, rifles, etc. The weapons provided as standard equipment represent key infrastructure. Ammunition, gun racks, storage lockers and other gear needed to manage weapons infrastructure.
-   **Interfaces:** Armory management systems to track which officer has been issued which specific firearm. This interface allows monitoring and reconciling inventory. Use of force reporting systems where officers log any incidents of weapon discharge or display. This interface generates statistics on firearm usage that can be analyzed to identify needs, gaps or trends. Networks linking armories to central police departments so weapon assignment and usage data can be accessed at an organizational level. These interfaces gather information from local stores or systems into central repositories for broader oversight and management.

Jeff Bezos, apparently, wrote an email back in 2001/2 that went:

> 1\. All teams will henceforth expose their data and functionality through service interfaces.
>
> 2\. Teams must communicate with each other through these interfaces.
>
> 3\. There will be no other form of interprocess communication allowed: no direct linking, no direct reads of another team’s data store, no shared-memory model, no back-doors whatsoever. The only communication allowed is via service interface calls over the network.
>
> 4\. It doesn’t matter what technology they use. HTTP, Corba, Pubsub, custom protocols — doesn’t matter.
>
> 5\. All service interfaces, without exception, must be designed from the ground up to be externalizable. That is to say, the team must plan and design to be able to expose the interface to developers in the outside world. No exceptions.
>
> 6\. Anyone who doesn’t do this will be fired

We can see why this is brilliant based on our above definitions. It clearly states what needs to be standardised (*"All service interfaces, without exception, must be designed from the ground up to be externalizable"*) and what teams have autonomy over (*"It doesn’t matter what technology they use. HTTP, Corba, Pubsub, custom protocols — doesn’t matter."*)

So what are some guiding first principles that we can extract from all this? How do we go from knowledge to action?

My thinking:

1.  Every team must have an interface for data and actions. Status and uptime must be tracked as well as usage must be published. The litmus test is that over teams can self-serve *without* speaking to anyone. Knowledge must default to open.
2.  Every team must have a published roadmap for improvements and release notes for historical changes.
3.  Every team must have clear metrics, service levels, and KPIs, with dashboard and instrumentation to track and showcase these externally. quote from [here](https://www.holistics.io/blog/how-amazon-measures/): Amazon divides metrics into two types: **controllable input metrics** and **output metrics**. This is more commonly known in the industry as [leading indicators and lagging indicators](https://www.holistics.io/blog/the-two-types-of-operating-indicators/), but Amazon likes to use their own language, because, erm, Bezos.
4.  The next step in the process is the customer.
5.  Create clarity. This means reduce acronyms, etc. Any complex topic can be simplified, I am strong believer in this!
6.  Centralize intelligently. At scale, central teams can get swamped with requests, with far more than they can handle. So centralization must scale seamlessly. For instance, UNDP has 170+ offices, a central team cannot review/approve requests on an individual basis, that would require an army of bureaucrats.
7.  Deal with root causes: Charlie Bell, an SVP in AWS: "when you encounter a problem, the probability you’re actually looking at the actual root cause of the problem in the initial 24 hours is pretty close to zero, because it turns out that behind every issue there’s a very interesting story."

## 1\. Every Team Must Have an Interface.

1\. Every Team Must Have an Interface.

We can take
