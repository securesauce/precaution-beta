<!--
    Copyright 2019 VMware, Inc.
    SPDX-License-Identifier: BSD-2-Clause
-->

# Setup a Branch Protection Rule

By default, after Precaution is installed, it will not automatically prevent the merging of a pull request even if the check resulted in a failure status. 

![check_fails](./setup_images/check_fails.png)


In order to allow Precaution to prevent pull requests from merging, do the following:

## 1. Go to settings

![settings](./setup_images/settings.png)


## 2. Choose branches

![branches](./setup_images/branches.png)


## 3. Create a new branch protection rule 

![add_rule](./setup_images/add_rule.png)


## 4. Setup the branch protection rule 

If you want to apply this rule to the master branch you will have to fill and click those option:

![branch_protection_rule.png](./setup_images/branch_protection_rule.png)



Now when there is a new pull request Precaution will prohibit it from merging into the master branch until the Precaution check passes successfully.
