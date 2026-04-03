import os

def fix_booking_mobile():
    path = r'c:\Users\shreyas\ss-photo-films\app\booking\page.tsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Title size fix
    content = content.replace('className="text-5xl md:text-7xl lg:text-8xl', 'className="text-4xl md:text-7xl lg:text-8xl')
    
    # Sticky fix
    content = content.replace('className="sticky top-40 space-y-6"', 'className="lg:sticky lg:top-40 space-y-6"')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Adjusted booking page for mobile.")

if __name__ == "__main__":
    fix_booking_mobile()
