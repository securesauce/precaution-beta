<!--
    Copyright 2019 VMware, Inc.
    SPDX-License-Identifier: BSD-2-Clause
-->

# Setting up a Branch Protection Rule

By default, after Precaution is installed, it will not automatically prevent the merging of a pull request even if the check resulted in a failure status. 

![check_fails](./images/check_fails.png)


In order to allow Precaution to prevent pull requests from merging, do the following:

## 1. Create a pull request

You should create a pull request after the installation of Precaution in order to setup Precaution as a branch protection rule.

This pull request doesn't have to be merged.

## 2. Go to settings

![settings](./images/settings.png)


## 3. Choose branches

![branches](./images/branches.png)


## 4. Create a new branch protection rule 

![add_rule](./images/add_rule.png)


## 5. Setup the branch protection rule 

If you want to apply this rule to the master branch you will have to check the following options:

![branch_protection_rule.png](./images/branch_protection_rule.png)



Congratulations! Branch protection is now enabled and will prevent merging code that fails the status check.
