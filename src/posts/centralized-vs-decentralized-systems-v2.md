---
title: "Centralized vs Decentralized Systems v2."
date: 2022-06-10T21:40:00Z
categories: [business, economics, politics, productivity, short, strategy, technology]
---

This is a continuation of my thinking from [Centralized vs Decentralized Systems v1](/centralized-vs-decentralized-systems/), where I introduced the idea of the tension between high-level and “global” thinking at a head office level vs divisional and geographic-specific thinking.

We understood that there are three levels of centralization:

1.  Complete Decentralization.
2.  Internal Centralization.
3.  External Centralization.

I think that in my v1 discussion I made it seem like complete decentralization is a bad thing, but this is not always the case.

For instance, most people find it quite surprising how manual and paper-based electoral voting is. In a modern and fully functioning democracy, the process works approximately in the following manner:

Each local area has stations where people vote on a paper ballot in an anonymous manner, by dropping their ballot in a box. The boxes are kept constantly under watch by representatives of the major candidates, and then these are counted, again with the oversight of at least two different parties.

The results are tallied, and then these are sent over to the central counting office where they can make a tally of tallies, and then depending on the precise flavor of the election different types of scoring are made.

So this process is repeated across sometimes thousands of polling stations, and it probably does not seem very efficient. After all, on an initial overview it would seem trivial to create a web or mobile application where citizens can authenticate and drop their votes in, but this level of centralization actually raises a whole bunch of follow-on questions and issues.

It feels like electronic centralized voting should be something that is easily be happening by now, right. Blockchain should solve the problem? 😉

Well, in this case, not quite. Voting requires has two key requirements, which can sometimes feel that they are opposite:

1.  Voting needs to be anonymous. This is to stop bribery and threats of individuals who do not vote the right way or are under duress. There should be no way for anyone to know who you voted for. In the UK, they even go as far as to disqualify any ballots that have any identifiable information such as your name, signature, or phone number.
2.  Trust. For the country as a whole to accept the results of an election, and for there to be a peaceful transfer of power, everyone needs to agree that the results are accurate. We saw the issue that results that are contested had in 2020 in the USA.

Behind these requirements, is a master requirement that no single individual should be in a position of trust without oversight. Individuals can be incompetent, corrupted, threatened, and blackmailed.

The current method of paper voting does not 100% fulfill the above requirements, but attacks against the paper voting systems do not scale very well, because there is very little centralization. If you want to change a large number of votes, you need to have significantly more people involved in the process, which makes the attack easier to discover.

While if you attack a fully centralized system and are successful, you can easily change as many votes as you want.

This is just one example where having one centralized system managing everything is not a very good idea.

We can easily imagine other examples such as control systems for nuclear weapons (do we really want fully automatic and remotely triggered nuclear buttons?), key infrastructure such as electricity and oil pipelines, and so on.

But, unless your systems or organization has this level of critical requirements, you are likely not being effective if you have complete decentralization, so it is more effective to look at either internal or external decentralization.

On a practical level when discussing shipping software, which is what most organizations are now doing, as the process of every company becoming a software company is well underway, the key questions are whether to run one code base, and one set of infrastructure globally, or to split things up.

Should you have one application that everyone accesses, or should have country-level specific applications? Should you have one infrastructure setup, or should each country run its own infrastructure, perhaps independently?

The answer to these questions depends on your legal and regulatory environment, as well as the sophistication of your internal teams and vendors.

The ideal scenario, of course, is that head office almost runs a SaaS (Software-as-a-Service) platform and that this single platform is flexible enough to ensure that everyone has their individual needs met while ensuring a high level of standardization.

Then, plenty of resources can be thrown at this one platform vs splitting work across multiple platforms.

In a future v3, we will discuss a framework for evaluating *how* to make these choices.
