import os

def fix_checkout_disclaimer():
    path = r'c:\Users\shreyas\ss-photo-films\app\checkout\[id]\page.tsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the secure payment div and add the note
    old_div = """                  <div className="flex items-center justify-center gap-3 py-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">100% Safe & Secure Payment</span>
                  </div>"""

    new_div = """                  <div className="flex flex-col items-center gap-3 py-4 border-t border-dark/5 mt-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">100% Safe & Secure Payment</span>
                    </div>
                    <p className="text-[10px] text-dark/40 font-bold uppercase tracking-widest text-center leading-relaxed">
                      * All bookings are subject to final approval within 24 hours. <br/>
                      Full refund will be issued if the slot is not available or rejected.
                    </p>
                  </div>"""

    if old_div in content:
        content = content.replace(old_div, new_div)
    else:
        # fallback if whitespace differs
        content = content.replace('100% Safe & Secure Payment</span>', '100% Safe & Secure Payment</span>\\n                    </div>\\n                    <p className="text-[10px] text-dark/40 font-bold uppercase tracking-widest text-center leading-relaxed">\\n                      * All bookings are subject to final approval within 24 hours. <br/>\\n                      Full refund will be issued if the slot is not available or rejected.\\n                    </p>')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Adjusted checkout disclaimer via Python.")

if __name__ == "__main__":
    fix_checkout_disclaimer()
