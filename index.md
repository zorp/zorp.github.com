---
layout: page
title: Brain of Rasmus Frey
tagline: thoughts | code | fun | geek | drupal
---
{% include JB/setup %}



<ul class="posts">
  {% for post in site.posts %}
    <li>
      <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a> <span>{{ post.date | date_to_string }}</span>
      {% if post.description %}<p>{{ post.description }}</p>{% endif %}
    </li>
  {% endfor %}
</ul>