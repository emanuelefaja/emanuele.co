---
title: "The 100ms Rule of Latency (Part 1)."
date: 2022-12-03T12:34:19Z
categories: [blue, design, essays, technology]
---

## Introduction.

I’ve had a fascination with time since I read Carlo Rovelli’s The Order of Time. This is an incredible book on the nature of time itself and how time is an illusion. The book, I believe, was written in Italian and then translated into English, as it is beautifully written.

Here’s an example:

> We can think of the world as made up of things. Of substances. Of entities. Of something that is. Or we can think of it as made up of events. Of happenings. Of processes. Of something that occurs. Something that does not last, and that undergoes continual transformation, that is not permanent in time.

In this book, Rovelli explains his concept of relational time or “temporal becoming” which is different than the traditional concept of linear time. He suggests that we can look at our experience of time in terms of relationships between events rather than a sequence of separate moments in a line.

This idea has profoundly affected my thinking about time and how it impacts our lives. It has also changed the way I view time management and productivity.

Time is a limited commodity, but its importance lies in what we choose to do with it. We have control over how we spend our time, but often don’t take full advantage of this power. We often let time slip away without making the most of it.

By viewing time as relational, we can begin to think about how our activities are interconnected and affect each other. We can look at the big picture and focus on what is truly important. This way of looking at time can help us use our limited resources more effectively, allowing us to accomplish more with less time.

We can also use this concept of relational time to help us think about our future. By understanding the interconnectedness of events, we can better plan for the future and make smarter decisions that will positively affect our lives.

I have also had a fascination with time travel, and I’ve previously written about the experiences of a time traveller.

Today, I am also writing about time, but a much more specific type of time — the time required to achieve things within digital interfaces.

