workflow "Build and Test" {
  on = "push"
  resolves = ["Test"]
}
action "Build" {
  uses = "actions/npm@master"
  args = "install"
}
action "Test" {
  needs = "Build"
  uses = "actions/npm@master"
  args = "test"
}
# Filter for master branch
action "Master" {
  needs = "Test"
  uses = "actions/bin/filter@master"
  args = "branch master"
}

