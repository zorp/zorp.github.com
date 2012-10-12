---
layout: post
title: "Update github fork from it's orginal"
description: "From time to time I have the need to update a forked github repository from it's orginal source. This is how I do it."
category: lessons
tags: [GitHub, Git, Code]
---
{% include JB/setup %}

From time to time I have the need to update a forked github repository from it's orginal source. This is how I do it.

First you need to add a remote branch to your repository that points to the original repo you forked from.

<pre>
<code>
<span class="nv">$ </span>git remote add --track master remotename git://github.com/remotename/example.git
</code>
</pre>

You will want to replace ‘master’ with the branch you want to track in the remote repo. In most cases this will be master, although you could replace it with development or any other branch. You should also replace ‘remotename’ with what your the remote will be called, I tend to use the same as the github user I forked the repro from.

To verify the remote repository was added run

<pre>
<code>
<span class="nv">$ </span>git remote
</code>
</pre>

You should see the new remote repo, in this case named ‘remotename’, along with any other remote repositories you may have previously added.

Now we can fetch all the changes from remotename’s code base.

<pre>
<code>
<span class="nv">$ </span>git fetch remotename
</code>
</pre>

This will create a new remote branch called ‘remotename/master’. Now we are ready to merge the code from the remote repository to your local branch.

<pre>
<code>
<span class="nv">$ </span>git merge remotename/master
</code>
</pre>

That’s it. Remember, this process isn’t limited only to the original repository. Feel free to add remote branches for other user’s forks or even from repositories outside Github.