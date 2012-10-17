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

{% highlight bash %}
$ echo "your-hostname" > /etc/hostname
$ hostname -F /etc/hostname
{% endhighlight %} 

Modify /etc/hosts

{% highlight bash %}
$ vi /etc/hosts
{% endhighlight %}

Change to
{% highlight apache %}
127.0.0.1        localhost.localdomain        localhost
your.servers.ip    your.domain.com     your-hostname
{% endhighlight %}

Set timezone
{% highlight bash %}
$ dpkg-reconfigure tzdata
{% endhighlight %}

Setting Solr multi core, using this guide as base: http://davehall.com.au/blog/dave/2010/06/26/multi-core-apache-solr-ubuntu-1004-drupal-auto-provisioning
Thank you Dave

Install Solr and Jetty
{% highlight bash %}
$ apt-get install solr-jetty openjdk-6-jdk
{% endhighlight %}

Configure Jetty
First backup default config
{% highlight bash %}
$ cp -a /etc/default/jetty /etc/default/jetty.bak
{% endhighlight %}

Modify /etc/default/jetty
{% highlight bash %}
$ vi /etc/default/jetty
{% endhighlight %}

{% highlight apache %}
Change NO_START=1 to NO_START=0
Set JETTY_HOST=your.domain.com (use the servers domain)
{% endhighlight %}

Configure Solr
create config file to enable multicore

{% highlight bash %}
$ vi /usr/share/solr/solr.xml
{% endhighlight %}

add to file:
{% highlight apache %}
<solr persistent="true" sharedLib="lib">
 <cores adminPath="/admin/cores" shareSchema="true" adminHandler="au.com.davehall.solr.plugins.SolrCoreAdminHandler">
 </cores>
</solr>
{% endhighlight %}

Make jetty owner
{% highlight bash %}
$ chown jetty:jetty /usr/share/solr
$ chown jetty:jetty /usr/share/solr/solr.xml
$ chmod 640 /usr/share/solr/solr.xml
$ mkdir /usr/share/solr/cores
$ chown jetty:jetty /usr/share/solr/cores
{% endhighlight %}

Create symlink to centralize configs
{% highlight bash %}
$ ln -s /usr/share/solr/solr.xml /etc/solr/
{% endhighlight %}

Configure for drupal
backup first
{% highlight bash %}
$ mv /etc/solr/conf/schema.xml /etc/solr/conf/schema.orig.xml
$ mv /etc/solr/conf/solrconfig.xml /etc/solr/conf/solrconfig.orig.xml
{% endhighlight %}

fetch the drupal solr module
{% highlight bash %}
$ wget http://ftp.drupal.org/files/projects/apachesolr-6.x-1.2.tar.gz (check d.o for latest version)
$ tar xvzf apachesolr-6.x-1.2.tar.gz
$ mv apachesolr/ drupal-apachesolr
{% endhighlight %}

copy drupal configs
{% highlight bash %}
$ cp /etc/solr/drupal-apachesolr/{schema,solrconfig}.xml /etc/solr/conf/
{% endhighlight %}

create each of the cores (add more for several domains)
{% highlight bash %}
$ mkdir -p /var/lib/solr/cores/{,subdomain_1_,subdomain_2_}your_domain_com/{data,conf}
$ chown -R jetty:jetty /var/lib/solr/cores/{,subdomain_1_,subdomain_2_}your_domain_com
{% endhighlight %}

Finally fetch this plugin
{% highlight bash %}
$ mkdir /usr/share/solr/lib
$ cd /usr/share/solr/lib
$ wget http://davehall.com.au/sites/davehall.com.au/files/dhc-solr-plugins.jar (thank you dave)
{% endhighlight %}

Cross your fingers everything is correct and start Jetty
{% highlight bash %}
$ /etc/init.d/jetty start
{% endhighlight %}

Goto http://your.domain.com:8080/solr/admin/cores
Did it work? Yeah!
Create a core for domain: http://your.domain.com:8080/solr/admin/cores?action=CREATE&name=new_core_name&instanceDir=new_core_name

SETUP SECURITY
Based on http://drupal.org/node/967628

{% highlight bash %}
$ vi /etc/jetty/webdefault.xml
{% endhighlight %}

goto the very end
add just before closing web-app tag
{% highlight apache %}
<security-constraint>
  <web-resource-collection>
    <web-resource-name>Solr authenticated application</web-resource-name>
    <url-pattern>/*</url-pattern>
  </web-resource-collection>
  <auth-constraint>
    <role-name>admin</role-name>
    <role-name>solr-role</role-name>
  </auth-constraint>
</security-constraint>
<login-config>
  <auth-method>BASIC</auth-method>
  <realm-name>Solr Realm</realm-name>
</login-config>
{% endhighlight %}
  
Set user and passwd
{% highlight bash %}
$ vi /etc/jetty/realm.properties
{% endhighlight %}
add
username: password, solr-role

modify /etc/jetty/jetty.xml
{% highlight bash %}
$ vi /etc/jetty/jetty.xml
{% endhighlight %}
Search for Configure Authentication Realms
modify Test Realm change it to Solr Realm

Stop and Start Jetty
{% highlight bash %}
$ /etc/init.d/jetty stop
$ /etc/init.d/jetty start
{% endhighlight %}

Configure your ApacheSolr Drupal module with the following
{% highlight %}
Solr host name: username:password@your.domain.com
Solr port: 8080
Solr path: /solr/your_core_name/
{% endhighlight %}

Hope you found this guide useful.

I also find the tips in [this guide](http://rocktreesky.com/setting-new-server) very usefull.