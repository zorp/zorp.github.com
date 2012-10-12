---
layout: post
title: "Setting up Linode to run as multicore Solr server"
description: "This is a step by step on how to setup Solr server running on Jetty on Ubuntu 10.04 LTS."
category: lessons
tags: [Code, Server config, Solr, Jetty, Linode]
---
{% include JB/setup %}

This is a step by step on how to setup Solr server running on Jetty on Ubuntu 10.04 LTS.
This step by step is written while setting up a solr server on a Linode server.

Set hostname
<pre>
<code class="bash">
<span class="nv">$ </span>echo "your-hostname" > /etc/hostname
<span class="nv">$ </span>hostname -F /etc/hostname
</code>
</pre>

Modify /etc/hosts
<pre>
<code class="bash">
<span class="nv">$ </span>vi /etc/hosts
</code>
</pre>

Change to
<pre>
<code class="Apache configuration">
127.0.0.1        localhost.localdomain        localhost
your.servers.ip    your.domain.com     your-hostname
</code>
</pre>

Set timezone
<pre>
<code class="bash">
<span class="nv">$ </span>dpkg-reconfigure tzdata
</code>
</pre>

Setting Solr multi core, using this guide as base: http://davehall.com.au/blog/dave/2010/06/26/multi-core-apache-solr-ubuntu-1004-drupal-auto-provisioning
Thank you Dave

Install Solr and Jetty
<pre>
<code class="bash">
<span class="nv">$ </span>apt-get install solr-jetty openjdk-6-jdk
</code>
</pre>

Configure Jetty
First backup default config
<pre>
<code class="bash">
<span class="nv">$ </span>cp -a /etc/default/jetty /etc/default/jetty.bak
</code>
</pre>

Modify /etc/default/jetty
<pre>
<code class="bash">
<span class="nv">$ </span>vi /etc/default/jetty
</code>
</pre>

<pre>
<code class="Apache configuration">
Change NO_START=1 to NO_START=0
Set JETTY_HOST=your.domain.com (use the servers domain)
</code>
</pre>

Configure Solr
create config file to enable multicore

<pre>
  <code class="bash">
<span class="nv">$ </span>vi /usr/share/solr/solr.xml
</code>
</pre>
add to file:
<pre>
<code class="Apache configuration">
&lt;solr persistent=&quot;true&quot; sharedLib=&quot;lib&quot;&gt;
 &lt;cores adminPath=&quot;/admin/cores&quot; shareSchema=&quot;true&quot; adminHandler=&quot;au.com.davehall.solr.plugins.SolrCoreAdminHandler&quot;&gt;
 &lt;/cores&gt;
&lt;/solr&gt;
</code>
</pre>

Make jetty owner
<pre>
<code class="bash">
<span class="nv">$ </span>chown jetty:jetty /usr/share/solr
<span class="nv">$ </span>chown jetty:jetty /usr/share/solr/solr.xml
<span class="nv">$ </span>chmod 640 /usr/share/solr/solr.xml
<span class="nv">$ </span>mkdir /usr/share/solr/cores
<span class="nv">$ </span>chown jetty:jetty /usr/share/solr/cores
</code>
</pre>

Create symlink to centralize configs
<pre>
<code class="bash">
<span class="nv">$ </span>ln -s /usr/share/solr/solr.xml /etc/solr/
</code>
</pre>

Configure for drupal
backup first
<pre>
<code class="bash">
<span class="nv">$ </span>mv /etc/solr/conf/schema.xml /etc/solr/conf/schema.orig.xml
<span class="nv">$ </span>mv /etc/solr/conf/solrconfig.xml /etc/solr/conf/solrconfig.orig.xml
</code>
</pre>

fetch the drupal solr module
<pre>
<code class="bash">
<span class="nv">$ </span>wget http://ftp.drupal.org/files/projects/apachesolr-6.x-1.2.tar.gz (check d.o for latest version)
<span class="nv">$ </span>tar xvzf apachesolr-6.x-1.2.tar.gz
<span class="nv">$ </span>mv apachesolr/ drupal-apachesolr
</code>
</pre>

copy drupal configs
<pre>
<code class="bash">
<span class="nv">$ </span>cp /etc/solr/drupal-apachesolr/{schema,solrconfig}.xml /etc/solr/conf/
</code>
</pre>

create each of the cores (add more for several domains)
<pre>
<code class="bash">
<span class="nv">$ </span>mkdir -p /var/lib/solr/cores/{,subdomain_1_,subdomain_2_}your_domain_com/{data,conf}
<span class="nv">$ </span>chown -R jetty:jetty /var/lib/solr/cores/{,subdomain_1_,subdomain_2_}your_domain_com
</code>
</pre>

Finally fetch this plugin
<pre>
<code class="bash">
<span class="nv">$ </span>mkdir /usr/share/solr/lib
<span class="nv">$ </span>cd /usr/share/solr/lib
<span class="nv">$ </span>wget http://davehall.com.au/sites/davehall.com.au/files/dhc-solr-plugins.jar (thank you dave)
</code>
</pre>

Cross your fingers everything is correct and start Jetty
<pre>
<code class="bash">
<span class="nv">$ </span>/etc/init.d/jetty start
</code>
</pre>

Goto http://your.domain.com:8080/solr/admin/cores
Did it work? Yeah!
Create a core for domain: http://your.domain.com:8080/solr/admin/cores?action=CREATE&name=new_core_name&instanceDir=new_core_name

SETUP SECURITY
Based on http://drupal.org/node/967628

<pre>
<code class="bash">
<span class="nv">$ </span>vi /etc/jetty/webdefault.xml
</code>
</pre>

goto the very end
add just before closing web-app tag
<pre>
<code class="Apache configuration">
  &lt;security-constraint&gt;
    &lt;web-resource-collection&gt;
      &lt;web-resource-name&gt;Solr authenticated application&lt;/web-resource-name&gt;
      &lt;url-pattern&gt;/*&lt;/url-pattern&gt;
    &lt;/web-resource-collection&gt;
    &lt;auth-constraint&gt;
      &lt;role-name&gt;admin&lt;/role-name&gt;
      &lt;role-name&gt;solr-role&lt;/role-name&gt;
    &lt;/auth-constraint&gt;
  &lt;/security-constraint&gt;
  &lt;login-config&gt;
    &lt;auth-method&gt;BASIC&lt;/auth-method&gt;
    &lt;realm-name&gt;Solr Realm&lt;/realm-name&gt;
  &lt;/login-config&gt;
</code>
</pre>
  
Set user and passwd
<pre>
<code class="bash">
<span class="nv">$ </span>vi /etc/jetty/realm.properties
</code>
</pre>
add
username: password, solr-role

modify /etc/jetty/jetty.xml
<pre>
<code class="bash">
<span class="nv">$ </span>vi /etc/jetty/jetty.xml
</code>
</pre>
Search for Configure Authentication Realms
modify Test Realm change it to Solr Realm

Stop and Start Jetty
<pre>
<code class="bash">
<span class="nv">$ </span>/etc/init.d/jetty stop
<span class="nv">$ </span>/etc/init.d/jetty start
</code>
</pre>

Configure your ApacheSolr Drupal module with the following
<pre>
<code>
Solr host name: username:password@your.domain.com
Solr port: 8080
Solr path: /solr/your_core_name/
</code>
</pre>

Hope you found this guide useful.

I also find the tips in [this guide](http://rocktreesky.com/setting-new-server) very usefull.