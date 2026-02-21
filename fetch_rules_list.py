import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import ssl
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Query the main search page
query = "표준안전작업지침"
enc_query = urllib.parse.quote(query.encode('euc-kr'))

# This URL searches for administrative rules (target=admrul)
url = f"https://www.law.go.kr/admRulSc.do?menuId=5&subMenuId=41&tabMenuId=183&eventGubun=060115&query={enc_query}"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, context=ctx).read()
    try:
        html = html.decode('utf-8')
    except:
        html = html.decode('euc-kr')

    soup = BeautifulSoup(html, 'html.parser')
    
    # In law.go.kr, search results are often in a list format
    # We will search the DOM for a tags that link to the documents, extracting title and the lsiSeq
    rules = []
    
    # example: <a href="javascript:lsInfo('2100000000001', '행정규칙');">크레인작업 표준안전작업지침</a>
    # or it might be in an iframe
    for a in soup.find_all('a'):
        text = a.get_text(strip=True)
        if '표준안전작업지침' in text:
            # check the context to exclude 산림청고시. the department is usually in the next td or span
            rules.append(text)
            
    print(f"Found {len(rules)} items. First 5:", rules[:5])
    
except Exception as e:
    print("Error:", e)
