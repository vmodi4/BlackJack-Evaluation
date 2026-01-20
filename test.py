# for now just have ace = 11
import random

# make this an api and then create a simple front end

# let's create a map:

# probably need to make some global variables for handling the game state? 

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


#first_num = random.randint(1, 11)
#second_num = random.randint(1, 11)

def dealer_card(): 
    dealer_num = random.randint(1, 11)
    dealer_card = reverse_card_map[dealer_num]
    print(f"Dealer's first card is: {dealer_card}")
    return dealer_num

def play_blackjack():
    # have a while loop here to keep playing
    # while True: 
    return 5 

def hit():
    user_input = input("Do you want to hit? (y/n): ")
    if user_input.lower() == 'y':
        new_card_num = random.randint(1, 11)
        new_card = reverse_card_map[new_card_num]
        print(f"You drew a {new_card}")
        return new_card_num
    else:
        return 0
    
    



def first_cards():
    first_num = random.randint(1, 11)
    second_num = random.randint(1, 11)
    first_card = reverse_card_map[first_num] 
    second_card = reverse_card_map[second_num]
    print(f"Your first two cards are : {first_card} and {second_card}")
    current_total = first_num + second_num
    print(f"Your current total is: {current_total}")

user_input = input("Do you want to play Blackjack? (y/n): ")
if user_input.lower() == 'y':
   # probably should break it down it even more modularity to have a play game funciton
   first_cards()
   dealer_card()
   
   
   
   
    
    
    