This specific interest has come about due to running [Blue](https://blue.cc), my B2B SaaS company. The platform used to be very fast in the early days, and as more and more organizations have started using it, is has slowed down. So, I wanted to study what are the correct benchmarks for speed and also how I may be able to speed up Blue for users throughout the world.

What is interesting is that issues that are minor when you don’t have scale suddenly become quite major issues. There are two types of degradation of performance in applications:

1.  **The first is gradual degradation.** This is in linear proportion to the number of users. This can easily be tracked and acted upon because the relationship is clear, and you usually have quite a lot of time to plan for it.
2.  **The second is sudden degradation.** This is when performance goes down suddenly, either to much lower levels than required or acceptable, or when things stop working altogether. Blue had this a few months back in September 2022, when we were effectively down for an entire day due to connection pooling issues regarding our database.

This essay has a relatively straightforward structure. I will explain the 100ms rule of latency, critically analyze one of the core assumptions, discuss why the rule matters, why web applications are sometimes slow, and how to improve speed.

Let’s get started!

## The 100ms Rule of Latency.

The rule is very straightforward. It states that **every interaction in a digital interface should be faster than 100ms.**

Stefan Buscotti puts it rather poetically: *“Some smart developers obsess over this rule to inform every single product decision, every single touchpoint, every single click. The object is to deliver a perfect, timeless experience. In less than half the blink of an eye.”*[^1]

The rule is generally attributed Paul Buchheit, the creator of Gmail and the developer of the original prototype of Google Adsense. I first read about this on the blog of Superhuman, an email application which prides itself on speed.[^2]

Paul Buchheim was the 23rd employee at Google, then left Google in 2006 to start FriendFeed, which Facebook acquired in 2009. He later joined the venture capital fund and incubator [yCombinator](https://www.ycombinator.com/). Interestingly, he was the one that suggested *“Don’t be evil” as* Google’s motto during a company meeting in 2000.

What is interesting about the 100ms rule of latency is that it has some core assumptions which need to be critically evaluated.

## Do things feel instantaneous at 100ms?

The study that everyone leverages to showcase that things feel instantaneous at 100ms is *“Response Times: The 3 Important Limits”* from Nielsen, 1993.[^3]

But I think everyone misses the point.

The study does ***not*** claim that users cannot react or notice things faster than 100ms.

Instead, it discussed 100ms as the ceiling where users feel *“that they are directly manipulating objects in the UI.”*

In other research, Nielsen states that *“If it takes longer than 0.1 seconds for the revised state to appear, then the response doesn’t feel instantaneous — instead, it feels as if the computer is doing something to make the menu open.”*[^4]

So, in other words, 100ms is the tipping point.

Faster than this, users feel *they* cause what is happening on the digital interface.

Slower than this, they feel *the technology* is doing something on their behalf.

Interestingly, this has *absolutely nothing* to do with the underlining technology. It’s not about web applications at all. The research that underlines this[^5][^6] has been available and standard knowledge for over fifty years — predating the invention of the internet!

A significant amount of evidence showcases the fact that humans can detect and react to sub-100ms events.

A straight-forward test[^7] that you can do if you’re on a Mac or Unix system is to type the following into your terminal:

```
sleep 0; echo "pong"
```

And then try:

```
sleep 0.1; echo "test"
```

In both examples, the terminal will output text.

But, “pong” will feel truly instantaneous, while you will be able to notice a slight delay when the terminal writes “test”.

There is also an issue of logic when thinking about reaction time vs being able to notice things.

> …it’s common to hear people claim that you can’t notice 50ms or 100ms of latency because human reaction time is 200ms. This doesn’t actually make sense because there are independent quantities. This line of argument is like saying that you wouldn’t notice a flight being delayed by an hour because the duration of the flight is six hours.
>
> Dan Luu[^8]

This is even more obvious if we think about movies. You can easily tell the difference between cinematic movies that are shot at 24fps (frame per second) and smartphone footage that can be shot at 60fps and sometimes feel strangely smooth.

The math bears this out: at 24fps, we are shown one frame every ~42ms, while at 60fps, we are hit with a frame every ~17ms.

Obviously, this is noticeable!

There are various studies[^9][^10][^11][^12] that further showcase this, even with input lag that is just 2ms!

The question then becomes: at what point does our perception of zero latency experience diminish? And how small do response times need to be for users to feel that things are instantaneous or close to it?

And this has real-world implications beyond digital interfaces.

An interesting example is how Devon Allen was disqualified from the 110-meter hurdles at the 2022 World Athletics Championships in Oregon.[^13]

Allen did not start before the gun went off, but within 100ms of the gun going off.

> World Athletics, the body which determines international rules for track and field, **has set the threshold for false starts at 100 milliseconds or 0.1 seconds**– this means that any athlete that pushes off the block within 100 milliseconds after the gun goes off is considered to have made a false start. The reason behind this limit is that **humans are not believed to be capable of reacting to the starting gun at a speed faster than that**.

In this particular case, Allen started 99ms after the gun went off, so he was 1ms too fast.

World Athletics’ own research[^14] questions the 100ms rule for reaction times, but the official rules have not yet been updated.

I am not quite sure what the rule *should* be. Because even if you are 1ms over the stated time, this is not in practice repeatable by athletes, and I don’t believe that 1ms makes any difference to the outcome of the race. So, perhaps the precise time to disqualify an athlete should be the millesecond where the gun goes off. This would allow some athletes to try and “game” the system by starting when they believe the gun will go off vs when the gun actually goes off, and thus getting up to 80-100ms head start on their competition. But, this would be highly risky strategy due to potential false starts.

It is worth going on a slight detour and discussing the different time scales of user experience and how they impact end-users.

## Why does the 100ms Rule of Latency Matter?

Going slowly might be a great life philosophy, but it is a terrible software strategy. Faster software enables better user experiences, which in turn, helps users and organizations reach their goals.

There are a few cornerstone findings in this area, such as when Amazon realized that every 100ms is slowness reduced conversion on their site by 1%.

An internal paper from Google[^15] showcased that:

> Experiments demonstrate that increasing web search latency 100 to 400 ms reduces the daily number of searches per user by 0.2% to 0.6%. Furthermore, users do fewer searches the longer they are exposed. For longer delays, the loss of searches persists for a time even after latency returns to previous levels.

The last sentence is fascinating. Even once site speed was restored to normal, users in the group that suffered the delays continued with the altered behaviour of doing fewer searches.

These are *really* small timings that we’re talking about. The average blink is 400ms[^16], and the changes made in the Google study were up to 1/4 of the time it takes to blink.

There is also an interesting website called [WPOstats](https://wpostats.com/) that list Case studies and experiments demonstrating the impact of web performance optimization (WPO) on user experience and business metrics. This shows how relatively minor tweaks to the optimization of websites can result in meaningful increases in core business metrics.

TABB Group extensively studied latency regarding electronic trading brokerages.[^17] It found that a 1ms average delay in trading speed could result in up to $4m in revenue.

They even state, “*If a broker is 100 milliseconds slower than the fastest broker, it may as well shut down its FIX engine and become a floor broker.”*

So if you’re 0.1s slower than your competition, you might as well be on the trading floor using humans instead of using computers.

But a question *specific to technology where the end users are consumers* is: *why is everyone in such a rush?*

After all, if we measured our daily lives in milliseconds, it would be ridiculous.

We don’t count 120,000 milliseconds to brush our teeth or 720,000 milliseconds to boil an egg. But, as the Google study showcased, even 100ms extra time on a search creates meaningful changes in behaviour.

It’s not too bad to wait a few minutes to checkout at a grocery store, but if an eCommerce site made you wait two minutes once you press buy, you’d likely quit before making a purchase.

My pet theory regarding this is that we view most of the interactions we have with digital platform as a nuisance. We don’t *want* to use Google search; we simply want the answer to a specific question.

Google search is just something that is blocking us from getting that answer, a necessary evil that we must overcome each time in order to reach out end goal.

Looking at it this way, it is then hardly surprising that we want to rush through anything with the a digital interface.

I’ve read somewhere that all that customers really want is a button that gets “the thing” done. Whatever “the thing” is, whoever gets closer to making an automatic button for that, wins.

The more abstraction an organization can provide to the underlining work required to get to a certain outcome, the more valuable that service or product can be.

Let’s consider what is arguably the world’s most valuable consumer product: the iPhone.

This has managed to replace what previously were a multitude of separate products. An iPhone can serve as a camera, radio, calculator, voice recorder, GPS navigator, flashlight, leveler, scanner, compass, portable gaming device, barcode scanner, USB thumbdrive, credit card scanner, walkie talkie, alarm clock, book, calendar, notepad, newspaper, photo album, contact list, board game, TV, measuring tape, light meter, credit card, and business card.

And I am sure we could find several hundred other use cases with just a tiny amount of further thinking!

But, there can be a dark side to all this. As we get used to technology providing near-instantaneous feedback, it creates a prominent juxtaposition to the “real” world, where things are not measured in milliseconds.

Meaningful results take time. You go to the gym and do a one-hour (3,600,000ms) workout, and then you look at yourself in the mirror: nothing has changed. It will take numerous workouts spread over weeks and months to make a significant change to your body.

There is no single practice session when you become a pianist, no single conversation where you become fluent in a new language.

But if we spend most of our time interacting digitally, with instant feedback, can we still have enough patience for the meaningful long-term results we all seek in our lives?

This is quite a strong argument for leaving social media, and I encourage you to learn more at the [Center of Humane Technology.](https://www.humanetech.com/)

## So What Causes Latency in Web Apps?

Firstly, let’s *actually* define latency!

The Oxford Dictionary states: *the delay before a transfer of data begins following an instruction for its transfer.*

Dictionary.com goes further: *the period of delay when one component of a hardware system is waiting for an action to be executed by another component*.

In plain English: the time it takes for something to *apparently* happen. I pick my words carefully, and you’ll see why I italicized the word “apparently” later.

And when we are talking about web applications, this implies that there is some input or action by a user on a browser, which sends a request to the server, which then comes back to the browser. Then, something changes on the screen.

Latency is the time between the input/action from the user, to something changing in the user interface.

Let me show you a quick example to explain:

<figure><video src="/media/2022/12/Blue-Latency-Test.mp4" width="1920" height="1128" controls="" preload="metadata" playsinline=""></video><figcaption>Creating a todo in Blue with a network simulation of Slow 3G.</figcaption></figure>

You can see that after I finish typing the new todo “latency test” and I hit enter, there is some time that elapses until the state of the user interface “confirms” this.

I artificially slowed down my network speed to showcase this, as this usually happens within a fraction of a second.

So again, latency in web applications is a message going from your browser to the web server and back, with a corresponding update in the user interface.

One question many people have is the difference between latency and bandwidth. Most people are familiar with bandwidth, as this is a heavily advertised number in cellular data plans and home internet services.

AKF Partners, a technology consultancy, put it very well:

> Using the metaphor of a restaurant, bandwidth is the amount of seating available. The more seating the restaurant has, the more people it can serve at one time. If a restaurant wants to be able to serve more people in a certain time period they add more seating. Similarly, bandwidth is the maximum amount of data that can be transferred in a specific measure of time. If bandwidth is the maximum number of diners that can fit in a restaurant at one time, then latency is the amount of time it takes for food to arrive after ordering. On the Internet, latency is a measure of how long it takes for a user to get a response from an action like a click. It is the “performance lag” the user feels while using our product.[^18]

This is why satellites are great for streaming video but not very good at interactive services because they have a relatively high latency purely from the time it takes the message to go to space and return to earth. You don’t mind if your video is 0.6 behind what it would be instead of receiving it via cable, but if you are playing online games, they would be unplayable.

There are four main reasons why web applications experience latency:

1.  Propagation.
2.  Transmission Mediums.
3.  Network Hops.
4.  Processing Time.

Let’s cover each sequentially — without latency 😉

### Propagation.

Propagation is how long information takes to travel. The theoretical limit for information transfer is the speed of light in a vacuum, which is 299,792,458m/s.

To put that into perspective, the earth’s circumference is 40,075km, so a photon at its maximum speed would go around the earth ~7.5 times per second.

So far, so good. This is the theoretical maximum that information can travel.

With our current understanding of physics, you cannot send data from San Francisco to Stockholm (8,645km) in less time than 28.83661602988ms.

If you can, you should also get a flight to Stockholm to pick up your Nobel Prize.

### Transmission Mediums.

But, there are complexities. Photons do not always travel at their theoretical maximum speed; this also depends on the medium they travel through. They travel at ~225,000,000m/s in water and ~200,000,000m/s in glass.[^19]

In fibre optic cables and copper wires, the typical mediums through which information passes when you access the internet, you get ~200,000,000m/s — similar to glass.

And even with this speed, you can notice the latency. A packet of information travelling from London to Sydney would have to cover a minimum of 17,016km each way, so 34,032km in total for the round trip. This assumes a direct “as the crow flies” route, while in reality, internet cables do not travel in a straight line but have to follow certain geographic features and major population hubs.

But even with this best-case scenario, the latency is 170ms, which is above our 100ms rule, and then note that this is *per* *request*. When you load a page in a web application or website, there can be dozens of requests, including images, HTML, CSS, javascript, and many other things. Some of these can run simultaneously, and some of them cannot.

[In my rundown on the Fermi Paradox](/fermi-paradox/), I previously wrote about how the speed of light may be quite a significant issue in humanity becoming a multi-galaxy species. When the distances are enormous, such as millions of light years, a message you send to one species will be received by a different species — because the recipient will have evolved in the meantime!

### Network Hops.

I’ll quote AKF Partners again for this one:

> It would be great if our data went straight from our device to the server and back, but again, probably not going to happen. As our packet travels to the server and back to the source it travels through different network devices. The request passes through routers, bridges, and gateways. Each time our data is handed off to the next device, a “network hop” occurs. These hops add more latency than distance. A request that travels 100 miles but makes 5 hops will have more latency than a request that travels 2500 miles with only 2 hops. The more hops are in the line, the more latency.

### Processing Time.

Another issue that can cause latency is that the server that receives the message from your browser has to process the request. But, your request is unlikely to be the only request, and in high-traffic situations, perhaps the server cannot handle your request immediately and thus is queued, to be dealt with as soon as there is some capacity (typically a few hundred milliseconds later).

Or, perhaps the request you sent is complex and requires significant server-side processing. For instance, if you ask Blue for an export of your entire project in CSV (Comma Separated Values) format, our server has to generate this file and then send it back, and this cannot be done within 100ms.

---

This is it for part 1; I’ll soon write part 2, where we dive into how to improve latency in web applications!

### References.

-   1

    [100 Millisecond Rule](https://boscutti.com/blogs/journal/100-millisecond-rule)

-   2

    [Why Superhuman is built for speed: applying the 100ms rule to email](https://blog.superhuman.com/superhuman-is-built-for-speed/)

-   3

    [Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/)

-   4

    [Powers of 10: Time Scales in User Experience](https://www.nngroup.com/articles/powers-of-10-time-scales-in-ux/)

-   5

    Miller, R. B. (1968). Response time in man-computer conversational transactions. Proc. AFIPS Fall Joint Computer Conference Vol. 33, 267-277.

-   6

    Card, S. K., Robertson, G. G., and Mackinlay, J. D. (1991). The information visualizer: An information workspace. Proc. ACM CHI’91 Conf. (New Orleans, LA, 28 April-2 May), 181-188.

-   7

    [Computer latency: 1977-2017](https://danluu.com/input-lag/)

-   8

    [Keyboard latency](https://danluu.com/keyboard-latency/)

-   9

    [In the blink of an eye: investigating latency perception during stylus interaction](https://dl.acm.org/doi/abs/10.1145/2556288.2557037)

-   10

    [In the blink of an eye](https://news.mit.edu/2014/in-the-blink-of-an-eye-0116)

-   11

    [Designing for low-latency direct-touch input](https://dl.acm.org/doi/abs/10.1145/2380116.2380174)

-   12

    [Improving software-reduced touchscreen latency](https://dl.acm.org/doi/abs/10.1145/3098279.3122150)

-   13

    [Devon Allen’s false start: Was his disqualification fair? What does the rule say?](https://en.as.com/other_sports/devon-allens-false-start-was-his-disqualification-fair-what-does-the-rule-say-n/)

-   14

    [Is the 100ms limit still valid?](https://www.worldathletics.org/news/news/iaaf-sprint-start-research-project-is-the-100)

-   15

    [Speed Matters for Google Web Search](https://services.google.com/fh/files/blogs/google_delayexp.pdf)

-   16

    [For Impatient Web Users, an Eye Blink Is Just Too Long to Wait](https://www.immagic.com/eLibrary/ARCHIVES/GENERAL/GENPRESS/N120229L.pdf)

-   17

    The Value of a Millisecond: Finding the Optimal Speed of a Trading Infrastructure

-   18

    [What is Latency and how much is it costing you?](https://akfpartners.com/growth-blog/what-is-latency)

-   19

    [Speed of Light](https://www.olympus-lifescience.com/en/microscope-resource/primer/lightandcolor/speedoflight/)

[^1]: [100 Millisecond Rule](https://boscutti.com/blogs/journal/100-millisecond-rule)
[^2]: [Why Superhuman is built for speed: applying the 100ms rule to email](https://blog.superhuman.com/superhuman-is-built-for-speed/)
[^3]: [Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/)
[^4]: [Powers of 10: Time Scales in User Experience](https://www.nngroup.com/articles/powers-of-10-time-scales-in-ux/)
[^5]: Miller, R. B. (1968). Response time in man-computer conversational transactions. Proc. AFIPS Fall Joint Computer Conference Vol. 33, 267-277.
[^6]: Card, S. K., Robertson, G. G., and Mackinlay, J. D. (1991). The information visualizer: An information workspace. Proc. ACM CHI’91 Conf. (New Orleans, LA, 28 April-2 May), 181-188.
[^7]: [Computer latency: 1977-2017](https://danluu.com/input-lag/)
[^8]: [Keyboard latency](https://danluu.com/keyboard-latency/)
[^9]: [In the blink of an eye: investigating latency perception during stylus interaction](https://dl.acm.org/doi/abs/10.1145/2556288.2557037)
[^10]: [In the blink of an eye](https://news.mit.edu/2014/in-the-blink-of-an-eye-0116)
[^11]: [Designing for low-latency direct-touch input](https://dl.acm.org/doi/abs/10.1145/2380116.2380174)
[^12]: [Improving software-reduced touchscreen latency](https://dl.acm.org/doi/abs/10.1145/3098279.3122150)
[^13]: [Devon Allen’s false start: Was his disqualification fair? What does the rule say?](https://en.as.com/other_sports/devon-allens-false-start-was-his-disqualification-fair-what-does-the-rule-say-n/)
[^14]: [Is the 100ms limit still valid?](https://www.worldathletics.org/news/news/iaaf-sprint-start-research-project-is-the-100)
[^15]: [Speed Matters for Google Web Search](https://services.google.com/fh/files/blogs/google_delayexp.pdf)
[^16]: [For Impatient Web Users, an Eye Blink Is Just Too Long to Wait](https://www.immagic.com/eLibrary/ARCHIVES/GENERAL/GENPRESS/N120229L.pdf)
[^17]: The Value of a Millisecond: Finding the Optimal Speed of a Trading Infrastructure
[^18]: [What is Latency and how much is it costing you?](https://akfpartners.com/growth-blog/what-is-latency)
[^19]: [Speed of Light](https://www.olympus-lifescience.com/en/microscope-resource/primer/lightandcolor/speedoflight/)
