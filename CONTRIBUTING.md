<!--
    Copyright 2019 VMware, Inc.
    SPDX-License-Identifier: BSD-2-Clause
-->

# Contributing to Precaution

The Precaution project team welcomes contributions from the community. Before you start working with Precaution, please read our [Developer Certificate of Origin](https://cla.vmware.com/dco). All contributions to this repository must be signed as described on that page. Your signature certifies that you wrote the patch or have the right to pass it on as an open-source patch.

## Community

Dicussion about the Precaution project happens in the #precaution channel on the [VMware{code} Slack](https://code.vmware.com/web/code/join).

## Getting Started

Our documentation includes several pages on Precaution development, take a look at our [architecture](docs/architecture.md) document, or browse our documentation [online](https://vmware.github.io/precaution) or [in-repo](docs/index.md).

## Contribution Flow

This is a rough outline of what a contributor's workflow looks like:

- Create a topic branch from where you want to base your work
- Make commits of logical units
- Make sure your commit messages are in the proper format (see below)
- Push your changes to a topic branch in your fork of the repository
- Submit a pull request

Example:

``` shell
git remote add upstream https://github.com/vmware/precaution.git
git checkout -b my-new-feature master
git commit -a
git push origin my-new-feature
```

### Code Review

All contributions to Precaution must be reviewed and approved by a maintainer (distinct from the author of the pull request). Pull Requests will be merged to the master branch once one or more maintainers have Approved the Pull Request and the _ready-to-merge_ label has been added.

This final step of adding the _ready-to-merge_ label allows for a range of final check scenarios once the code is deemed ready by a reviewer. Examples of final checks that may occur are:
- when a Reviewer wants another project maintainer to approve the change
- when the Submitter needs to squash, rebase, or otherwise clean up their changes before the merge

If a Pull Request is Approved without the _ready-to-merge_ label being added the reviewer must add a comment indicating what must happen before the change can be merged so that the Submitter knows what is gating acceptance of their contribution.

The expected code review process is:

- Submitter creates Pull Request
- (_optional_) Reviewer provides feedback
- (_optional_) Submitter addresses feedback, adding further patches to the pull request
- Reviewer Approves merging of the changes in the Pull Request
- (_optional_) Final confirmation (from a second reviewer, following rebase, etc)
- Reviewer adds _ready-to-merge_ label

### Staying In Sync With Upstream

When your branch gets out of sync with the vmware/master branch, use the following to update:

``` shell
git checkout my-new-feature
git fetch -a
git pull --rebase upstream master
git push --force-with-lease origin my-new-feature
```

### Updating pull requests

If your PR fails to pass CI or needs changes based on code review, you'll most likely want to squash these changes into
existing commits.

If your pull request contains a single commit or your changes are related to the most recent commit, you can simply
amend the commit.

``` shell
git add .
git commit --amend
git push --force-with-lease origin my-new-feature
```

If you need to squash changes into an earlier commit, you can use:

``` shell
git add .
git commit --fixup <commit>
git rebase -i --autosquash master
git push --force-with-lease origin my-new-feature
```

Be sure to add a comment to the PR indicating your new changes are ready to review, as GitHub does not generate a
notification when you git push.

### Code Style

Precaution follows the [JavaScript Standard Style](https://standardjs.com/).

### Formatting Commit Messages

We follow the conventions on [How to Write a Git Commit Message](http://chris.beams.io/posts/git-commit/).

Be sure to include any related GitHub issue references in the commit message.  See
[GFM syntax](https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown) for referencing issues
and commits.

## Reporting Bugs and Creating Issues

When opening a new issue, try to roughly follow the commit message format conventions above.

## Repository Structure
