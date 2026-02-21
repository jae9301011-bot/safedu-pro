import urllib.request
import xml.etree.ElementTree as ET
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://www.law.go.kr/DRF/lawService.do?OC=test&target=law&LSI_SEQ=280187&type=XML"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    xml_data = urllib.request.urlopen(req, context=ctx).read()
    root = ET.fromstring(xml_data)
    
    target_articles = ['38', '69', '142', '200', '332']
    
    # iterate over all elements to find <조문내용> where <조문번호> matches
    for jomun in root.iter('조문단위'):
        jomun_no = jomun.findtext('조문번호')
        if jomun_no in target_articles:
            print(f"\n--- 제{jomun_no}조 ---")
            
            # Print the title if available
            title = jomun.findtext('조문제목')
            if title:
                print(f"제{jomun_no}조({title})")
                
            content = jomun.findtext('조문내용')
            if content: print(content)
            
            # Iterate through child elements to piece together the entire article
            for elem in jomun:
                if elem.tag == '항':
                    hang_content = elem.findtext('항내용')
                    if hang_content: print(hang_content)
                    for ho in elem.findall('호'):
                        ho_content = ho.findtext('호내용')
                        if ho_content: print(ho_content)
                        for mok in ho.findall('목'):
                            mok_content = mok.findtext('목내용')
                            if mok_content: print(mok_content)
                elif elem.tag == '호':
                    ho_content = elem.findtext('호내용')
                    if ho_content: print(ho_content)
                    for mok in elem.findall('목'):
                        mok_content = mok.findtext('목내용')
                        if mok_content: print(mok_content)

except Exception as e:
    print("Error:", e)
