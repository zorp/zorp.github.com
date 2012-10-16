---
layout: post
title: "Font size: rem | em | px"
description: "When setting up the font-size for at website the options and opinions are many."
category: 
tags: []
---
{% include JB/setup %}

When setting up the font-size for at website the options and opinions are many. Should you set is at 100%, 62.5% or use pixel based values. Then there are the downsides to using em as it inherits from the nearest parent and you can end up with your font-size just getting bigger and bigger if you use a CMS like Drupal that like to nest stuff in layers and layers of html tags.

## REM to the rescue

Luckily we have rem which derives from the root element and sets the em size according to what ever size you define to your HTML element.

But of course nothing in the world of web is without flaws. Using rem is not supported by so called older browsers. Currently rem is supported by: _IE9+, Firefox 3.6+, Chrome 4+, Safari 5+, Opera 11.6+_

So really we have to add both the pixel value and a rem value whenever at font-size is defined. What a hassle.

<pre>
<code class="css">
.element {
  font-size: 10px;
  font-size: .8rem;
}
</code>
</pre>

## Sass mixin to the rescue

On a current project we spent some time discussing what value to use. Luckily we have seen the light and use Sass to write our css code. So when I stumbled upon this [github repro](https://github.com/bitmanic/rem) which is a Sass mixin that converts a pixel value into rem and spits out both the pixel and rem value for any given css property our day was saved.

So now whenever defining a font-size we do it like this:

<pre>
<code class="css">
.element {
  @include rem('font-size',15px);
}
</code>
</pre>

Which spit out this when compiled to css:

<pre>
<code class="css">
.element {
  font-size: 15px;
  font-size: 0.9375rem;
}
</code>
</pre>

## Why oh why

You could say this is overkill, well it might be but this way we embrace the future while keeping things backwards compatible. And I don't think writing those extra few characters is a hassle and it's easy at a later stage to change the mixin to match new browser requirements.

## Find the mixin on Github

- [https://github.com/bitmanic/rem](https://github.com/bitmanic/rem)
- A forked version [https://github.com/ry5n/rem](https://github.com/ry5n/rem)