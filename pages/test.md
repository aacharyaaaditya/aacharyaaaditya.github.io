
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Writing | Blog</title>

<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    background: #f5f3ee;
    color: #292929;
    font-family: Georgia, serif;
}

header {
    text-align: center;
    padding: 65px 20px 35px;
}

header h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    margin-bottom: 10px;
}

header p {
    color: #777;
    font-family: Arial, sans-serif;
}

.blog-container {
    max-width: 1200px;
    margin: auto;
    padding: 25px;
}

.posts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
}

/* Postcard design */
.postcard {
    background: white;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 5px 18px rgba(0,0,0,0.08);
    transition: transform 0.25s, box-shadow 0.25s;
}

.postcard:hover {
    transform: translateY(-6px) rotate(-0.4deg);
    box-shadow: 0 12px 28px rgba(0,0,0,0.13);
}

.postcard img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
}

.postcard-content {
    padding: 23px;
}

.post-date {
    font-family: Arial, sans-serif;
    color: #999;
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.postcard h2 {
    font-size: 22px;
    line-height: 1.35;
    margin: 12px 0;
}

.postcard p {
    color: #666;
    font-size: 14px;
    line-height: 1.7;
}

.read-more {
    display: inline-block;
    margin-top: 12px;
    color: #a16e4b;
    text-decoration: none;
    font-family: Arial, sans-serif;
    font-size: 13px;
    font-weight: bold;
}

.read-more:hover {
    text-decoration: underline;
}

#status {
    text-align: center;
    padding: 35px;
    font-family: Arial, sans-serif;
    color: #777;
}

.pagination {
    text-align: center;
    padding: 40px;
}

button {
    background: #292929;
    color: white;
    border: none;
    padding: 12px 25px;
    cursor: pointer;
    border-radius: 3px;
}

button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

@media (max-width: 850px) {
    .posts-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 550px) {
    .posts-grid {
        grid-template-columns: 1fr;
    }

    header {
        padding-top: 40px;
    }
}
</style>
</head>

<body>

<header>
    <h1>Words & Thoughts</h1>
    <p>A collection of my writings, reflections and ideas.</p>
</header>

<main class="blog-container">
    <div id="status">Loading posts...</div>
    <div class="posts-grid" id="posts"></div>

    <div class="pagination">
        <button id="loadMore" onclick="loadPosts()" hidden>
            Load More
        </button>
    </div>
</main>

<script>
const API =
"https://aacharyaaaditya.wordpress.com/wp-json/wp/v2/posts";

let currentPage = 1;
let totalPages = 1;

async function loadPosts() {
    const status = document.getElementById("status");
    const button = document.getElementById("loadMore");

    button.disabled = true;
    button.textContent = "Loading...";

    try {
        const response = await fetch(
            `${API}?per_page=12&page=${currentPage}&_embed`
        );

        if (!response.ok) {
            throw new Error("Could not retrieve posts.");
        }

        totalPages = Number(
            response.headers.get("X-WP-TotalPages") || 1
        );

        const posts = await response.json();

        if (posts.length === 0 && currentPage === 1) {
            status.textContent = "No posts found.";
            button.hidden = true;
            return;
        }

        status.textContent = "";

        const container = document.getElementById("posts");

        posts.forEach(post => {

            const image =
                post._embedded?.["wp:featuredmedia"]?.[0]
                    ?.source_url ||
                "https://placehold.co/600x400/e8e3dc/777?text=My+Writing";

            const title = document.createElement("h2");
            title.textContent = post.title.rendered;

            const date = document.createElement("div");
            date.className = "post-date";
            date.textContent = new Date(post.date)
                .toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });

            const excerpt = document.createElement("p");

            const parser = new DOMParser();
            const excerptDoc = parser.parseFromString(
                post.excerpt.rendered,
                "text/html"
            );

            excerpt.textContent =
                excerptDoc.body.textContent.trim()
                    .slice(0, 160) + "...";

            const img = document.createElement("img");
            img.src = image;
            img.alt = post.title.rendered;
            img.loading = "lazy";

            const link = document.createElement("a");
            link.href = post.link;
            link.className = "read-more";
            link.textContent = "READ ARTICLE →";
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            const content = document.createElement("div");
            content.className = "postcard-content";

            content.append(date, title, excerpt, link);

            const card = document.createElement("article");
            card.className = "postcard";

            card.append(img, content);
            container.appendChild(card);
        });

        currentPage++;

        button.hidden = currentPage > totalPages;
        button.textContent = "Load More";

    } catch (error) {
        status.textContent =
            "Unable to load posts. Please try again later.";

        console.error(error);

    } finally {
        button.disabled = false;
    }
}

// Load the first batch automatically
loadPosts();
</script>

</body>
</html>
