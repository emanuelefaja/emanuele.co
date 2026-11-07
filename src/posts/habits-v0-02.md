---
title: "Habits v0.02"
date: 2023-01-02T02:16:54Z
categories: [habits, short]
---

So this is a continuation of my exploration with regard to the Habits application, and a [direct follow on from the first release](/habits-v0-01/).

One of the main restrictions of the v0.01 is that the software could only track one habit, squats. Obviously, this is not very convenient if you want to track another type of habit instead, so I have modified this in the following manner:

-   The CSV file that I use to store data now includes a “column” for tracking the type of activity that I want to track.
-   You can add new activities when inputting data, and when requesting stats or charts, you have to input the activity you want to review.

![](/media/2023/01/Screenshot-2023-01-02-at-10.19.50-AM.png)

Obviously, it would be better to have a list of activities to pick from instead of manually writing which activity you want to see, but this can be fixed in the next version.

Here is the code with comments:

```
import csv
import datetime
import matplotlib.pyplot as plt

# This function takes in three arguments: an activity name (as a string), a date (as a string in the format "YYYY-MM-DD"), and a list of sets (as integers)
# It writes a row to the 'activity_tracker.csv' file for each set, with the activity name, date, and number of sets in each row
def track_activity(activity, date, sets):
  with open('activity_tracker.csv', 'a', newline='') as csvfile:
    activity_writer = csv.writer(csvfile, delimiter=',')
    for s in sets:
      activity_writer.writerow([activity, date, s])

# This function takes in one argument: an activity name (as a string)
# It reads through the 'activity_tracker.csv' file and calculates the total number of sets, the average number of sets per day, and the maximum number of sets in a single day for the given activity
# It then prints these values to the console
# It also returns a tuple with two lists: a list of dates (as strings in the format "YYYY-MM-DD") and a list of the corresponding number of sets for each date
def get_activity_stats(activity):
  total_sets = 0
  max_sets = 0
  with open('activity_tracker.csv', 'r') as csvfile:
    activity_reader = csv.reader(csvfile, delimiter=',')
    num_sets = 0
    dates = []
    sets = []
    for row in activity_reader:
      if row[0] == activity:
        total_sets += int(row[2])
        max_sets = max(max_sets, int(row[2]))
        num_sets += 1
        dates.append(row[1])
        sets.append(int(row[2]))
  if num_sets > 0:
    avg_sets = total_sets / num_sets
  else:
    avg_sets = 0
  print(f'Total {activity}: {total_sets}')
  print(f'Average {activity} per set: {avg_sets:.2f}')
  print(f'Max {activity} per set: {max_sets}')
  return (dates, sets)

# This function takes in two arguments: a list of dates (as strings in the format "YYYY-MM-DD") and a list of the corresponding number of sets for each date
# It creates a bar chart showing the number of sets for each date
def show_bar_chart(dates, sets):
  plt.bar(dates, sets)
  plt.xlabel('Date')
  plt.ylabel(activity)
  plt.title(f'{activity} per Day')
  plt.show()

# Prompt the user to input a string to determine the next action
# If the action is 'input', prompt the user to enter an activity name, date, and number of sets, and then call the 'track_activity' function with these values
# If the action is 'stats', prompt the user to enter an activity name, and then call the 'get

# Prompt the user to input a string to determine the next action
# If the action is 'input', prompt the user to enter an activity name, date, and number of sets, and then call the 'track_activity' function with these values
# If the action is 'stats', prompt the user to enter an activity name, and then call the 'get_activity_stats' function with this value
# If the action is 'chart', prompt the user to enter an activity name, call the 'get_activity_stats' function with this value to get the dates and sets lists, and then call the 'show_bar_chart' function with these values
# If the action is none of these, print an error message
action = input('Enter "input" to input new data, "stats" to view statistics, or "chart" to view data in a bar chart: ')
if action.lower() == 'input':
  activity = input('Enter activity name: ')
  date = input('Enter date (YYYY-MM-DD): ')
  sets = []
  while True:
    num_sets = input(f'Enter number of {activity} sets (or "done" to finish): ')
    if num_sets.lower() == 'done':
      break
    sets.append(int(num_sets))
  track_activity(activity, date, sets)
elif action.lower() == 'stats':
  activity = input('Enter activity name: ')
  get_activity_stats(activity)
elif action.lower() == 'chart':
  activity = input('Enter activity name: ')
  dates, sets = get_activity_stats(activity)
  show_bar_chart(dates, sets)
else:
  print('Invalid input')
```

## Positive vs Negative Habits.

One thing that I have been carefully considering is the fact that some habits are positive and some habits are negative. This is not such a big finding, as obviously meditation is something where more is better (up to a certain point!) while smoking is quite the opposite.

I was reading this morning “The Pleasure Trap” and it raises an interesting point:

> Cigarettes also serve as an excellent example for clarifying the limitations of moderation philosophy. How many cigarettes is a “healthy and moderate” amount? The answer—the extreme position—is none. Similarly, how much cocaine is a “healthy and moderate” amount? The answer is again, none.
>
> **Lisle, Douglas J.; Goldhamer , Alan . The Pleasure Trap: Mastering the Hidden Force that Undermines Health & Happiness (p. 165-166). Book Publishing Company. Kindle Edition.**

There are certain habits that we want to eliminate rather than increase. These negative habits require a different approach than positive habits, which often involve setting numerical goals and striving to improve continually. It may be helpful to have a system in place for both positive and negative habits,

This further solidifies my idea that there is likely to be a benefit to having some type of preset habits, both positive and negative, with pre-determined strategies and approaches that are tailored to the specific characteristics of each type of habit.

Another thought was about putting the code up publicly, and if I want to make this habit tracker open-source in the future, while still trying to turn it into a viable business in the future.
