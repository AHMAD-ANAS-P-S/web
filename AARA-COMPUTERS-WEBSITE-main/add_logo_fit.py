import re

def process_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # The user wants to add 'logo-fit' class to specific course cards.
    # We will find the course card block by identifying the title <h3> inside it.
    
    courses_to_fix = [
        "Office Automation",
        "Designing with Printing",
        "Java Programming",
        "Python Programming"
    ]

    # Regex to match the course card wrapper
    # We'll use a function to replace it
    def add_class(match):
        card_html = match.group(0)
        # Check if the title inside this card matches one of the problematic courses
        is_problematic = False
        for title in courses_to_fix:
            if title in card_html:
                is_problematic = True
                break
        
        if is_problematic and 'logo-fit' not in card_html:
            # Replace class="course-card reveal" with class="course-card logo-fit reveal"
            card_html = re.sub(r'class="course-card\b', 'class="course-card logo-fit', card_html, count=1)
        
        return card_html

    # This regex matches a course-card div and everything up to the <h3> tag.
    # But a cleaner way is to just do a block replacement since HTML is regular enough.
    
    # We can split by <div class="course-card
    parts = content.split('<div class="course-card')
    new_content = parts[0]
    
    for i in range(1, len(parts)):
        part = parts[i]
        is_problematic = False
        for title in courses_to_fix:
            if title in part:
                is_problematic = True
                break
        
        if is_problematic and 'logo-fit' not in part:
            # part is the rest of the div. We prepend the class back.
            # Usually it's ` reveal"` or similar. We add `logo-fit ` right after `course-card `.
            # Because we split by `<div class="course-card`, the next string starts with `" ` or ` reveal"`.
            # So we prepend ` logo-fit`
            new_content += '<div class="course-card logo-fit' + part
        else:
            new_content += '<div class="course-card' + part

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(new_content)

process_file('index.html')
process_file('courses.html')
