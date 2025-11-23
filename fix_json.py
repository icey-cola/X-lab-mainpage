
import json
import os

filepath = 'data/publications.json'
if not os.path.exists(filepath):
    print(f"File not found: {filepath}")
    exit(1)

with open(filepath, 'rb') as f:
    data = f.read()

# Replacements map
replacements = {
    b'\xe5\x87?': b'\xe5\x87\xba',       # 出
    b'\xe3\x80?': b'\xe3\x80\x82\x22',   # 。"
    b'\xef\xbc?': b'\xef\xbc\x89\x22',   # ）"
    b'\xe6\xb5?': b'\xe6\xb5\x81',       # 流
    b'\xe6\xa0?': b'\xe6\xa0\xbc',       # 格
    b'\xe7\x9a?': b'\xe7\x9a\x84',       # 的
    b'\xe4\xb8?': b'\xe4\xb8\x8e'        # 与
}

count = 0
for bad, good in replacements.items():
    if bad in data:
        c = data.count(bad)
        print(f'Replacing {bad} with {good} ({c} times)')
        data = data.replace(bad, good)
        count += c

if count > 0:
    with open(filepath, 'wb') as f:
        f.write(data)
    print(f'Saved {count} fixes.')
else:
    print('No corruptions found.')

# Verify
try:
    json.loads(data)
    print('JSON is valid now.')
except json.JSONDecodeError as e:
    print(f'JSON still invalid: {e}')
