---
title: "Fake Commercial Off-The-Shelf Software."
date: 2022-07-25T18:07:00Z
categories: [business, essays, technology]
---

There is this idea in enterprise software of commercial, off-the-shelf software. This is often abbreviated as COTS.

For example, my company [Blue](https://blue.cc) offers a COTS model called SaaS (Software-as-a-Service). You can visit the website, sign up, pay for the license, and start using the software. You don’t have to speak to anyone, get a sales agreement in place, or do any installation. This is great for the customer because they can immediately get value from the software. This is also great for the software vendor because we don’t have to work to get a new customer on board.

With Blue, we’ve onboarded over 6,000 customers this way, and we don’t have a single salesperson.

So COTS is normally:

-   Marketed as being ready-to-use without any major modifications.
-   There are many existing customers, so you are unlikely to run into any major bugs or issues with custom-build software, including long testing periods before going live with the solution.
-   There is the idea that you are paying for the software license vs. any direct fees for staff or contracts to build anything. This is good because many customers paying license fees means everyone benefits from a larger investment in the software versus building their own thing.

It often makes sense for large organizations or governments to buy a COTS, unless there is a compelling case that the specific needs are better suited by doing a custom-build software project.

The attraction to COTS product is clear: **if you have similar or the same needs as thousands of other organizations, and a well-known** **solution exist, why not just go ahead and use it?** Why rebuild the wheel? You can then focus time and effort on what makes your organization unique instead of trying to fight every single battle.

In some cases, COTS products are so well-known, and their feature set is so broad that it’s hard to see how a custom software solution could ever hope to compete. Microsoft Office and Google Workspace are probably the most well-known example of this. You don’t want to spend time building your own word processor or email system — so for most organizations, it just doesn’t make sense to try.

But in other cases, COTS products are not as well-known, and their feature set is much more narrow. In this situation, a custom software solution might be able to provide a better solution for an organization’s specific needs.

Understanding COTS products’ limits is important before committing to using one. Otherwise, you might find yourself in a situation where you need to customize the software to fit your needs, and then you are stuck with all the maintenance and upgrade fees that come along with it.

If you have specific needs that are not well-suited for a COTS product, you might be better off going with a custom solution.

But, life is not always so simple!

Software vendors know that the promise of COTS is great, so they tend to market all of their products in this way, regardless of the true mix of ready-made software and custom implementation required to provide a specific product and achieve a set of goals.

So the reality is that many COTS products are not really “off-the-shelf” at all, but you may not discover that until it is too late: the contract has been signed, and the initial payments have been made.

Then there is the rather depressing statistic that only 13% of government IT projects are successful, according to The Standish Group’s “Haze” report.

The following extract from 18F’s [De-Risking Guide](https://derisking-guide.18f.gov/) gives a great summary:

\> *Government agencies often describe challenges and the expense of customized commercial off-the-shelf (COTS) software. These efforts often start out as a pure COTS implementation, until agencies realize that they need to customize the software to meet their needs.*

*In these situations, the agency pays industry to develop custom software that the agency may end up locked into, especially if, as often happens, the agency did not secure sufficient data rights in its contract.*

*Over time, these systems become more difficult to maintain, as new features and customizations are added to the base COTS product, each of which bring it further away from actually being COTS. 18F technologists often refer to these products as “unrecognizably modified off-the-shelf” software, or “UMOTS.”*

***Modifying COTS software eliminates most of the benefits of using COTS.*** *Customized COTS is often modified to the point where routine software updates can no longer be applied. At this point, the software requires expensive custom updates for the duration of the software’s life. It also locks the agency into a long-term (and often sole-source) relationship with that contractor.*

So the real question is then: *how much customization is too much?*

This is an especially difficult question for non-technology enterprises or governments to answer, where IT and technology are seen as non-core competence. They end up being swept away by the vendors’ claims vs. seeing a product for what it is.

A simple analogy is that a true COTS is like buying a house. You can potentially move in the next day. Sure thing, you’ll need to move your furniture (i.e., your content and data), and you may want to paint the walls, but it is totally useable immediately.

When you buy a product that is not real COTS, it is more like a pile of building materials that have been placed at the building site. Yes, you’ve got all the components you need, but now you need a project manager and a lengthy build time to get the house you want, and if you are not careful, you may end up with something that you don’t want.

What is useful is to build a litmus test to understand if specific software is a COTS or not. A way to cut through any marketing bullshit and get to the real heart of the matter.

This is my checklist, and a true COTS product should be able to give you a yes to every answer, otherwise, it is not a true COTS.

-   Can you use a fully-functional demo version of the product?
-   Can we set up this product and start using it within one to three days?
-   Does the product have clear, publicly available online support documentation and user guides?
-   Does the vendor proactively release new versions of the product regularly?
-   Can we talk to other customers that are using the product?
-   Do you offer regular training courses or materials to help us get up to speed with using the product?

From the above, we can clearly see that Blue lives up to its name. It is a COTS. Amazon Web Services is another example, you can have a global MYSQL database setup in around 45 minutes, and it works.

ERPs and core-banking systems often get branded as COTS, but fail the above test. You cannot quickly log in to demo it, and you cannot get anything usable within a few days; the timelines for these projects are measured in months or years.

There is nothing inherently wrong with long timelines for IT projects (well, maybe yes, but I’ll leave this as a discussion for another day), but the fact that these types of software products are marketed as off-the-shelf when in reality, they require hundreds, if not thousands, of hours of work to customize and make them usable.

So this “off-the-shelf” marketing means very little if something is not ready to use. So, it should not be a factor in decision-making for large or complex organizations to require these types of enterprise systems that take a long time to implement. “Off-the-shelf” and custom builds should be weighed equally.

This is because you are unlikely to save time or money implementing existing systems and then trying to fit a round peg in a square hole — because the way you do things is unlikely to match nicely to “best practices” recommended by the software vendor.

Then you are left with a problem: do you change how you work to fit the software, or do you change the software to fit how you work? And what happens after you have finished the project and then your processes change in a year?

**Ouch.**

I think a COTS product is often *not* the right choice for enterprise or government organizations. They are simply not designed to be customized to such a degree, and it is more expensive and time-consuming than building something from scratch. The other issue is that if you make significant changes to the software, you then lose any possibility of continuing the upgrade cycle.

Finally, we also have to ask questions about vendors that purposefully mismarket their products as COTS when, in reality, they are closer to a custom build. This is an awful way to start a relationship with a client, but they know that once they have the sale clients often have little choice but to continue with painful and expensive rollouts.
