---
layout: page
title: Brain of Rasmus Frey
tagline: thoughts | code | fun | geek | drupal
---
{% include JB/setup %}



<div class="row">
  <div class="span9">
    <ul class="posts">
      {% for post in site.posts %}
        <li>
          <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a> <span>{{ post.date | date_to_string }}</span>
          {% if post.description %}<p>{{ post.description }}</p>{% endif %}
        </li>
      {% endfor %}
    </ul>
  </div>
  <div class="span3">
    <h4>My latest instagrams</h4>
    <div id="myCarousel" class="carousel slide">
      <!-- Carousel items -->
      <div class="carousel-inner instagrams"></div>
      <!-- Carousel nav -->
      <a class="carousel-control left" href="#myCarousel" data-slide="prev">&lsaquo;</a>
      <a class="carousel-control right" href="#myCarousel" data-slide="next">&rsaquo;</a>
    </div>
  </div>
</div>