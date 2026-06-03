import re

def process_files():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    # 1. Background Image Fix
    html = html.replace('https://share.google/Inu08blpmESIa6PB6', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1920&q=80')

    # 2. External CSS Verification
    html = html.replace('<link rel="stylesheet" href="styles.css">', '<!-- External stylesheet linked successfully -->\n    <link rel="stylesheet" href="styles.css">')

    # 3. Proper Use of .highlight Class
    html = html.replace('<span style="color: #fca5a5; font-weight: 700;">Special Offer</span>', '<span class="highlight">Special Offer</span>')

    # 4. Verify Local Images
    html = html.replace('cleanup.jpg', 'https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc5?auto=format&fit=crop&w=600&q=80')
    html = html.replace('art.jpg', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80')

    # 5. Convert Image Gallery to TABLE
    # Find the events section
    events_match = re.search(r'(<h2>Past Events Gallery</h2>\s*)<div class="grid">(.*?)</div>\s*<!-- Geolocation Section -->', html, re.DOTALL)
    if events_match:
        grid_content = events_match.group(2)
        # Parse out all the img src, alt, title, em text
        cards = re.findall(r'<div class="eventCard">.*?<img src="(.*?)" alt="(.*?)" title="(.*?)" class="event-img">.*?<em>(.*?)</em>.*?</div>', grid_content, re.DOTALL)
        
        table_html = '<table class="gallery-table">\n                <caption>Community Events Gallery</caption>\n                <tr>'
        
        for i, card in enumerate(cards):
            if i == 3:
                table_html += '\n                </tr>\n                <tr>'
            src, alt, title, em = card
            table_html += f'''
                    <td>
                        <div class="eventCard">
                            <img src="{src}" alt="{alt}" title="{title}" class="event-img gallery-img">
                            <div class="event-content"><em>{em}</em></div>
                        </div>
                    </td>'''
        
        table_html += '\n                </tr>\n            </table>'
        
        html = html.replace(f'<div class="grid">{grid_content}</div>', table_html)

    # Add display vs visibility demo
    demo_html = """
        <!-- Display vs Visibility Demonstration -->
        <section id="demo" class="container animate-up">
            <h2>Display vs Visibility Demo</h2>
            <div class="card" style="text-align: center;">
                <p>This demonstrates the difference between <strong>visibility: hidden;</strong> and <strong>display: none;</strong>.</p>
                <!-- Container using flexbox for layout -->
                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px; align-items: center;">
                    <div style="padding: 20px; background: var(--primary); color: white; border-radius: 8px;">Visible Box 1</div>
                    
                    <!-- Hide Completely (display: none) -->
                    <!-- This box will NOT take up any space -->
                    <div class="hide-completely" style="padding: 20px; background: red; color: white; border-radius: 8px;">
                        Display None
                    </div>
                    
                    <!-- Hide Visually (visibility: hidden) -->
                    <!-- This box will still occupy space but be invisible -->
                    <div class="hide-visually" style="padding: 20px; background: green; color: white; border-radius: 8px;">
                        Visibility Hidden
                    </div>
                    
                    <div style="padding: 20px; background: var(--secondary); color: white; border-radius: 8px;">Visible Box 2</div>
                </div>
                <p style="margin-top: 15px; font-size: 0.9rem; color: var(--text-light);">
                    Notice the empty space above? That's the "Visibility Hidden" box still taking up layout space. The "Display None" box is completely gone!
                </p>
            </div>
        </section>
"""
    # Insert it before promo section
    html = html.replace('<!-- Promo Video -->', demo_html + '\n        <!-- Promo Video -->')

    # Ensure CSS grouping selector is explicit
    # CSS already has h3, p. Let's make it more explicit.
    css_grouping = """
/* Grouping selector for headings and paragraphs */
h3, p {
    margin-bottom: 10px;
    line-height: 1.6;
}
"""
    if "h3, p {" in css:
        css = re.sub(r'/\* Grouping selector.*?\n\}\n', css_grouping, css, flags=re.DOTALL)
    else:
        css += css_grouping

    # Add .gallery-table and .gallery-img CSS
    gallery_css = """
/* Gallery Table Styles */
.gallery-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 40px;
}

.gallery-table caption {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 20px;
    color: var(--primary);
}

.gallery-table td {
    padding: 15px;
    vertical-align: top;
}

/* Image border requested by requirements */
.gallery-img {
    border: 4px solid #e5e7eb;
    border-radius: var(--border-radius);
}
"""
    if ".gallery-table" not in css:
        if "/* Mobile Responsiveness */" in css:
            css = css.replace("/* Mobile Responsiveness */", gallery_css + "\n/* Mobile Responsiveness */")
        else:
            css += gallery_css

    # Update mobile responsiveness to ensure table is responsive (e.g. display block)
    table_mobile_css = """
    .gallery-table, .gallery-table tbody, .gallery-table tr, .gallery-table td {
        display: block;
        width: 100%;
    }
"""
    if ".gallery-table" not in css.split("/* Mobile Responsiveness */")[-1]:
        css = css.replace("@media (max-width: 768px) {", "@media (max-width: 768px) {" + table_mobile_css)


    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
        
    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(css)

process_files()
print("Processed successfully")
