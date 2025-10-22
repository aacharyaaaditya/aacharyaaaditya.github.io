---
layout: default
title: Home
---

<section class="hero">
  <h1>Hey, I'm {{ site.title }}</h1>
  <p class="lead">I design and build clean, modern experiences for the web.</p>
  <a href="#work">↓ See My Work</a>
</section>

<section id="work">
  <h2>Featured Work</h2>
  <div class="grid">
    {% for project in site.data.projects %}
    <div class="card">
      <h3>{{ project.name }}</h3>
      <p>{{ project.description }}</p>
      <a href="{{ project.url }}">View →</a>
    </div>
    {% endfor %}
  </div>
</section>

<section id="about">
  <h2>About Me</h2>
  <p>Write a few lines about yourself — your background, your passions, and what you create.</p>
</section>

<section id="contact">
  <h2>Contact</h2>
  <p>Hit me up on <a href="mailto:you@example.com">email</a> or find me on <a href="https://github.com/username">GitHub</a>.</p>
</section>
