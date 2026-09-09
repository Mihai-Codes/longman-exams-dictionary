import pathlib, re
p = pathlib.Path('/Users/mihai/Glaze/Longman Exams Dictionary/sources/renderer/main/home-view.tsx')
t = p.read_text()
# fix import
t = t.replace('import { useEffect, useState, useMemo, useRef } from "react";',
              'import * as React from "react";\nimport { useEffect, useState, useMemo, useRef } from "react";')
# fix replaceAll with regex -> replace
t = t.replace('.replaceAll(/', '.replace(/')
# also plain replaceAll for string
t = t.replace('.replaceAll("&nbsp;"', '.replace("&nbsp;"')
t = t.replace('.replaceAll("<', '.replace("<')
# fix the remaining replaceAll in examples extraction: there are two .replaceAll there already handled? Actually that one is .replaceAll(/<[^>]+>/g)
# Already handled by first replace, but need to ensure correct
# Ensure no remaining replaceAll
if 'replaceAll' in t:
    print("still replaceAll remains")
    import re as R
    for m in R.finditer(r'replaceAll', t):
        print(t[max(0,m.start()-30):m.end()+30])
else:
    print("no replaceAll")
# Fix empty block at line 247 - look at onClick catch {}
# The linter complained empty block at 247:21 - that's the catch {}
# Replace empty catch with console.warn or toast
t = t.replace('            } catch {}', '            } catch (e) { console.warn(e); }')
p.write_text(t)
print("patched home-view")

p2 = pathlib.Path('/Users/mihai/Glaze/Longman Exams Dictionary/sources/main/handlers/dictionary.ts')
t2 = p2.read_text()
# fix empty block at 125:15
print(t2[2000:3000])
# Find empty block
if 'catch {}' in t2:
    t2 = t2.replace('      } catch {}', '      } catch (e) { logger.warn("dictionary", String(e)); }')
    p2.write_text(t2)
    print("patched dictionary")
print("done")
