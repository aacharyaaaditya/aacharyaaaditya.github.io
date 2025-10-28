
async function loadWordPressFeed() {
  const container = document.getElementById('wp-posts');
  container.innerHTML = '<div class="loader">Loading posts from WordPress...</div>';
  try {
    const response = await fetch('https://aacharyaaaditya.wordpress.com/category/english/feed/');
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const items = xml.querySelectorAll("item");
    let html = "";
    items.forEach((item, i) => {
      if (i >= 10) return;
      const title = item.querySelector("title").textContent;
      const link = item.querySelector("link").textContent;
      const date = new Date(item.querySelector("pubDate").textContent);
      const desc = item.querySelector("description")?.textContent || "";
      html += `<div class="post-card">
        <h3><a href="${link}" target="_blank">${title}</a></h3>
        <p><small>${date.toDateString()}</small></p>
        <p>${desc.slice(0, 200)}...</p>
      </div>`;
    });
    container.innerHTML = html || '<p>No posts found.</p>';
  } catch (e) {
    container.innerHTML = '<p>Could not load WordPress posts 😢</p>';
  }
}
document.addEventListener("DOMContentLoaded", loadWordPressFeed);
