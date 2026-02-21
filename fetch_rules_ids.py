import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Let's try the lawSearch.do endpoint again with target=admrul
url = "https://www.law.go.kr/DRF/lawSearch.do?OC=test&target=admrul&type=XML&query=" + urllib.parse.quote('표준안전작업지침')

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    xml_data = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    import xml.etree.ElementTree as ET
    root = ET.fromstring(xml_data)
    
    for item in root.findall('admRul'):
        name = item.find('admRulNm').text if item.find('admRulNm') is not None else ''
        seq = item.find('admRulSeq').text if item.find('admRulSeq') is not None else ''
        prc_nm = item.find('admRulInfoPrcNm').text if item.find('admRulInfoPrcNm') is not None else ''
        
        if '산림' not in prc_nm:
            print(f"- {name} ({seq})")
            
except Exception as e:
    print("Error:", e)
