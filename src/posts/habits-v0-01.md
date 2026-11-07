---
title: "Habits v0.01"
date: 2023-01-01T03:50:16Z
categories: [habits, short, technology]
---

So I recently wrote an initial version of Habits with a few restrictions:

-   It is a command-line only application.
-   It only tracks one habit: squats

![](/media/2023/01/Screenshot-2023-01-01-at-11.44.07-AM.png)

This is a relatively simple application, which I will reproduce below with comments:

```
import csv
import datetime
import matplotlib.pyplot as plt

# This function writes a date and number of squats for each set to the squats.csv file
def track_squats(date, sets):
  # Open the squats.csv file in append mode
  with open('squats.csv', 'a', newline='') as csvfile:
    # Create a writer object for writing to the file
    squat_writer = csv.writer(csvfile, delimiter=',')
    # Iterate over the sets and write the date and number of squats for each set
    for s in sets:
      squat_writer.writerow([date, s])

# This function calculates and displays statistics for the squats
def get_squat_stats():
  # Initialize variables for storing the total number of squats and the maximum number of squats
  total_squats = 0
  max_squats = 0
  # Open the squats.csv file in read mode
  with open('squats.csv', 'r') as csvfile:
    # Create a reader object for reading from the file
    squat_reader = csv.reader(csvfile, delimiter=',')
    # Initialize a variable for storing the number of sets
    num_sets = 0
    # Initialize lists for storing the dates and number of squats
    dates = []
    squats = []
    # Iterate over the rows in the file
    for row in squat_reader:
      # Add the number of squats for this set to the total
      total_squats += int(row[1])
      # Update the maximum number of squats if necessary
      max_squats = max(max_squats, int(row[1]))
      # Increment the number of sets
      num_sets += 1
      # Add the date and number of squats for this set to the lists
      dates.append(row[0])
      squats.append(int(row[1]))
  # Calculate the average number of squats per set
  if num_sets > 0:
    avg_squats = total_squats / num_sets
  else:
    avg_squats = 0
  # Display the statistics
  print(f'Total squats: {total_squats}')
  print(f'Average squats per set: {avg_squats:.2f}')
  print(f'Max squats per set: {max_squats}')
  # Return the lists of dates and squats
  return (dates, squats)

# This function creates a bar chart showing the number of squats per date
def show_bar_chart(dates, squats):
  # Create the bar chart using the dates and squats lists
  plt.bar(dates, squats)
  # Set the x-axis label
  plt.xlabel('Date')
  # Set the y-axis label
  plt.ylabel('Squats')
  # Set the title
  plt.title('Squats per Day')
  # Show the chart
  plt.show()

# Get the action from the user
action = input('Enter "input" to input new data, "stats" to view statistics, or "chart" to view data in a bar chart: ')

# Perform the appropriate action
if action.lower() == 'input':
  # Get the date from the user
  date = input('Enter date (YYYY-MM-DD): ')
  # Initialize a list for storing the number of squats for each set
  sets = []
  # Loop until the user is done inputting sets
  while True:
    # Get the number of squats for this set from the user
    num_squats = input('Enter number of squats (or "done" to finish): ')
    # If the user is done, exit the loop
    if num_squats.lower() == 'done':
      break
    # Add the number of squats for this set to the list
    sets.append(int(num_squats))
  # Write the date and number of squats for each set to the squats.csv file
  track_squats(date, sets)
elif action.lower() == 'stats':
  # Calculate and display the squat statistics
  get_squat_stats()
elif action.lower() == 'chart':
  # Calculate the squat statistics and get the lists of dates and squats
  dates, squats = get_squat_stats()
  # Create a bar chart showing the number of squats per date
  show_bar_chart(dates, squats)
else:
  # If the action is not recognized, display an error message
  print('Invalid input')
```

This code is a simple program that allows a user to track their squats, view statistics about their squats, and view a bar chart of their squats over time. The user can input new data by specifying a date and entering the number of squats they performed on that date. When the user selects the “stats” action, the program calculates and displays the total number of squats, the average number of squats per set, and the maximum number of squats per set. When the user selects the “chart” action, the program displays a bar chart showing the number of squats performed on each date.

To track the squats, the program uses a CSV file called “squats.csv” to store the date and number of squats for each set of squats. The program has a function called “track\_squats” that writes the date and number of squats for each set to the CSV file. Another function called “get\_squat\_stats” reads the data from the CSV file and calculates the statistics for the squats. Finally, a function called “show\_bar\_chart” reads the data from the CSV file and creates a bar chart using the matplotlib library.

Of course, we can build up from this in the future.

For example, Habits could allow the user to track multiple habits, such as push-ups or running, in addition to squats. The app could enable users to set goals for each habit and track their progress. It could also provide detailed stats and charts, like a line chart showing progress over time or a pie chart showing activity by day of the week. These features could transform the app into a powerful aid for developing and sustaining healthy habits.

I’ll soon work on a v0.02, and I am sure by the time we get to V1 we will have a decent application on our hands!
