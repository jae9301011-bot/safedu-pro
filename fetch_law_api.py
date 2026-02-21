import urllib.request
import xml.etree.ElementTree as ET
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# ID 280187 is for 산업안전보건기준에 관한 규칙
url = "https://www.law.go.kr/DRF/lawService.do?OC=test&target=law&LSI_SEQ=280187&type=XML"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    xml_data = urllib.request.urlopen(req, context=ctx).read()
    root = ET.fromstring(xml_data)
    
    target_articles = ['38', '69', '142', '200', '332']
    
    # The structure usually has <조문> -> <조문단위> -> <조문내용>, <항> 등을 포함
    for jomun in root.iter('조문단위'):
        jomun_no = jomun.findtext('조문번호')
        if jomun_no in target_articles:
            print(f"\n--- 제{jomun_no}조 ---")
            content = jomun.findtext('조문내용')
            print(content)
            for hang in jomun.iter('항'):
                hang_content = hang.findtext('항내용')
                if hang_content: print(hang_content)
                for ho in hang.iter('호'):
                    ho_content = ho.findtext('호내용')
                    if ho_content: print(ho_content)
                    for mok in ho.iter('목'):
                        mok_content = mok.findtext('목내용')
                        if mok_content: print(mok_content)
            
            # Sometimes it's structured differently
            if not content:
                print(ET.tostring(jomun, encoding='unicode'))

except Exception as e:
    print("Error:", e)

