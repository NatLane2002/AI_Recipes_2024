# Authorization: Bearer "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"

import os
os.environ["OPENAI_API_KEY"] = "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"

from openai import OpenAI

client = OpenAI(
    organization='org-0QPnRWjgUs78prdmxtveLD0Q',
)

# Ask the user what their favourite food is using python and save it to a variable
food = input("What is your favourite food? ")

response = client.chat.completions.create(
model="gpt-3.5-turbo",
messages=[
    {"role": "user", "content": "Please give me one fact about " + food + ". If " + food + "is not a legitimate food, please just return me the word 'invalid'."},
]
)

content = response.choices[0].message.content
totalTokensUsed = response.usage.total_tokens

print("\n")
print("FACT")
print("----")
print(content)
print("Total Tokens Used:", totalTokensUsed)
print("---------------------")