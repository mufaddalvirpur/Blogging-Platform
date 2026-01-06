## Full-Stack Blogging Platform - by Mufaddal Virpurwala

**This is a full-stack multi-user blogging platform, built as a technical assessment. It is a complete application that allows users to create, read, update, and delete blog posts, manage categories, and filter content, all wrapped in a clean, modern, and type-safe stack.**

**This project was built from the ground up using Next.js 15 (App Router), tRPC for an end-to-end type-safe API, Drizzle ORM with a PostgreSQL database (hosted on Neon), and Tailwind CSS for styling.**

### Live Deployment

**You can view the live, deployed application here:**
https://blogging-platformz.vercel.app/ 

### Features Implemented

This project successfully implements all "Must Have" and "Should Have" features as specified by the assessment guidelines.

**Priority 1: Must Have**

[x] Post CRUD: Full Create, Read, Update, and Delete operations for blog posts.

[x] Category CRUD: Full Create, Read, Update, and Delete operations for categories.

[x] Post-Category Association: Posts can be assigned one or more categories on creation and update.

[x] Blog Listing Page: Main blog page (/blog) that shows all published posts.

[x] Individual Post Page: Dynamic routes (/blog/[id]) to view a single, full-length post.

[x] Category Filtering: The blog page can be filtered to show posts from a specific category.

[x] Basic Responsive Navigation: The application is fully navigable and usable on mobile devices.

[x] Clean, Professional UI: A clean, dark-mode UI focused on readability and usability.

**Priority 2: Should Have**

[x] Landing Page: A 3-section landing page (/) serves as the application's entry point, directing users to the blog or dashboard.

[x] Dashboard Page: A dedicated /dashboard page for managing all posts (both drafts and published).

[x] Draft vs. Published Status: Posts can be saved as "Drafts" or "Published." Only published posts appear on the public blog.

[x] Loading and Error States: All data-fetching operations include clear loading and error-handling states.

[x] Mobile-Responsive Design: The layout adapts smoothly to all screen sizes.

[x] Content Editor: Uses a Markdown editor (react-simplemde-editor) for a rich content creation experience.

### Technical Architecture & Decisions

**1. tRPC Router Structure**

The API layer, located in src/server/api/, is organized by data model for a clean separation of concerns:

root.ts: The main appRouter that merges all other routers into a single, unified API.

post.ts: Handles all logic for posts (CRUD, filtering, published status).

category.ts: Handles all logic for categories (CRUD).

This structure keeps the API modular and easy to extend.

**2. Database Schema**

The schema is defined in src/server/db/schema.ts using Drizzle ORM.

posts: Stores post details. id is a varchar (for CUIDs) and published is a boolean.

categories: Stores category details. id is a serial (auto-incrementing integer).

postsToCategories: A many-to-many join table linking posts and categories by their respective IDs.

**3. State Management**

**Server State:** Handled entirely by tRPC's React Query integration. This provides caching, optimistic updates, and automatic cache invalidation (e.g., utils.post.getAll.invalidate()) out-of-the-box, keeping the UI perfectly in sync with the database.

**Client State:** Handled by React useState for simple UI state, such as form inputs and filter selections.

### How to Run Locally

**1. Prerequisites**

Node.js (v18 or later)

npm

A free PostgreSQL database. I used Neon.

**2. Setup Instructions**

Clone the Repository:

git clone [https://github.com/](https://github.com/)[YOUR-USERNAME]/[YOUR-REPO-NAME].git
cd [YOUR-REPO-NAME]


**Install Dependencies:**

npm install


**Set Up Environment Variables:**
Create a file named .env.local in the root of the project. Get your database connection string from Neon (or your provider) and add it to this file:

DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"


**Push the Schema to the Database:**
This command will read your schema file and automatically create all the necessary tables in your remote database.

npm run db:push


**Run the Development Server:**

npm run dev


The application will be running and accessible at http://localhost:3000.

**3. Seeding the Database**

This project does not require a database seed script. After running db:push, you can populate the database using the application's UI:

Go to http://localhost:3000/categories to create your first categories.

Go to http://localhost:3000/posts/new to create your first post.

**Trade-offs and Decisions**

**Content Editor (Markdown):** I chose to implement Markdown support as suggested in the assessment's "Recommended Shortcuts." This was significantly faster than integrating a complex block-style editor, which allowed me to spend more time perfecting the core API logic, database relationships, and type-safety.

**UI Styling (Pure Tailwind):** I opted to use pure Tailwind CSS for all components instead of a pre-built library. While a library like shadcn/ui might have been quicker, building the components from scratch demonstrates a strong understanding of Tailwind and allowed me to create a lightweight, custom UI that perfectly matched the project's design goals.

**Total time spent: ~15 hours**

## Mufaddal Virpur
