<!--
    Copyright 2019 VMware, Inc.
    SPDX-License-Identifier: BSD-2-Clause
-->

# Building documentation locally

When making changes to the documentation it's useful to be able to test the
changes to ensure they won't break GitHub pages.

Local testing (and debugging of) the GitHub Pages can be done using Bundler
(`gem install bundler`) as follows:

1. Ensure your local dependencies are up-to-date:
```shell
   $ bundle update github-pages
```
2. Build the local copy of the pages:
```
   $ bundle exec jekyll serve
```
3. Preview docs at [localhost:4000](http://localhost:4000)
