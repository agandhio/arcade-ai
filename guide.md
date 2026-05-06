# Local Setup Guide

Welcome! Follow these step-by-step instructions to get this project running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- A package manager like [npm](https://www.npmjs.com/) (comes with Node.js), [Yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/).

## Step 1: Clone the Repository

First, clone the project repository from GitHub to your local machine. Open your terminal and run:

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd <YOUR_REPO_DIRECTORY>
```

*(Replace `<YOUR_GITHUB_REPO_URL>` with the actual URL of the repository, and `<YOUR_REPO_DIRECTORY>` with the name of the folder it was cloned into.)*

## Step 2: Install Dependencies

Once you are inside the project directory, install the required dependencies using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Step 3: Set Up Environment Variables

This application uses the Google Gemini API to power the AI arcade assistant, so you need an API key to make it work.

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a new API key.
2. In the root directory of the project, create a new file named `.env.local`.
3. Add your Gemini API key to `.env.local` as `NEXT_PUBLIC_GEMINI_API_KEY`:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

*(Note: `.env.local` is included in `.gitignore` by default in Next.js projects to prevent you from accidentally committing your secret keys to GitHub.)*

## Step 4: Run the Development Server

Now you are ready to start the application! Run the following command:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The terminal should show that the server has started. 

## Step 5: View the App

Open your web browser and navigate to:
[http://localhost:3000](http://localhost:3000)

You should now see the Retro Arcade running locally on your machine.
If you have any issues with the AI chat, ensure your API key in `.env.local` is correct and you have restarted the server after adding it.
