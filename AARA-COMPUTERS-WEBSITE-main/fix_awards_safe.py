def fix_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # The exact string in the HTML is '⭐  CERTIFICATION' (with two spaces)
    # We will just replace it entirely. Also handle '⭐ CERTIFICATION'.
    # And handle '🏆 AWARD'
    content = content.replace('⭐  CERTIFICATION', 'CERTIFICATION')
    content = content.replace('⭐ CERTIFICATION', 'CERTIFICATION')
    content = content.replace('🏆 AWARD', 'AWARD')
    content = content.replace('🏆  AWARD', 'AWARD')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('about.html')
fix_file('index.html')
