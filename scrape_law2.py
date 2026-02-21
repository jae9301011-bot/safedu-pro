import urllib.request
import ssl
import json
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# We use the open API for the law.go.kr if possible, otherwise we scrape
# Let's try getting the text of the actual document frame which contains the content
url = "https://www.law.go.kr/LSW//lsInfoP.do?lsiSeq=280187&chrClsCd=010202&urlMode=lsInfoP&efYd=20251201&ancYnChk=0"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    print("Main page fetched")
    # Actually, the content is in lsInfoP.do, but we need the text of that frame
    soup = BeautifulSoup(html, 'html.parser')
    iframe = soup.find('iframe', id='lawService')
    if iframe:
        src = iframe['src']
        full_src = "https://www.law.go.kr" + src
        print("Iframe src:", full_src)
        req2 = urllib.request.Request(full_src, headers={'User-Agent': 'Mozilla/5.0'})
        html2 = urllib.request.urlopen(req2, context=ctx).read().decode('utf-8')
        soup2 = BeautifulSoup(html2, 'html.parser')
        # print excerpt
        print(soup2.get_text('\n', strip=True)[:1000])
except Exception as e:
    print(e)
