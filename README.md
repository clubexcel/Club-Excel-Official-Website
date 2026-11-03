# Club Excel Website 🚀

This repository contains the development code for the Club Excel website, a platform designed to manage club activities, members, events, and recruitment processes. Built with a modern tech stack, it offers a seamless experience for both administrators and members.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features) ✨
- [Tech Stack](#tech-stack) 💻
- [Installation](#installation) ⚙️
- [Usage](#usage) 💡
- [Project Structure](#project-structure) 📂
- [API Reference](#api-reference) 🔗
- [Contributing](#contributing) 🤝
- [License](#license) 📄
- [Important Links](#important-links) 🌐
- [Footer](#footer) 👣

## Project Overview

The Club Excel website is a comprehensive platform developed using Next.js and React, powered by TypeScript. It leverages Prisma with PostgreSQL for robust data management and integrates Cloudinary for image hosting. The website provides functionalities for managing club members, organizing events with dynamic registration forms, showcasing achievements and gallery items, handling contact inquiries, and managing recruitment applications. Admins have access to a dashboard for managing all aspects of the club's online presence.

## Key Features ✨

- **User Authentication**: Secure login for administrators using NextAuth.js.
- **Event Management**: Create, read, update, and delete events with details like venue, capacity, and registration windows.
- **Dynamic Forms**: Ability to add custom fields to event registration forms.
- **Member Management**: Administer club members, advisors, and alumni with roles, skills, and contact information.
- **Achievement Tracking**: Record and display club achievements with categorization and optional image uploads.
- **Gallery Management**: Organize photos into albums and manage media.
- **Contact & Recruitment Management**: Handle incoming inquiries and recruitment applications efficiently.
- **Admin Dashboard**: A centralized dashboard for managing all club data and activities.
- **Image Uploads**: Seamlessly upload images to Cloudinary for events, members, and gallery.
- **Responsive Design**: A modern, visually appealing UI that adapts to various screen sizes.
- **Interactive Elements**: Utilizes AOS for scroll animations, custom cursors, and tilt effects for an engaging user experience.

## Tech Stack 💻

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS, Bootstrap, Framer Motion, AOS, Lucide React, React Icons.
- **Backend**: Node.js, Express.js (implicitly via Next.js API routes), Prisma, PostgreSQL, bcrypt, Next-Auth.
- **Database**: PostgreSQL
- **Deployment**: Potentially Vercel (implied by Next.js conventions).
- **Image Hosting**: Cloudinary

## Installation ⚙️

To set up the project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/NJayantRao/club-website-dev.git
    cd club-website-dev
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and populate it with the necessary variables. A `.env.sample` file is provided for reference. Ensure you set up the `DATABASE_URL` for PostgreSQL and Cloudinary credentials.

    ```env
    DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
    CLOUDINARY_API_KEY="your-api-key"
    CLOUDINARY_API_SECRET="your-api-secret"
    NEXTAUTH_SECRET="your-nextauth-secret"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Generate Prisma Client and run migrations:**

    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

6.  **Access the application:**
    Open `http://localhost:3000` in your browser.

## Usage 💡

The Club Excel website serves as a dynamic platform for managing club activities.

### Core Functionalities:

- **Frontend**: Users can browse events, view achievements, explore the gallery, check the team's profiles, and contact the club via the website.
- **Admin Dashboard**: Authenticated administrators can:
  - Manage club members, advisors, and alumni.
  - Create, update, delete, and view events.
  - Add, edit, and delete achievements.
  - Upload and manage photos in the gallery.
  - View and respond to contact inquiries.
  - Manage recruitment applications, including selecting candidates.
  - View event analytics and manage event-specific forms.

### Example Use Cases:

1.  **Event Creation & Management**: An admin can create a new event, set its type (e.g., Tech Talk, Workshop), specify the venue, date/time, registration period, and capacity. They can also manage custom registration fields for the event.
2.  **Member Onboarding**: New members can be added to the club through the admin dashboard, including their role, year, skills, and contact information, with optional image uploads.
3.  **Recruitment Process**: Potential members can apply through the recruitment portal, and administrators can review applications, update selection status, and manage records.
4.  **Content Updates**: Admins can easily update the achievements section with new wins and recognitions, and manage the photo gallery by creating albums and uploading images.

## Project Structure 📂

The project uses a **feature-based architecture** for anything specific to a page or domain, layered on top of the standard Next.js `app/` router. Routing, data models, and truly cross-cutting infrastructure stay in their conventional top-level folders; everything else lives under `features/<name>/`.

```
club-website-dev/
├── .env.sample
├── .husky/
├── .prettierignore
├── app/
│   ├── (auth)/
│   │   └── sign-in/
│   │       └── page.tsx
│   ├── achievements/
│   │   └── page.tsx
│   ├── api/
│   │   ├── achievements/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── contact-us/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── events/
│   │   │   ├── [id]/
│   │   │   │   ├── form-fields/
│   │   │   │   │   ├── [fieldId]/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── responses/
│   │   │   │   │   ├── [responseId]/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── gallery/
│   │   │   ├── [id]/
│   │   │   │   ├── media/
│   │   │   │   │   └── [mediaId]/
│   │   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── members/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── our-team/
│   │   │   └── route.ts
│   │   ├── recruitment/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   └── auth/[...nextauth]/options.ts
│   ├── contact-us/
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── events/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── recruitment/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── page.tsx
│   ├── events/
│   │   ├── [id]/
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   └── page.tsx
│   ├── our-team/
│   │   └── page.tsx
│   ├── page.tsx
│   ├── recruitment/
│   │   └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/                    # Site-wide chrome + genuinely shared UI atoms only
│   ├── Footer.tsx
│   ├── Home.tsx                   # Composes features/home/components/*
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   ├── Recruitment.tsx
│   ├── RecruitmentClosed.tsx
│   └── ui/
│       └── Pagination.tsx         # Shared across public (achievements/gallery) AND admin
├── features/
│   ├── home/
│   │   ├── actions/
│   │   └── components/
│   │       ├── AboutSections.tsx
│   │       ├── Domains.tsx
│   │       ├── HeroSection.tsx
│   │       └── Portal.tsx
│   ├── events/
│   │   ├── actions/
│   │   │   └── events.ts
│   │   └── components/
│   │       ├── Events.tsx
│   │       ├── Imagecarousal.tsx
│   │       └── EventDetailModal.tsx
│   ├── contact-us/
│   │   └── components/
│   │       └── ContactUs.tsx
│   ├── our-team/
│   │   ├── actions/
│   │   │   ├── advisors.ts
│   │   │   ├── alumni.ts
│   │   │   └── members.ts
│   │   └── components/
│   │       ├── OurTeam.tsx
│   │       ├── SectionHeading.tsx
│   │       ├── TeamHero.tsx
│   │       ├── TeamMemberCard.tsx
│   │       ├── TeamTabs.tsx
│   │       └── TeamToggle.tsx
│   ├── achievements/               # Also covers the Gallery tab — no separate public route exists for it
│   │   ├── actions/
│   │   │   └── achievements.ts
│   │   ├── components/
│   │   │   ├── Achievements.tsx
│   │   │   ├── AchievementsSection.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   └── ImageBox.tsx
│   │   └── hooks/
│   │       ├── useAchievements.ts
│   │       └── useGallery.ts
│   └── dashboard/                  # Admin panel, split by sub-domain
│       ├── shared/components/      # Cross-domain admin building blocks (Popup, form fields, edit-modal shell...)
│       │   ├── DynamicAnswerFields.tsx
│       │   ├── EditModelShell.tsx
│       │   ├── FieldModal.tsx
│       │   ├── FormField.tsx
│       │   └── Popup.tsx
│       ├── auth/components/
│       │   └── SignUp.tsx
│       ├── members/components/
│       │   ├── AdminMembers.tsx
│       │   ├── MemberModal.tsx
│       │   └── SocialIcon.tsx
│       ├── events/components/
│       │   ├── AdminEvents.tsx
│       │   ├── EditEventModal.tsx
│       │   ├── EditResponseModal.tsx
│       │   ├── EventAnalytics.tsx
│       │   ├── EventFields.tsx
│       │   ├── EventModal.tsx
│       │   ├── EventOverview.tsx
│       │   ├── EventResponses.tsx
│       │   └── EventSettings.tsx
│       ├── recruitment/components/
│       │   ├── AdminRecruitment.tsx
│       │   ├── EditRecruitmentResponseModal.tsx
│       │   ├── RecruitmentFields.tsx
│       │   ├── RecruitmentModal.tsx
│       │   ├── RecruitmentResponses.tsx
│       │   └── RecruitmentSettings.tsx
│       ├── queries/components/
│       │   ├── AdminQueries.tsx
│       │   └── EditInquiryModal.tsx
│       ├── gallery/components/
│       │   └── AdminGallery.tsx
│       └── achievements/components/
│           └── AdminAchievements.tsx
├── context/
│   └── AuthProvider.tsx
├── hooks/                          # Only hooks shared across multiple features live here
│   └── useRecruitments.ts
├── lib/                            # Cross-cutting infrastructure: DB client, auth, uploads, shared validators/utils
│   ├── authorize-admin.ts
│   ├── cloudinary.ts
│   ├── destroy-cloudinary-image.ts
│   ├── media.ts
│   ├── prisma.ts
│   ├── recruitment-status.ts
│   ├── upload-image-cloudinary.ts
│   ├── upload-local-cloudinary.ts
│   ├── utils.ts
│   └── validator.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── proxy.ts
├── public/
│   └── logo.webp
├── prisma/
│   ├── migrations/
│   │
│   └── schema.prisma
├── scripts/
│   ├── admin-signup.ts
│   ├── seed-member-links.ts
│   └── seed-members.ts
├── tailwind.config.ts
├── tsconfig.json
└── types/
    └── next-auth.d.ts
```

### Feature folder conventions

Each folder under `features/<name>/` holds everything specific to that page or domain, divided by role:

- **`components/`** — UI pieces used only by that feature (page sections, modals, cards).
- **`actions/`** — server-side data-fetching functions (e.g. `unstable_cache`-wrapped Prisma queries), analogous to the data layer the old top-level `lib/` folder used to hold per-domain.
- **`hooks/`** — client hooks used only within that feature.

A subfolder only exists if that feature actually has something to put in it — e.g. `contact-us` has no `actions/` or `hooks/` since its form posts directly to an API route with no server-side fetch of its own.

**What stays outside `features/`:**

- **`app/`** — routing is a Next.js convention, not a feature concern. Route `page.tsx`/`route.ts` files stay put and simply import from the relevant `features/<name>/components` or `features/<name>/actions`.
- **`components/`** (top level) — site-wide chrome (`Navbar`, `Footer`, `Layout`) and UI atoms genuinely shared across _multiple_ features or between the public site and the admin dashboard (e.g. `Pagination.tsx`, used by both the public achievements/gallery pages and every admin list view).
- **`lib/`** — infrastructure with no single feature owner: the Prisma client, admin-auth checks used by API routes across every domain, Cloudinary upload/delete helpers, shared validators.
- **`hooks/`** (top level) — hooks used by more than one feature (`useRecruitments` is read by both the home page's hero section and the public recruitment flow).

Within `features/dashboard/`, the same pattern repeats one level deeper: each admin sub-domain (`members`, `events`, `recruitment`, `queries`, `gallery`, `achievements`, `auth`) gets its own `components/`, and anything genuinely used across _multiple_ admin sub-domains (`Popup`, the edit-modal shell, shared form fields) lives in `features/dashboard/shared/components/` rather than being duplicated or forcing one domain to import from another's folder.

## API Reference 🔗

The project exposes several API endpoints for managing club data. All endpoints related to managing data (events, members, achievements, etc.) are protected and require administrator authentication.

- **/api/achievements**:
  - `GET`: Retrieves a list of achievements with pagination.
  - `POST`: Creates a new achievement.
- **/api/achievements/[id]**:
  - `PATCH`: Updates an existing achievement.
  - `DELETE`: Deletes an achievement.
- **/api/contact-us**:
  - `POST`: Submits a new contact inquiry.
  - `GET`: Retrieves a list of contact inquiries (Admin only).
- **/api/contact-us/[id]**:
  - `GET`: Retrieves a specific contact inquiry (Admin only).
  - `PATCH`: Updates the status of a contact inquiry (Admin only).
  - `DELETE`: Deletes a contact inquiry (Admin only).
- **/api/events**:
  - `GET`: Retrieves a list of events with filtering and pagination.
  - `POST`: Creates a new event.
- **/api/events/[id]**:
  - `GET`: Retrieves details of a specific event.
  - `PATCH`: Updates an existing event.
  - `DELETE`: Deletes an event.
- **/api/events/[id]/form-fields**:
  - `POST`: Adds a custom form field to an event.
- **/api/events/[id]/form-fields/[fieldId]**:
  - `PATCH`: Updates a specific form field.
  - `DELETE`: Deletes a specific form field.
- **/api/events/[id]/responses**:
  - `GET`: Retrieves responses for a specific event (Admin only).
  - `POST`: Submits a response for an event.
- **/api/events/[id]/responses/[responseId]**:
  - `PATCH`: Updates a response (e.g., attendance status).
  - `DELETE`: Deletes a response.
- **/api/gallery**:
  - `GET`: Retrieves a list of gallery albums with pagination.
  - `POST`: Creates a new gallery album with photos.
- **/api/gallery/[id]/media/[mediaId]**:
  - `DELETE`: Removes a specific photo from an album.
- **/api/gallery/[id]**:
  - `PATCH`: Updates an existing gallery album (name and photos).
  - `DELETE`: Deletes a gallery album and its associated media.
- **/api/members**:
  - `POST`: Creates a new club member.
- **/api/members/[id]**:
  - `DELETE`: Deletes a member.
  - `PATCH`: Updates an existing member.
- **/api/our-team**:
  - `GET`: Retrieves team members (advisors, alumni) with filtering and pagination.
- **/api/recruitment**:
  - `POST`: Submits a new recruitment application.
  - `GET`: Retrieves recruitment applications (Admin only).
  - `DELETE`: Clears all recruitment applications (Admin only).
- **/api/recruitment/[id]**:
  - `PUT`: Updates a recruitment application (e.g., selection status).
  - `DELETE`: Deletes a single recruitment application.

## Contributing 🤝

Contributions are welcome! Please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature (`git checkout -b feature/your-feature`).
3.  Commit your changes (`git commit -am 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Open a Pull Request.

## License 📄

[LICENSE](LICENSE)

## Important Links 🌐

- **Live Demo**: https://club-website-dev.vercel.app

## Footer 👣

© 2026 Club Excel. Built for the future.

[Repository](https://github.com/NJayantRao/club-website-dev)
