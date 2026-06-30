import re

def fix_awards(file):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    content = re.sub(r'⭐\s*CERTIFICATION', 'CERTIFICATION', content)
    content = re.sub(r'🏆\s*AWARD', 'AWARD', content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

fix_awards('about.html')
fix_awards('index.html')
