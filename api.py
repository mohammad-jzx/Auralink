from openai import OpenAI
import os

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="gpt-4o-mini",   # غيّرها لموديل مدعوم عندك
    messages=[
        {"role": "system", "content": "You are a helpful assistant that writes clean Python code."},
        {"role": "user", "content": "اكتب كود بايثون يطبع Hello World"}
    ],
    max_tokens=200,
)

print(response.choices[0].message.content)
