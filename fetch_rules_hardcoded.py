import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import ssl
import json
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# We know the specific 10 rules the user wants (excluding forest service). 
# There are generally 9-10 standard safety work guidelines published by the Ministry of Employment and Labor:
laws = [
    "가설공사 표준안전 작업지침",
    "굴착공사 표준안전 작업지침",
    "터널공사 표준안전 작업지침-NATM공법",
    "발파 표준안전 작업지침",
    "운반하역 표준안전 작업지침",
    "철골공사 표준안전작업지침",
    "추락재해방지 표준안전작업지침",
    "콘크리트공사 표준안전작업지침",
    "승강기설치 표준안전작업지침" # Adding another common one
]

results = []

for law_name in laws:
    try:
        query = urllib.parse.quote(law_name.encode('euc-kr'))
        url = f"https://www.law.go.kr/admRulSc.do?menuId=5&subMenuId=41&tabMenuId=183&eventGubun=060115&query={query}"
        
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req, context=ctx).read()
        try:
            html = html.decode('utf-8')
        except:
            html = html.decode('euc-kr')

        soup = BeautifulSoup(html, 'html.parser')
        
        # In the search results, the first link with lsInfo usually contains the target ID
        for a in soup.find_all('a'):
            href = a.get('href', '')
            if 'lsInfo' in href and 'javascript' in href:
                # e.g., javascript:lsInfo('2100000000001', '행정규칙');
                match = re.search(r"lsInfo\('(\d+)'", href)
                if match:
                    lsi_seq = match.group(1)
                    results.append({"name": law_name, "seq": lsi_seq})
                    break # Take the first matching one
                
    except Exception as e:
        print(f"Error fetching {law_name}: {e}")

print(f"Successfully found IDs for {len(results)} laws:")
for r in results:
    print(f"- {r['name']}: {r['seq']}")

with open('/Users/jaeyoung/Desktop/projects/safeedu-pro/rules_list.json', 'w') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

