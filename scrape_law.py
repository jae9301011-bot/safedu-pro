import urllib.request
import ssl
from bs4 import BeautifulSoup
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://www.law.go.kr/LSW//lsInfoP.do?lsiSeq=280187&chrClsCd=010202&urlMode=lsInfoP&efYd=20251201&ancYnChk=0"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        html = response.read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        
        # Look for articles 69, 142, 38, 332, 200
        articles_to_find = ['제38조', '제69조', '제142조', '제200조', '제332조']
        
        # It's a complex DOM, let's just extract all text and search via regex
        text = soup.get_text('\n', strip=True)
        
        for article in articles_to_find:
            print(f"\n--- {article} ---")
            # a simple regex to capture the article down to the next article
            pattern = re.compile(rf"({article}\(.*?)(?=제\d+조\()", re.DOTALL)
            match = pattern.search(text)
            if match:
                # Print first 500 chars of the article
                print(match.group(1)[:500])
            else:
                print("Not found")

except Exception as e:
    print(e)
