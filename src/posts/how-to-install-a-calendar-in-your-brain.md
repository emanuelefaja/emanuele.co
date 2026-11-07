---
title: "How To Install a Calendar In Your Brain."
date: 2022-06-11T21:41:00Z
categories: [essays, productivity, technology]
---

This is slightly tongue-in-cheek (obviously), but it works and is actually pretty cool if you try it.

Contrary to popular belief, you are not limited to installing applications on your computer, tablet, or smartphone. It’s perfectly possible to install applications into your brain for direct access, any time, any place. No credit card payments, no fancy “App Store” and you don’t even need to be connected to Wi-Fi.

Welcome to BrainCalendar™. I haven’t ported this to iOS or Android yet, so unlike most apps, it does require a functioning brain for you to use it.

Today I will help you install a calendar in your brain.

BrainCalendar™ allows you to know the day of the week for any date of any past or future year.

*That’s seriously cool.*

Firstly, let’s install in your brain a program that allows you to calculate the day of the week for any day in the next few years.

Here’s the code:

DayOfTheWeek™ = (YearCode™ + MonthCode™ + DayofTheMonth™) mod 7

## Let’s Break This Down.

DayOfTheWeek™

The Aim of BrainCalendar™ calculations is to reach a single-digit number which we can then convert to a DayOfTheWeek™.

It couldn’t be simpler:

Sunday = 1

Monday = 2

Tuesday = 3

Wednesday = 4

Thursday = 5

Friday = 6

Saturday = 0

**YearCode™**

I’ve given you a list of common years you might need, but for practical purposes, you only really need to remember the current year’s number, but don’t worry, later on, I will show you a way to calculate the **YearCode™** for any year!

2008 = 2

2009 = 3

2010 = 4

2011 = 5

2012 = 0

2013 = 1

2014 = 2

2015 = 3

**MonthCode™**

Unless you want to get down and dirty with the maths, just accept that these are the numbers and that’s that. These never change.

January = 1

February = 4

March = 4

April = 0

May = 2

June = 5

July = 0

August = 3

September = 6

October = 1

November = 4

December = 6

These numbers are not just picked out of the blue. The describe the relationship between the starting days of the month.

So if January starts on a Sunday (DayOfTheWeek™=1) then February and March will start on a Wednesday (DayOfTheWeek™=4), April on a Saturday (DayOfTheWeek™=0), May on a Monday (DayOfTheWeek™=2), and so on…

**DayofTheMonth™**

This is simply the number of the day of the month. So if you want to know what the date will be on the 17th of April 2014, the day number will be 17.

Pretty easy. 😉

**Mod 7**

This looks complex, but it just gives you the remainder of a division by 7. So, 25 mod 7 is 4 because 7 goes into 25 three times with a remainder of 4.

Let’s test it out. My original website started on the 1st of December 2012

So…

DayOfTheWeek™ = (YearCode™ + MonthCode™ + DayofTheMonth™) mod 7

The YearCode™ for 2012 is 0

The MonthCode™ for December is 6

The DayofTheMonth™ is 1

DayOfTheWeek™ = (0 + 6 + 1) mod 7

DayOfTheWeek™ = 7 Mod 7

DayOfTheWeek™ = 0

My original blog was founded on a Saturday!

Once you get the hang of this you can do it so quickly that it’s almost instantaneous. The maths is really not that difficult, but it’s an amazing tool to have!

**LeapYear™**

LeapYear™ was invented by Microsoft back in the day as a quick-fix solution, and unfortunately, nobody has come up with a better way to keep the calendar year synchronized with the seasonal year.

BrainCalendar™ has a very simple built-in solution to dealing with the pesky LeapYear™. If you are calculating the date of a leap year, make sure you subtract one from your result if the day in question is in January or February. This is because the leap day hasn’t occurred yet. For all the other months you don’t have to do a thing!

## Taking Things Further

Not even Apple gives you free software upgrades…

What if you want to work out the day of the week for any year?

Firstly, let me introduce CenturyCode™

CenturyCode™ has been built from the ground up to be easy to use.

All you need to do is take the first two digits of the Century you wish to run BrainCalendar™ on and then find the next highest multiple of 4.

So for the 1600s, that would mean you take 16 and then find the next highest multiple of 4, which in this case is 20.

Then, you subtract 1 from 20 and then subtract 16 from the total.

Then, you multiply your answer by two.

So:

XX00s CenturyCode™ = (next highest multiple of four minus 1, minus XX)\*2

1600s CenturyCode™= (20–1–16)\*2

1600s CenturyCode™ = 6

Another example for a future year:

4200s CenturyCode™ = (44–1–42)\*2

4200s CenturyCode™ = 2

Now, it’s a piece of cake to use CenturyCode™ to calculate the YearCode™ for any year!

YearCode™=\[CenturyCode™+ YearNumber™+(YearNumber™ div 4)\] mod 7

Don’t freak out at the “div 4″. It’s a bit like the “mod 7″ except “div 4″ tells us how many 4s we can fit in a number and ignores the remainder.

So 17 div 4 = 4 (forget about the remainder 1)

Example:

What’s the YearCode™ of Beethoven’s year of birth, 1770?

First of all, let’s work out the CenturyCode™.

1700s CenturyCode™ = (20–1–17)\*2

1700s CenturyCode™ = 4

Now we can work out the YearCode™ for 1770.

YearCode™=\[4+ 70+(70 div 4)\] mod 7

YearCode™=\[74+(17)\] mod 7

YearCode™=\[91\] mod 7

YearCode™= 0

Done!

As a full example, why don’t we find out on what DayOfTheWeek™ Mozart was born?

Mozart was born on the 27th of January, 1756.

XX00s CenturyCode™ = (next highest multiple of four minus 1, minus XX)\*2

1700s CenturyCode™ = (20–1–17)\*2

1700s CenturyCode™ = 4

YearCode™=\[CenturyCode™+ YearNumber™+(YearNumber™ div 4)\] mod 7

YearCode™=\[4+ 56+(56 div 4)\] mod 7

YearCode™= 4

DayOfTheWeek™ = (YearCode™ + MonthCode™ + Day) mod 7

DayOfTheWeek™ = (4 + 1 + 27) mod 7

DayOfTheWeek™= 4

1756 was a LeapYear™ so we must subtract one from our DayOfTheWeek™ because it’s in January.

Thus,

DayOfTheWeek™= 3

***Mozart was born on a Tuesday.***
