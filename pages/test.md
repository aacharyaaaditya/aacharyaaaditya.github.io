---
layout: page
title: Test
permalink: /test/
---
<style>
  .postcard {
    border: 1px solid #656565;
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
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
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
    border-radius:0 10px 0 10px;
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
</style>

<div id="wp-latest-posts"></div>
<button id="load-more" class="load-more-btn">Load More</button>

<script>
(function() {
  const container = document.getElementById('wp-latest-posts');
  const loadMoreBtn = document.getElementById('load-more');

  const PER_PAGE = 7;
  let currentPage = 1;
  let totalPages = null;

  const categoryColorMap = {};
  let hueIndex = 0;

  function getCategoryColor(name) {
    if (categoryColorMap[name]) return categoryColorMap[name];
    const hue = (hueIndex * 137.508) % 360;
    hueIndex++;
    const color = `hsl(${hue}, 70%, 50%)`;
    categoryColorMap[name] = color;
    return color;
  }

  function stripHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  function createPost(item) {
    const postDiv = document.createElement('div');
    postDiv.className = 'postcard';

    const imgSrc = (item.jetpack_featured_media_url) 
      ? item.jetpack_featured_media_url 
      : 'https://via.placeholder.com/200x180?text=No+Image';

    const img = `<a href="${item.link}" target="_blank"><img src="${imgSrc}" alt="Thumbnail"></a>`;

    const title = `<h4><a href="${item.link}" target="_blank">${item.title.rendered}</a></h4>`;
    const divider = `<div class="divider"></div>`;

    const pubDate = new Date(item.date);
    const meta = `
      <div class="meta">
        By <a href="https://aacharyaaaditya.wordpress.com/author/aacharyaaaditya/" target="_blank">Aditya Acharya</a>
        on ${pubDate.toDateString()}
      </div>`;

    const plainText = stripHTML(item.excerpt.rendered).replace(/\s+/g, ' ');
    const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [];
    const summaryText = sentences.slice(0, 3).join(' ').trim() 
      || plainText.split(' ').slice(0, 40).join(' ') + '...';

    const summary = `<div class="summary">${summaryText}</div>`;

    const categoryLabel = `<span class="category-label">Posted in</span>`;

    const categoryLinks = (item._embedded?.['wp:term']?.[0] || [])
      .slice(0, 2)
      .map(cat => {
        const color = getCategoryColor(cat.name);
        const style = `border-color: ${color};`;
        return `<a class="category-tag" style="${style}" href="${cat.link}" target="_blank">${cat.name}</a>`;
      }).join('');

    const cats = `<div class="categories-row">${categoryLabel}${categoryLinks}</div>`;

    postDiv.innerHTML = `<div class="postcard-content">${title + divider + meta + summary + cats}</div>` + img;

    container.appendChild(postDiv);
  }

  function fetchPosts() {
    fetch(`https://aacharyaaaditya.wordpress.com/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${currentPage}&_embed`)
      .then(res => {
        totalPages = parseInt(res.headers.get('X-WP-TotalPages'));
        return res.json();
      })
      .then(data => {
        if (!data || data.length === 0) {
          loadMoreBtn.style.display = 'none';
          return;
        }

        data.forEach(createPost);

        if (currentPage >= totalPages) {
          loadMoreBtn.style.display = 'none';
        }
      })
      .catch(err => {
        console.error(err);
        loadMoreBtn.style.display = 'none';
      });
  }

  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    fetchPosts();
  });

  // Initial load
  fetchPosts();
})();
</script>
