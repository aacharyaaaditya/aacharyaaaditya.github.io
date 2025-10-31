---
layout: page
title: Test
permalink: /test/
---
<style>
  .postcard {
    border: 1px solid #ddd;
    padding: 16px;
    margin-bottom: 24px;
    border-radius: 4px;
    background: #fff;
    font-family: sans-serif;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
  }

  .postcard:hover { transform: translateY(-2px); }
  .postcard-content { flex: 1; }

  /* Thumbnail styles */
  .postcard img {
    width: 200px;
    height: 140px;
    object-fit: cover;
    border: 1px solid #aaa;
    border-radius: 2px;
    flex-shrink: 0;
    transition: transform 0.3s ease;
    display: block; /* important */
  }

  .postcard img:hover { transform: scale(1.05); }

  /* Post titles */
  .postcard-content h4 { margin: 0 0 6px; font-size: 18px; color: #1e3a8a; }
  .postcard-content h4 a { color: #1e3a8a; text-decoration: none; }
  .postcard-content h4 a:hover { text-decoration: underline; }

  /* Divider below title */
  .divider { height: 1px; background: #e53935; margin: 8px 0; }

  .meta { font-size: 13px; color: #666; margin-bottom: 10px; }
  .meta a { color: #1e3a8a; text-decoration: none; }

  .summary { font-size: 14px; margin-bottom: 12px; color: #333; }

  .categories-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .category-label { font-size: 13px; color: #555; font-style: italic; white-space: nowrap; }

  .category-tag {
    border: 2px solid #444;
    padding: 2px 6px;
    font-size: 12px;
    color: #333;
    text-decoration: none;
    text-transform: capitalize;
    border-radius: 2px;
    background-color: #fff;
    display: inline-block; /* ensures links are clickable */
    transition: border-color 0.3s ease;
    cursor: pointer;
  }

  .wp-heading { font-family: sans-serif; font-size: 18px; color: #1e3a8a; margin: 32px 0 24px; text-align: left; display: inline-block; border-bottom: none; padding-bottom: 3px; line-height: 1.3; }
</style>

<div id="wp-latest-posts"></div>

<script>
(function() {
  const container = document.getElementById('wp-latest-posts');
  const feed = 'https://aacharyaaaditya.wordpress.com/feed/';

  const categoryColorMap = {};
  let hueIndex = 0;

  function getCategoryColor(name) {
    if (categoryColorMap[name]) return categoryColorMap[name];
    const hue = (hueIndex * 137.508) % 360; // golden angle
    hueIndex++;
    const color = `hsl(${hue}, 70%, 50%)`;
    categoryColorMap[name] = color;
    return color;
  }

  fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed))
    .then(response => response.json())
    .then(data => {
      if (!data.items || data.items.length === 0) {
        container.innerHTML = "<p>No posts found.</p>";
        return;
      }

      data.items.slice(0, 5).forEach(item => {
        const postDiv = document.createElement('div');
        postDiv.className = 'postcard';

        const imgSrc = item.thumbnail || 'https://via.placeholder.com/200x140?text=No+Image';
        const img = `<a href="${item.link}" target="_blank"><img src="${imgSrc}" alt="Thumbnail"></a>`; // clickable

        const title = `<h4><a href="${item.link}" target="_blank">${item.title}</a></h4>`;
        const divider = `<div class="divider"></div>`;

        const pubDate = new Date(item.pubDate);
        const meta = `
          <div class="meta">
            By <a href="https://aacharyaaaditya.wordpress.com/author/aacharyaaaditya/" target="_blank">Aditya Acharya</a>
            on ${pubDate.toDateString()}
          </div>`;

        const plainText = item.description.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ');
        const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [];
        const summaryText = sentences.slice(0, 3).join(' ').trim() || plainText.split(' ').slice(0, 40).join(' ') + '...';
        const summary = `<div class="summary">${summaryText}</div>`;

        const categoryLabel = `<span class="category-label">More by the author in</span>`;
        const categoryLinks = (item.categories || []).slice(0, 2).map(catName => {
          const slug = encodeURIComponent(catName.toLowerCase().replace(/\s+/g, '-'));
          const url = `https://aacharyaaaditya.wordpress.com/category/${slug}/`;
          const color = getCategoryColor(catName);
          const style = `border-color: ${color};`;
          return `<a class="category-tag" style="${style}" href="${url}" target="_blank">${catName}</a>`;
        }).join('');

        const cats = `<div class="categories-row">${categoryLabel}${categoryLinks}</div>`;

        // Important: append content first, then image to avoid overlapping links
        postDiv.innerHTML = `<div class="postcard-content">${title + divider + meta + summary + cats}</div>` + img;
        container.appendChild(postDiv);
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = `<p>Error loading posts.</p>`;
    });
})();
</script>

I can simply write here, right?
