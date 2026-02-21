import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def get_guidelines():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    driver = webdriver.Chrome(options=options)
    
    # URL for searching administrative rules
    url = "https://www.law.go.kr/admRulSc.do?menuId=5&subMenuId=41&tabMenuId=183&eventGubun=060115"
    
    try:
        driver.get(url)
        
        # We need to search for '표준안전작업지침'
        search_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "query"))
        )
        search_input.clear()
        search_input.send_keys("표준안전작업지침")
        
        search_btn = driver.find_element(By.CSS_SELECTOR, "a.btn_search")
        search_btn.click()
        
        # Wait for the results to load (wait for the list table)
        time.sleep(3)
        
        # Let's extract all the titles and their JS link to get the lsiSeq
        results = []
        links = driver.find_elements(By.CSS_SELECTOR, "a[href*='lsInfo']")
        for link in links:
            text = link.text.strip()
            href = link.get_attribute("href")
            
            # The row usually contains the department, let's just get everything containing '표준안전작업지침'
            if '표준안전작업지침' in text:
                # To filter out '산림청고시', we can try to find '산림청' in the row's text
                try:
                    row_text = link.find_element(By.XPATH, "./ancestor::tr").text
                    if '산림청' in row_text:
                        continue
                except:
                    pass
                
                results.append({"title": text, "href": href})
                
        print(f"Found {len(results)} target rules.")
        for r in results:
            print(f"- {r['title']}")
            
        with open('/Users/jaeyoung/Desktop/projects/safeedu-pro/rules_list.json', 'w') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

    except Exception as e:
        print("Error:", e)
    finally:
        driver.quit()

if __name__ == "__main__":
    get_guidelines()
