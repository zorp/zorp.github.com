---
layout: post
title: "Getting PECL uploadprogress installed"
description: "I had some trouble to get PECL uploadprogress installed using the regular way running $ sudo pecl install uploadprogress"
category: lessons
tags: [Code, Server config]
---
{% include JB/setup %}

I had some trouble to get PECL uploadprogress installed using the regular way running $ sudo pecl install uploadprogress

So after some googling I found a solution and it was to do the following:

1. Download the PECL uploadprogress extension
2. extract and jump into the dir
3. Run these commands

<pre>
  <code class="bash">
    <span class="nv">$ </span>sudo phpize
    <span class="nv">$ </span>sudo ./configure
    <span class="nv">$ </span>sudo make
    <span class="nv">$ </span>sudo make install
  </code>
</pre>

This was done after following [this fine guide](http://drupal.org/node/793262).