import urllib.request
import ssl
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=280187&chrClsCd=010202&urlMode=lsInfoP&efYd=20251201&ancYnChk=0"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    iframe = soup.find('iframe', id='lawService')
    if iframe:
        src = iframe['src']
        full_src = "https://www.law.go.kr" + src
        print("Iframe src:", full_src)
        req2 = urllib.request.Request(full_src, headers={'User-Agent': 'Mozilla/5.0'})
        html2 = urllib.request.urlopen(req2, context=ctx).read().decode('utf-8')
        soup2 = BeautifulSoup(html2, 'html.parser')
        
        # The actual content in law.go.kr is usually inside a specific div or id like 'conScroll' or 'lawCon'
        # Let's just output text that contains specific article strings
        text = soup2.get_text('\n', strip=True)
        # We need to find articles 38, 69, 142, 200, 332
        articles = ['제38조(사전조사', '제69조(시스템 비계의 구조)', '제142조(타워크레인의 작업제한)', '제200조(접촉의 방지)', '제332조(거푸집동바리등의 안전조치)']
        for a in articles:
            idx = text.find(a)
            if idx != -1:
                print(f"--- FOUND {a} ---")
                print(text[idx:idx+800]) # print 800 chars
            else:
                print(f"--- MISSING {a} ---")
                
except Exception as e:
    print(e)
