---
layout: page
title: "Articles and blogs"
permalink: /blog/
---

The latest posts from my wordpress blog are fetched here automatically. Clicking the titles below will take you to aacharyaaaditya.wordpress.com urls | तलका लेखहरू aacharyaaaditya.wordpress.com मा लेखिएका हुन् र स्वचालित (अटोमेटिक) रुपमा यहाँ देखिन्छन् ।
<hr>
<p>

<style>
  /* Two-column grid */
  #wp-latest-posts {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @media (max-width: 700px) {
    #wp-latest-posts {
      grid-template-columns: 1fr;
    }
  }

  /* Card container */
  .postcard {
    display: flex;
    flex-direction: row;
    border-radius: 10px;
    overflow: hidden;
    min-height: 200px;
    box-shadow: 4px 4px 12px rgba(0,0,0,0.3);
    transition: transform 0.3s ease;
    background: #fff;
  }

  .postcard:hover {
    transform: translateY(-3px);
  }

  /* Text section (left) */
  .postcard-content {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #222; /* dark background for readability */
    color: #fff;
  }

  .postcard-content h4 {
    font-size: 24px;
    margin: 0 0 8px;
    color: #0073aa;
  }

  .postcard-content h4 a {
    color: #0073aa;
    text-decoration: none;
  }

  .divider {
    height: 2px;
    background: red;
    margin: 8px 0 12px 0;
    width: 60px;
  }

  .meta {
    font-size: 16px;
    color: #f1f1f1;
    margin-bottom: 12px;
  }

  .meta a {
    color: #0073aa;
    text-decoration: none;
    font-weight: 600;
  }

  .summary {
    font-size: 16px;
    color: #f8f8f8;
    line-height: 1.5;
    margin-bottom: 12px;
  }

  .categories-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }

  .category-label {
    font-size: 14px;
    color: #ddd;
    font-style: italic;
  }

  .category-tag {
    border: 2px solid #fff;
    padding: 3px 8px;
    font-size: 14px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    color: #fff;
    transition: all 0.3s ease;
    background: rgba(0,0,0,0.2);
  }

  .category-tag:hover {
    transform: scale(1.05);
    background: rgba(255,255,255,0.2);
  }

  /* Contrasting category borders */
  .category-articles-लेख { border-color: #e63946; color: #e63946; }
  .category-नेपाली { border-color: #1d3557; color: #1d3557; }
  .category-thoughts { border-color: #ff8800; color: #ff8800; }
  .category-travel { border-color: #2a9d8f; color: #2a9d8f; }
  .category-tech { border-color: #6a1b9a; color: #6a1b9a; }
  .category-poetry { border-color: #f4a261; color: #f4a261; }
  .category-life { border-color: #457b9d; color: #457b9d; }
  .category-uncategorized { border-color: #ccc; color: #ccc; }

  /* Image section (right) */
  .postcard img {
    width: 200px;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }

  .postcard img:hover {
    transform: scale(1.05);
  }
</style>

<div id="wp-latest-posts"></div>

<script>
(function() {
  const container = document.getElementById('wp-latest-posts');
  const feed = 'https://aacharyaaaditya.wordpress.com/feed/';

  fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed))
    .then(r => r.json())
    .then(data => {
      data.items.slice(0, 6).forEach(item => {
        const postDiv = document.createElement('div');
        postDiv.className = 'postcard';

        // Thumbnail image (right side)
        const img = `<a href="${item.link}" target="_blank"><img src="${item.thumbnail}" alt="Thumbnail"></a>`;

        // Title
        const title = `<h4><a href="${item.link}" target="_blank">${item.title}</a></h4>`;
        const divider = `<div class="divider"></div>`;

        // Meta info
        const pubDate = new Date(item.pubDate);
        const meta = `<div class="meta">By <a href="https://aacharyaaaditya.wordpress.com/author/aacharyaaaditya/" target="_blank">Aditya Acharya</a> on ${pubDate.toDateString()}</div>`;

        // Summary
        const plainText = item.description.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ');
        const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [];
        const summaryText = sentences.slice(0, 3).join(' ').trim() || plainText.split(' ').slice(0, 40).join(' ') + '...';
        const summary = `<div class="summary">${summaryText}</div>`;

        // Categories
        const categoryLabel = `<span class="category-label">In</span>`;
        const categoryLinks = item.categories.slice(0, 2).map(catName => {
          const slug = catName.trim()
            .replace(/\s*\/\s*/g, '/')
            .replace(/\s+/g, '-');
          const url = `https://aacharyaaaditya.wordpress.com/category/${slug}/`;
          const safeClass = 'category-' + slug.replace(/[^a-z0-9\-]/gi, '');
          return `<a class="category-tag ${safeClass}" href="${url}" target="_blank">${catName}</a>`;
        }).join('');
        const cats = `<div class="categories-row">${categoryLabel}${categoryLinks}</div>`;

        const contentHTML = `<div class="postcard-content">${title + divider + meta + summary + cats}</div>`;
        postDiv.innerHTML = contentHTML + img;

        container.appendChild(postDiv);
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML += `<p>Error loading posts.</p>`;
    });
})();
</script>
