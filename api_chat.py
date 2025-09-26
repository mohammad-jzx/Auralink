from openai import OpenAI
import os, sys

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def ask(prompt: str):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500,
    )
    return response.choices[0].message.content

if __name__ == "__main__":
    if len(sys.argv) > 1:
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            user_input = f.read()
        reply = ask(user_input)
        print("\n🤖 الرد:\n")
        print(reply)

        # احفظ الرد في ملف
        with open("output.txt", "w", encoding="utf-8") as out:
            out.write(reply)
    else:
        print("❌ لازم تمرر اسم ملف فيه البرومبت. مثال:")
        print("python api_chat.py prompt.txt")
