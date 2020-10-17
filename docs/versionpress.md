# `WordPress + Git = VersionPress`

# Versioning Engine - Git
Under the hood, VersionPress relies on Git which is one of the most wide-spread version control systems in the world. It was an important decision up-front that brings many benefits but also one trade-off in form of higher system requirements (Git is currently required on the server). This page discusses why we chose Git and why it's such an important decision for the project.

# Why Git
Git was a perfect fit for VersionPress for a couple of reasons:

It is a world-class, proven system. Many large and important projects depend on it (Android, Linux and many others; even WordPress itself has a Git mirror).
It is open source and cross-platform.
Git is decentralized. It will happily maintain history on a local computer without ever sending the data anywhere – important for your privacy and important for how VersionPress works.
It has a huge community and ecosystem around it. There are many 3rd party tools and services that work well with Git.
How this benefits you
One practical benefit is that VersionPress repository is just a plain Git repository that you (if you are a power user) can work with the same way as with any other Git repo. For example, you can set up your own Git server and push your work there. Or you can push to GitHub, BitBucket and other Git hosting sites. Or you can inspect this site history in command line tools.

One thing that is especially worth pointing out is that you can actively update the repository. It is not "reserved", "locked" or anything like that for VersionPress. You can even start with an existing Git repo in place – VersionPress will not overwrite it, it will just commit into it. Symmetrically, if you decide to stop using VersionPress you can still continue using the Git repo for later manual commits.

This really opens a whole new world for advanced WordPress admins.

# How VersionPress Works
Sometimes, the best way to understand a product is to have a brief idea of how it works, internally. That way, you know what actions are safe, what is possibly dangerous and so on. This page provides a brief overview.

# High level overview
WordPress site with VersionPress installed and activated contains three main parts:

WordPress itself, i.e. the PHP code and MySQL database
Git repository that manages the historic revisions
The VersionPress plugin that translates WordPress data into the Git format and does all the other things like providing the admin pages, undo buttons etc.
One important point here is that our code actually implements very little versioning logic itself. Instead, we depend heavily on Git which was an important strategic decision. This has many advantages but also poses some new challenges as described here.

With regards to how VersionPress works, it generally observes write operations (e.g., updating a post, adding a comment etc.) and prepares the data in a format that will be suitable for version control in Git. The files in this format are stored in the wp-content/vpdb folder and later committed to the Git repository. In the opposite direction, they can be used to update the MySQL database on operations like Undo, Rollback or Clone.

On read operations (displaying a post etc.), VersionPress generally does nothing. It might happen that even something that appears as a read operation changes some data behind the scenes, in which case there will be a new commit.
