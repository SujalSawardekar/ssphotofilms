import os

def fix_booking_file():
    path = r'c:\Users\shreyas\ss-photo-films\app\booking\page.tsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    found = False
    for i in range(len(lines)):
        # Target the Proceed to Pay button based on unique content
        if 'PROCEED TO PAY' in lines[i] and '<button' in lines[i-5]:
            # Backtrack to the <button tag and modify its class and content
            # We already know where it is roughly.
            # lines[i-2] is likely the className
            # lines[i] is the content
            
            # Let's just find the button block and replace it
            # This is safer: replace the line that has 'PROCEED TO PAY' with the new version
            # and modify the line with the className
            for j in range(i-5, i+2):
                if 'rounded-xl' in lines[j] and 'bg-[#4A4D4A]' in lines[j]:
                    lines[j] = lines[j].replace('bg-[#4A4D4A]', 'bg-[#4A4D4A] duration-500 relative overflow-hidden group')
                if 'PROCEED TO PAY' in lines[j]:
                    lines[j] = lines[j].replace('{loading ? "PROCESSING..." : "PROCEED TO PAY"}', 
                                              '<span className="relative z-10 flex items-center justify-center">{loading ? "PROCESSING..." : "PROCEED TO PAY"}</span>\n                          {/* Shimmer Effect */}\n                          <div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />')
            found = True
        new_lines.append(lines[i])
    
    if found:
        with open(path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print("Fixed Booking Page with line-by-line")
    else:
        print("Booking Page button not found via line-by-line")

if __name__ == "__main__":
    fix_booking_file()
