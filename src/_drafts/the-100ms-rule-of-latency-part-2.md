---
permalink: false
eleventyExcludeFromCollections: true
title: "The 100ms Rule of Latency (Part 2)."
date: 2022-12-03T12:33:14Z
categories: [uncategorized]
modified: 2022-12-03T12:33:14Z
---

<!-- WordPress draft 2498 from emanuele.cc, imported 2026-11-16. Unpublished: 547 words. Excluded from the build by the front matter above. -->

## How to Improve Latency.

So, we agree that faster is better when it comes to web applications. So how can we reduce latency?

There are only two key activities that have to be done:

1.  Measure the speed.
2.  Improve the speed

Once you've completed point 2, then go back to point 1.

Before we get into how to measure speed, it is interesting no note that notwithstanding the massive orders-of-magnitude improvements in capacity (128x) and bandwidth (20x), latency has only improved by 1.3x. \[mfn\] [Understanding and Improving the Latency of DRAM-Based Memory Systems](https://arxiv.org/pdf/1712.08304.pdf)\[/mfn\]

So what has happened is that the internet has got massively faster, but websites haven't.

> For the past 10 years, Httparchive.org has recorded page load times for 6 million popular websites. (Httparchive.org is a part of the InternetArchive.org, whom you may know as the folks behind the WayBack Machine). The results are not encouraging: for webpages visited from a desktop computer, the median load time hasn’t improved. **Today’s websites aren’t that much faster than they were 10 years ago*****.***
>
> Kathryn Whitenton \[mfn\][The Need for Speed, 23 Years Later](https://www.nngroup.com/articles/the-need-for-speed/)\[/mfn\]

<figure><img src="/media/2022/12/Screenshot-2022-12-03-at-6.51.21-PM-1024x614.png" alt="" loading="lazy"><figcaption>Attribution: nngroup.com</figcaption></figure>

So what's happening here? Well, it would appear that there is a type of arms race going on, with developers taking advantage of the bandwidth increase and making websites more complex over the years. While the overall trend for websites is faster, it is not the order-of-magnitude change that we would expect based on the underlining technological shifts.

So, let's talk about measurements.

### Measurements.

### Getting Faster.

The best approach to take when optimising anything is Kaizen: minor improvements compounding over time that lead to massive changes.

This clip on YouTube summarizes this quite nicely:

[https://www.youtube.com/watch?v=wot9DFzFRLU](https://www.youtube.com/watch?v=wot9DFzFRLU)

And there is a fantastic book called "Gemba Kaizen" by Masaaki Imai discusses this topic at length with some fascinating case studies. I never imagined that I would be enthralled by understanding how mattress manufacturing works. When you get into the details, everything is interesting.

**Fighting Propagation.**

The first and most obvious thing to do is to be closer to your end users. If you primarily serve the US market, having your server in Asia or Australia doesn't make sense.

This instantly reduces the theoretical maximum latency time.

Interestingly, this can apply to the entire technology stack, not just your server. For instance, Blue is moving to an AWS (Amazon Web Services) database called Aurora, which allows for globally distributed databases that are kept in sync. That means that when a user makes a request, it hits the server nearest to them, which in turn requests values stored in the database that is closest to it. Thus, the entire process is significantly faster.

Having globally synced databases is a challenging problem. For a small team like the one I have at Blue, it is something that we are far better to abstract away to a company like Amazon and trying to do ourselves.

The other popular technique is to use what's called a CDN (Content Delivery Network) that stores copies of your data in servers that are geographically closer to your end users. Some services such as Akamai, Cloudflare, and Amazon Cloudfront can do this. You upload just one file, and they will automatically take care of the global distribution.

**Asynchronous Development.**
