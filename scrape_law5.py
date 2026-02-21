import urllib.request
import ssl
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Try another endpoint that often returns the plain text or HTML body directly
url = "https://www.law.go.kr/LSW/lsBdtContents.do?lsiSeq=280187"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, context=ctx).read()
    # sometimes it's euc-kr encoded
    try:
        html_str = html.decode('utf-8')
    except:
        html_str = html.decode('euc-kr')
        
    soup = BeautifulSoup(html_str, 'html.parser')
    text = soup.get_text('\n', strip=True)
    
    articles = ['제38조(사전조사', '제69조(시스템 비계의 구조)', '제142조(타워크레인의 작업제한)', '제200조(접촉의 방지)', '제332조(거푸집동바리등의 안전조치)']
    for a in articles:
        idx = text.find(a)
        if idx != -1:
            print(f"\n--- FOUND {a} ---")
            print(text[idx:idx+400]) # print 400 chars
        else:
            print(f"--- MISSING {a} ---")

except Exception as e:
    print("Error:", e)
