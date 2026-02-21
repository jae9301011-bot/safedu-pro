import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://www.law.go.kr/DRF/lawService.do?OC=test&target=law&LSI_SEQ=280187&type=XML"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    xml_data = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    lines = xml_data.split('\n')
    
    target_articles = ['제38조', '제69조', '제142조', '제200조', '제332조']
    
    in_target = False
    current_target = None
    
    for line in lines:
        for t in target_articles:
            if f"<조문번호>{t.replace('제', '').replace('조', '')}</조문번호>" in line:
                in_target = True
                current_target = t
                print(f"\n--- {current_target} ---")
                
        if in_target:
            clean_line = line.strip().replace('<![CDATA[', '').replace(']]>', '')
            # strip xml tags
            import re
            clean_line = re.sub('<[^<]+>', '', clean_line)
            if clean_line:
                print(clean_line)
                
            if "</조문단위>" in line:
                in_target = False
                current_target = None

except Exception as e:
    print("Error:", e)
