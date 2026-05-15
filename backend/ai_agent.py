import sys
import json
import re

# This is the "Brain" of the StockSync AI
# It uses Natural Language Understanding (NLU) logic to process queries

def process_message(message):
    message = message.lower()
    
    # 1. Intent: Inventory Check
    if re.search(r'(stock|inventory|how many|quantity)', message):
        if 'kimironko' in message:
            return "Based on my current analysis, Kimironko Branch has 4 active SKUs with sufficient stock levels."
        if 'remera' in message:
            return "Remera Branch is currently managing 6 product categories. Most items are stable, but we should monitor milk levels."
        return "You have stock distributed across 3 main locations. Kimironko and Remera are the most active today."

    # 2. Intent: Sales/Performance
    if re.search(r'(sales|revenue|money|sold|performance)', message):
        return "Total revenue for the current period is trending up by 12% compared to last week. Top mover is the Blue Shirt."

    # 3. Intent: User Management
    if re.search(r'(manager|who is|user|staff)', message):
        if 'kimironko' in message:
            return "Magda Kimironko Manager is the primary authority for the Kimironko Branch."
        if 'remera' in message:
            return "The Remera Branch is managed by the Remera Manager, with Rosette as the Lead Cashier."
        return "We have 5 active user accounts in the system: 1 Admin, 2 Managers, and 2 Cashiers."

    # 4. Intent: Greetings / Identity
    if re.search(r'(hi|hello|hey|who are you)', message):
        return "Hello! I am the StockSync AI Agent. I can help you with inventory statistics, sales reports, and user assignments."

    # Fallback
    return "That's an interesting question. While I'm still learning, I can currently tell you about stock levels, sales performance, or user roles. Try asking 'Who is the manager of Remera?'"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Get message from command line argument
        user_input = sys.argv[1]
        response = process_message(user_input)
        
        # In a real production system, we would connect to the DB here.
        # For the presentation, this logic proves the Python-Node bridge.
        
        print(response)
    else:
        print("No input provided.")
