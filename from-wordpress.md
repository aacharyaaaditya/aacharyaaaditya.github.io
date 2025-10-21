---
layout: default
title: "From WordPress"
---

<h1>Posts from my WordPress Blog</h1>
<p id="loading">Fetching posts... please wait 😊</p>
<div id="wp-posts"></div>

<script>
  const feedUrl = "https://api.rss2json.com/v1/api.json?rss_url=https://aacharyaaaditya.wordpress.com/category/english/feed/";
  const postsContainer = document.getElementById("wp-posts");
  const loadingText = document.getElementById("loading");

  async function fetchWordPressPosts() {
    try {
      const response = await fetch(feedUrl);
      if (!response.ok) throw new Error("Failed to fetch feed");

      const data = await response.json();
      loadingText.remove();

      if (!data.items || data.items.length === 0) {
        postsContainer.innerHTML = "<p>No posts found 😶</p>";
        return;
      }

      // Display posts
      data.items.forEach(item => {
        const post = document.createElement("div");
        post.className = "wp-post";
        post.innerHTML = `
          <h2><a href="${item.link}" target="_blank">${item.title}</a></h2>
          <p><em>${new Date(item.pubDate).toLocaleDateString()}</em></p>
          <p>${item.description.slice(0, 200)}...</p>
          <hr>
        `;
        postsContainer.appendChild(post);
      });
    } catch (error) {
      console.error(error);
      loadingText.textContent = "Could not load WordPress posts 😢";
    }
  }

  fetchWordPressPosts();
</script>

<style>
  #wp-posts {
    max-width: 700px;
    margin: 0 auto;
    font-family: system-ui, sans-serif;
  }
  .wp-post {
    margin-bottom: 2rem;
  }
  .wp-post h2 {
    margin-bottom: 0.3rem;
  }
  .wp-post p {
    color: #444;
  }
</style>
