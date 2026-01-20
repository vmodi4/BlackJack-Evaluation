# for now just have ace = 11
import random

# make this an api and then create a simple front end

# let's create a map:

card_map = {
    "A": [1, 11],
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 10,
    "Q": 10,
    "K": 10,
}

# Reverse map: from numbers to card letters
reverse_card_map = {
    1: "A",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "A",  # Since Ace can also be 11
}


first_num = random.randint(1, 11)
second_num = random.randint(1, 11)

user_input = input("Do you want to play Blackjack? (y/n): ")
if user_input.lower() == 'y':
    first_card = reverse_card_map[first_num] 
    second_card = reverse_card_map[second_num]
    current_total = first_num + second_num
    
    t




print(f"Your first two cards are : {first_card}")
