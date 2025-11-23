import json
import os

filepath = 'data/publications.json'
backup_path = 'data/publications.json.bak'

# Create backup
if not os.path.exists(backup_path):
    try:
        with open(filepath, 'rb') as f:
            with open(backup_path, 'wb') as out:
                out.write(f.read())
        print('Backup created.')
    except FileNotFoundError:
        print('File not found.')
        exit(1)

with open(filepath, 'rb') as f:
    data = f.read()

# Patch 1: Fix Chinese period + missing quote
# \xe3\x80? -> \xe3\x80\x82 (。)
# And add missing quote if followed by comma
# Pattern: \xe3\x80?, -> \xe3\x80\x82",
data = data.replace(b'\xe3\x80?,', b'\xe3\x80\x82",')

# Patch 2: Fix Chinese closing parenthesis + missing quote
# \xef\xbc? -> \xef\xbc\x89 (）)
# Pattern: \xef\xbc?, -> \xef\xbc\x89",
data = data.replace(b'\xef\xbc?,', b'\xef\xbc\x89",')

# Patch 3: Fix specific known corruptions inside strings
# \xe5\x87? -> \xe5\x87\xba (出)
data = data.replace(b'\xe5\x87?', b'\xe5\x87\xba')
# \xe6\xb5? -> \xe6\xb5\x81 (流)
data = data.replace(b'\xe6\xb5?', b'\xe6\xb5\x81')
# \xe6\xa0? -> \xe6\xa0\xbc (格)
data = data.replace(b'\xe6\xa0?', b'\xe6\xa0\xbc')
# \xe7\x9a? -> \xe7\x9a\x84 (的)
data = data.replace(b'\xe7\x9a?', b'\xe7\x9a\x84')
# \xe4\xb8? -> \xe4\xb8\x8e (与)
data = data.replace(b'\xe4\xb8?', b'\xe4\xb8\x8e')

# Write back
with open(filepath, 'wb') as f:
    f.write(data)

print('Patched file.')

# Verify
try:
    with open(filepath, 'r', encoding='utf-8') as f:
        json.load(f)
    print('SUCCESS: JSON is now valid.')
except json.JSONDecodeError as e:
    print(f'ERROR: Still invalid JSON: {e}')
    # Show context of error
    with open(filepath, 'rb') as f:
        d = f.read()
    start = max(0, e.pos - 20)
    end = min(len(d), e.pos + 20)
    print(f'Context: {d[start:end]}')
