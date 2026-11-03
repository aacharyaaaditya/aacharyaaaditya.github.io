---
layout: page
title: Articles and blogs
permalink: /articles-blogs/
---

<h2> Recent articles and blogs </h2>
<style>
  .postcard {
    border: 0.5px solid #656565;
    padding: 20px;
    margin-bottom: 24px;
    border-radius: 0 15px 0 15px;
    background: #DCDBDA;
    font-family: sans-serif;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .postcard:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.5);
  }

  .postcard-content { flex: 1; }

  .postcard img {
    width: 200px;
    height: 120px;
    object-fit: cover;
    border: 1px solid #aaa;
    border-radius: 4px;
    flex-shrink: 0;
    transition: transform 0.3s ease;
    display: block;
  }

  .postcard img:hover { transform: scale(1.05); }

  /* Site icon used when a post has no image: show it whole, not cropped */
  .postcard img.thumb-icon { object-fit: contain; padding: 16px; background: #fff; box-sizing: border-box; }

  .postcard-content h4 { margin: 0 0 6px; font-size: 20px; color: #1e3a8a; }
  .postcard-content h4 a { color: #1e3a8a; text-decoration: none; }
  .postcard-content h4 a:hover { text-decoration: underline; }

  .divider { height: 1px; background: #e53935; margin: 8px 0; }

  .meta { font-size: 14px; color: #0D0C0C; margin-bottom: 10px; }
  .meta a { color: #1e3a8a; text-decoration: none; }

  .summary { font-size: 15px; margin-bottom: 12px; color: #0D0C0C; }

  .categories-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .category-label { font-size: 14px; color: #555; font-style: italic; white-space: nowrap; }

  .category-tag {
    border: 1px solid #444;
    padding: 3px 6px;
    font-size: 12px;
    color: #333;
    text-decoration: none;
    text-transform: capitalize;
    border-radius:0 0 0 0;
    background-color: #fff;
    display: inline-block;
    transition: border-color 0.3s ease, transform 0.3s ease;
    cursor: pointer;
  }

  .category-tag:hover {
    transform: scale(1.05);
    border-color: #1e3a8a;
  }

  .wp-heading { font-family: sans-serif; font-size: 22px; color: #1e3a8a; margin: 32px 0 24px; text-align: left; display: inline-block; border-bottom: none; padding-bottom: 3px; line-height: 1.3; }

  .load-more-btn {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #444;
    background: #fff;
    border-radius: 6px;
  }

  .load-more-btn:disabled { opacity: 0.6; cursor: default; }

  /* Mobile layout: stack the card, with the thumbnail on top */
  @media (max-width: 600px) {
    .postcard {
      flex-direction: column-reverse;
      padding: 14px;
      gap: 12px;
    }

    .postcard-content { width: 100%; }

    .postcard img {
      width: 100%;
      height: 180px;
    }

    .postcard-content h4 { font-size: 18px; }
    .summary { font-size: 14px; }

    /* No hover on touch screens, so skip the lift/zoom effects */
    .postcard:hover { transform: none; box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15); }
    .postcard img:hover { transform: none; }
  }
</style>

<div id="wp-latest-posts"></div>
<button id="load-more" class="load-more-btn">Load More</button>

<script>
(function() {
  const container = document.getElementById('wp-latest-posts');
  const loadMoreBtn = document.getElementById('load-more');

  const site = 'aacharyaaaditya.wordpress.com';
  const pageSize = 10;
  const apiBase = 'https://public-api.wordpress.com/rest/v1.1/sites/' + site + '/posts/'
    + '?fields=ID,title,URL,date,excerpt,content,categories,featured_image,post_thumbnail'
    + '&number=' + pageSize;

  const categoryColorMap = {};
  let hueIndex = 0;
  let currentPage = 1;
  let loadedCount = 0;
  let isLoading = false;

  // Icon shown on cards whose post has no image. Leave customIcon empty to use the blog's
  // site icon (favicon) from WordPress, or paste the full URL of your own icon image there.
  const customIcon = '';
  let siteIcon = customIcon;
  const iconReady = customIcon
    ? Promise.resolve()
    : fetch('https://public-api.wordpress.com/rest/v1.1/sites/' + site + '?fields=icon')
        .then(r => r.json())
        .then(data => { siteIcon = (data.icon && data.icon.img) || ''; })
        .catch(() => {});

  function getCategoryColor(name) {
    if (categoryColorMap[name]) return categoryColorMap[name];
    const hue = (hueIndex * 137.508) % 360;
    hueIndex++;
    const color = `hsl(${hue}, 70%, 50%)`;
    categoryColorMap[name] = color;
    return color;
  }

  // Converts HTML entities (e.g. &#8217;) into normal characters
  function decodeEntities(str) {
    const t = document.createElement('textarea');
    t.innerHTML = str || '';
    return t.value;
  }

  function renderPosts(posts) {
    posts.forEach(item => {
      const postDiv = document.createElement('div');
      postDiv.className = 'postcard';

      // Thumbnail: featured image first, then the first image inside the post, then the placeholder
      const firstImgMatch = (item.content || '').match(/<img[^>]+src=["']([^"']+)["']/i);
      const firstImg = firstImgMatch ? decodeEntities(firstImgMatch[1]) : '';
      const thumb = (item.post_thumbnail && item.post_thumbnail.URL) || item.featured_image || firstImg;
      const imgSrc = thumb || siteIcon || 'https://via.placeholder.com/200x180?text=No+Image';
      const imgClass = thumb ? '' : 'thumb-icon';
      const img = `<a href="${item.URL}" target="_blank"><img class="${imgClass}" src="${imgSrc}" alt="Thumbnail"></a>`;

      const title = `<h4><a href="${item.URL}" target="_blank">${item.title}</a></h4>`;
      const divider = `<div class="divider"></div>`;

      const pubDate = new Date(item.date);
      const meta = `
        <div class="meta">
          By <a href="https://aacharyaaaditya.wordpress.com/author/aacharyaaaditya/" target="_blank">Aditya Acharya</a>
          on ${pubDate.toDateString()}
        </div>`;

      // Summary: use the written excerpt when there is one; otherwise only the first sentence.
      // An auto-generated excerpt is recognised by its trailing "…" / "[…]" / "Continue reading".
      const ellipsisEnd = /\s*(\[\u2026\]|\u2026|\.\.\.)\s*(Continue reading.*)?$/i;
      const rawText = decodeEntities((item.excerpt || '').replace(/<[^>]*>?/gm, '')).replace(/\s+/g, ' ').trim();
      const isAutoExcerpt = ellipsisEnd.test(rawText);
      const plainText = rawText.replace(ellipsisEnd, '').trim();

      function limitWords(text, max) {
        const words = text.split(' ');
        return words.length > max ? words.slice(0, max).join(' ') + '...' : text;
      }

      let summaryText;
      if (isAutoExcerpt) {
        const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [];
        summaryText = limitWords(sentences.length ? sentences[0].trim() : plainText, 30);
      } else {
        summaryText = limitWords(plainText, 60);
      }
      const summary = `<div class="summary">${summaryText}</div>`;

      const categoryLabel = `<span class="category-label">Posted in</span>`;
      // The API returns each category with its real name and slug
      const cats_ = Object.values(item.categories || {}).slice(0, 2);
      const categoryLinks = cats_.map(cat => {
        const url = `https://${site}/category/${cat.slug}/`;
        const color = getCategoryColor(cat.name);
        const style = `border-color: ${color};`;
        return `<a class="category-tag" style="${style}" href="${url}" target="_blank">${decodeEntities(cat.name)}</a>`;
      }).join('');

      const cats = `<div class="categories-row">${categoryLabel}${categoryLinks}</div>`;

      postDiv.innerHTML = `<div class="postcard-content">${title + divider + meta + summary + cats}</div>` + img;
      container.appendChild(postDiv);
    });
  }

  function loadPosts() {
    if (isLoading) return;
    isLoading = true;
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading...';

    iconReady
      .then(() => fetch(apiBase + '&page=' + currentPage))
      .then(response => response.json())
      .then(data => {
        const posts = data.posts || [];

        if (posts.length === 0 && loadedCount === 0) {
          container.innerHTML = "<p>No posts found.</p>";
          loadMoreBtn.style.display = 'none';
          return;
        }

        renderPosts(posts);
        loadedCount += posts.length;
        currentPage++;

        // Hide the button once every post has been loaded
        if (posts.length < pageSize || loadedCount >= data.found) {
          loadMoreBtn.style.display = 'none';
        }
      })
      .catch(err => {
        console.error(err);
        if (loadedCount === 0) {
          container.innerHTML = `<p>Error loading posts.</p>`;
          loadMoreBtn.style.display = 'none';
        }
      })
      .finally(() => {
        isLoading = false;
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load More';
      });
  }

  loadMoreBtn.addEventListener('click', loadPosts);
  loadPosts();
})();
</script>

<p> The latest posts from my blog (aacharyaaaditya.wordpress.com) are fetched here automatically. </p> 
<p> यी लेखहरू aacharyaaaditya.wordpress.com मा लेखिएका हुन् र स्वचालित (अटोमेटिक) रुपमा यहाँ देखिन्छन्।</p>
