# Rebuilds the last module block of index.html from the module files in this folder.
# Everything from the marker "// ---------- Nov 22 (night): the final moves" to the next </script> is replaced by
# wed1122.js + nov23.js + nov24.js + nov24b.js (in this order). Run from anywhere: python3 build/insert23.py
import os
here = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(here, '..', 'index.html'); s = open(p, encoding='utf-8').read()
m = '\n'.join(open(os.path.join(here, f), encoding='utf-8').read() for f in ['wed1122.js', 'nov23.js', 'nov24.js', 'nov24b.js'])
start = s.index('// ---------- Nov 22 (night): the final moves'); end = s.index('</script>', start)
s = s[:start] + m + '\n' + s[end:]
open(p, 'w', encoding='utf-8').write(s)
print('inserted', len(m), 'characters')
