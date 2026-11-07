---
title: "Habits v0.03"
date: 2023-01-06T08:30:15Z
categories: [habits, short]
---

So some further improvements to *Habits*, with the third release!

-   Now the program runs on an infinite loop, so once you finish viewing statistics or inputting data, it waits for you to decide on the next command.
-   I’ve also updated the input mechanism so you just have to enter a number based on the choice of what you want to do instead of having to type out “input”, “stats”, or “chart”.
-   I also show the activity names when asking the user to type the activity name to view statistics or charts, and this will be further updated in a future release to just use a number in the same method as above.
-   When asking for date for input, there is a choice to choose today’s date without having to input the full date, or to manually choose a date by typing it out in the YYYY-MM-DD format.

![](/media/2023/01/Screenshot-2023-01-06-at-4.29.00-PM.png)

```
import csv
import datetime
import matplotlib.pyplot as plt

def track_activity(activity, date, sets):
  with open('activity_tracker.csv', 'a', newline='') as csvfile:
    activity_writer = csv.writer(csvfile, delimiter=',')
    for s in sets:
      activity_writer.writerow([activity, date, s])

def get_activity_stats(activity):
  total_sets = 0
  max_sets = 0
  sets_by_date = {}
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
        if row[1] not in sets_by_date:
          sets_by_date[row[1]] = 0
        sets_by_date[row[1]] += int(row[2])
  if num_sets > 0:
    avg_sets = total_sets / num_sets
  else:
    avg_sets = 0
  print(f'Total {activity}: {total_sets}')
  print(f'Total sets: {num_sets}')
  print(f'Average {activity} per set: {avg_sets:.2f}')
  print(f'Max {activity} per set: {max_sets}')
  return (sets_by_date.keys(), sets_by_date.values())

def show_bar_chart(activity, dates, sets):
  plt.bar(dates, sets)
  plt.xlabel('Date')
  plt.ylabel(activity)
  plt.title(f'{activity} per Day')
  plt.show()

def get_date():
  # ask user for option
  print("1. Input data for today")
  print("2. Choose another day")
  option = input("Enter an option: ")
  # input data for today
  if option == "1":
    return datetime.date.today()
  # choose another day
  elif option == "2":
    # ask user for date
    return input("Enter a date (yyyy-mm-dd format): ")
  else:
    print("Invalid option")
    return get_date()

def get_menu_option():
  # print menu
  print("1. Input new data")
  print("2. View statistics")
  print("3. View chart")
  print("4. Quit")
  # ask user for option
  option = input("Enter an option: ")
  return option

def main():
  option = get_menu_option()
  # execute chosen option
  while option != "4":
    if option == "1":
      activity = input('Enter activity name: ')
      date = get_date()

      sets = []
      while True:
        num_sets = input(f'Enter number of {activity} sets (or "done" to finish): ')
        if num_sets.lower() == 'done':
          break
        sets.append(int(num_sets))
      track_activity(activity, date, sets)

    elif option == "2":
      # list out all the activities
      with open('activity_tracker.csv', 'r') as csvfile:
        activity_reader = csv.reader(csvfile, delimiter=',')
        activities = []
        for row in activity_reader:
          if row[0] not in activities:
            activities.append(row[0])
      # allow the user to choose an activity
      activity = input(f'Enter activity name ({", ".join(activities)}): ')
      get_activity_stats(activity)
    elif option == "3":
      # list out all the activities
      with open('activity_tracker.csv', 'r') as csvfile:
        activity_reader = csv.reader(csvfile, delimiter=',')
        activities = []
        for row in activity_reader:
          if row[0] not in activities:
            activities.append(row[0])
      # allow the user to choose an activity
      activity = input(f'Enter activity name ({", ".join(activities)}): ')
      dates, sets = get_activity_stats(activity)
      show_bar_chart(activity, dates, sets)
    else:
      print("Invalid option")
    option = get_menu_option()

if __name__ == "__main__":
  main()
```

This is already quite a decent functioning mini-application, and it is starting to give me significant ideas on how a more fully fledged system could work in the future.
