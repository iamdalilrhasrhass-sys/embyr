"""
LinkedIn signup debug - see the actual page structure
"""
import asyncio
from playwright.async_api import async_playwright

EMAIL = "embyrpromo1779557374@wshu.net"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        await page.goto("https://www.linkedin.com/signup", wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(3)
        print(f"URL: {page.url}")
        await page.screenshot(path="/tmp/li_debug_1.png")
        
        # Get all interactive elements
        all_els = await page.evaluate("""
            () => {
                const els = document.querySelectorAll('input, button, a, select, [role=button], [tabindex]');
                return Array.from(els).slice(0,30).map(el => ({
                    tag: el.tagName,
                    type: el.type || '',
                    name: el.name || '',
                    id: el.id || '',
                    text: (el.textContent || '').trim().slice(0,30),
                    visible: el.offsetParent !== null,
                    class: (el.className || '').slice(0,40)
                }));
            }
        """)
        for el in all_els:
            v = "✓" if el['visible'] else "✗"
            print(f"  [{v}] <{el['tag']}> type={el['type']} name={el['name']} txt='{el['text']}'")
        
        # Now click the email field and see if things change
        email_input = await page.query_selector("input[name=email-address]")
        if email_input:
            await email_input.click()
            await email_input.fill(EMAIL)
            print(f"\nEmail filled: {EMAIL}")
            await asyncio.sleep(1)
            
            # Check for submit/continue button
            buttons = await page.evaluate("""
                () => {
                    const btns = document.querySelectorAll('button');
                    return Array.from(btns).map(b => ({
                        text: (b.textContent || '').trim().slice(0,30),
                        type: b.type || '',
                        visible: b.offsetParent !== null,
                        disabled: b.disabled
                    }));
                }
            """)
            print("\nButtons after email fill:")
            for b in buttons:
                v = "✓" if b['visible'] else "✗"
                d = " [disabled]" if b['disabled'] else ""
                print(f"  [{v}] '{b['text']}' type={b['type']}{d}")
            
            # Click the submit button
            submit = await page.query_selector("button[type=submit]")
            if submit:
                await submit.click()
                print("\nSubmit clicked!")
                await asyncio.sleep(3)
                print(f"URL: {page.url}")
                await page.screenshot(path="/tmp/li_debug_2.png")
                
                # Check what's visible now
                visible_els = await page.evaluate("""
                    () => {
                        const els = document.querySelectorAll('input, button');
                        return Array.from(els).filter(el => el.offsetParent !== null).map(el => ({
                            tag: el.tagName,
                            type: el.type || '',
                            name: el.name || '',
                            id: el.id || '',
                            text: (el.textContent || '').trim().slice(0,30),
                            placeholder: el.placeholder || el.getAttribute('aria-label') || ''
                        }));
                    }
                """)
                print(f"\nVisible elements after submit ({len(visible_els)}):")
                for el in visible_els:
                    print(f"  <{el['tag']}> type={el['type']} name={el['name']} ph='{el['placeholder']}'")
            else:
                print("\nNo submit button found")
        
        await browser.close()

asyncio.run(main())
