# Git Workflow for Collaborative Projects

This document outlines a recommended Git workflow for teams with a protected `main` branch. This workflow is based on feature branching and pull requests, which is a common and effective way to collaborate on code.

## 1. The `main` Branch

* This branch should always reflect a production-ready state.
* No one can push directly to it. Changes only get in by merging a stable `develop` branch.

## 2. The `develop` Branch

* A long-running branch created from `main`.
* This is the primary integration branch for features.
* Most of the time, developers will be interacting with this branch.

## 3. Feature Branches

* For any new feature or bugfix, create a new, descriptively named branch from the `develop` branch.
* Examples: `feature/add-user-login`, `bugfix/fix-payment-bug`
* **Command to create a feature branch:**

    ```bash
    git checkout develop
    git pull
    git checkout -b feature/your-feature-name
    ```

## 4. Work and Commit

* Work on your feature branch, making small, logical commits.
* **Command to commit changes:**

```bash
    git add .
    git commit -m "Your descriptive commit message"
```

## 5. Push Feature Branch

* Push your feature branch to the remote repository. This allows others to see your work and provides a backup.
* **Command to push a feature branch:**

```bash
git push -u origin feature/your-feature-name
```

## 6. Open a Pull Request (PR)

* When the feature is complete and tested, open a pull request to merge your feature branch into the `develop` branch.
* In the PR description, explain what the change does and why.
* Assign one or more teammates to review the code.

## 7. Code Review and Discussion

* Team members review the code, provide feedback, and suggest improvements.
* Automated checks (like tests and linters) should run on the PR.

## 8. Merge

* Once the PR is approved and all checks pass, it is merged into the `develop` branch.
* After merging, the feature branch can be deleted.

## 9. Releasing to `main`

* When you are ready to release a new version, create a pull request to merge the `develop` branch into `main`.
* This PR should also be reviewed to ensure that the `develop` branch is stable.
* Once merged, you can tag the `main` branch with a version number (e.g., `v1.0.0`).

## Why this workflow is good

* **Protects `main`:** The `main` branch is always stable.
* **Code Quality:** Code is reviewed before it gets into the `develop` branch.
* **Parallel Development:** Developers can work on different features in isolation without blocking each other.
* **Clear History:** The commit history on `main` is clean and consists of merges from `develop`, representing new versions.
