# Rule of Thumb: Getting Started

Welcome to the project! Here are the initial steps to get your local environment set up after you've cloned the repository.

## 1. Clone the Repository

If you haven't already, clone the repository to your local machine:

```bash
git clone https://github.com/fac-32/pro0930-verbose-train.git
cd pro0930-verbose-train
```

## 2. Install Dependencies

This project uses Node.js and npm for package management. Navigate to the `verbose_train` directory and install the necessary dependencies by running:

```bash
cd verbose_train
npm install
```

This will install all the packages listed in the `package.json` file.

## 3. Set Up Environment Variables

The project uses a `.env` file for environment variables. You'll need to create your own.

1.  In the `verbose_train` directory, create a new file named `.env`.
2.  Add the following content to the file:

```
# You can change the port if you want, but 3000 is the default.
PORT=3000
```

## 4. Run the Application

To start the application, run the following command from the `verbose_train` directory:

```bash
npm start
```

This will start the server, and you should see a message in your terminal: `✅ Server is running at http://localhost:3000`.

You can now open your browser and navigate to `http://localhost:3000` to see the application running.

## Pushing Your Changes

Remember to follow the Git workflow we have established.

1.  **Update Your Local `main`:** Before starting new work, make sure your `main` branch is up to date.
    *   `git checkout main`
    *   `git pull origin main`

2.  **Create a Feature Branch:** Create a new branch for your task.
    *   `git checkout -b your-name/your-feature`

3.  **Work and Commit:** Make your code changes and commit them with clear messages.
    *   `git add .`
    *   `git commit -m "Your descriptive commit message"`

4.  **Push Your Branch:** Push your feature branch to GitHub.
    *   `git push origin your-name/your-feature`

5.  **Open a Pull Request (PR):** Go to GitHub to open a PR to merge your branch into `main`. Request a review from a teammate.
