import re
c = open('index.html', encoding='utf-8').read()
css = re.search(r'<style>.*?</style>', c, re.DOTALL)
if css:
    css_text = css.group(0)
    for line in css_text.split('\n'):
        if 'course' in line:
            print(line)
