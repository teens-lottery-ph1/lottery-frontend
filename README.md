This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Step 1 :
 git checkout -b dev

Step 2 :
git pull origin develop

Step 3 :
git checkout -b "branch_name"

Step 4 :
git add "file name"

Step 5 :
git commit -m "message of commit "

step 6 :
git push -u origin "your branch name"


To remove branch which is sent for PR :
git checkout your-branch
git restore path/to/unwanted-file 
git checkout origin/dev -- path/to/file
git commit -m "Remove unwanted file from PR"
git push
OR
Creat new branch and do cherrypick





Frontend Implementation Walkthrough
What Was Accomplished
Since the backend updates were already completed, the following frontend changes were made to complete the workflow:

Ticket Grid Reflection (
PlayNowModal.tsx
)

Added an asynchronous fetch call within a useEffect hook to GET /api/draws/${game.id}/tickets that runs every time the modal is opened.
Leveraged the dynamic bookedNumbers state to cross-reference with the generated grid items.
Refactored the motion.button map loop: Boxes that correspond to numbers in bookedNumbers are now disabled, rendered with a red "unavailable" style, and restricted from interaction (onClick and whileTap overrides).
Admin Categories Interface (
app/admin/categories/page.tsx
)

Created a new Admin dashboard component tailored to gameTypes / Categories.
List View: The page fetches data from GET /api/categories and renders an interactive data table with category IDs, icons, descriptions, and statuses.
Creation Form: Integrated a user-friendly form on the left pane allowing admins to configure the Category Name, Description, and Icon emoji. The form posts to POST /api/categories and triggers a component refresh upon success.
Verification
You can verify the updates locally by checking the Next.js dev server:

Open the /admin/categories route to test submitting new Game Types.
Trigger the 
PlayNowModal
 inside the app to review how pre-booked seats retrieved from your backend are locked out.