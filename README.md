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

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Homepage customization

The homepage uses Samdani Group's name, company background, and five collection
names from its [existing website](https://samdanigroup.com/). Each collection
has its own page at `/collections/<slug>`. The collection descriptions, palettes,
finishes, and applications are placeholder copy; confirm them with Samdani Group
before publishing. The logo in the shared header and footer is sourced from
Samdani Group's website; the project photos are placeholders.

- Page content and footer contact details: `src/app/page.tsx`
- Contact page and inquiry form: `src/app/contact/page.tsx`
- Collection detail pages: `src/app/collections/[slug]/page.tsx`
- Shared navigation: `src/components/site-header.tsx`
- Shared footer: `src/app/site-footer.tsx`
- Samdani Group logo and mark: `public/images/samdani-group-logo.png` and
  `public/images/samdani-group-mark.png` (from
  [Samdani Group's website](https://samdanigroup.com/))
- Stone collection data and detail copy: `src/lib/collections.ts`
- Homepage styling: `src/app/globals.css`
- Footer styling: `src/app/footer.module.css`
- Contact page styling: `src/app/contact/contact.module.css`
- Collection page styling: `src/app/collections/[slug]/collection.module.css`
- Homepage slideshow (GSAP): `src/components/stone-slideshow.tsx` and
  `src/components/stone-slideshow.module.css`
- Slideshow images, captions, and linked collections: `src/lib/showcase.ts`
- Page title and description: `src/app/layout.tsx`

The locally stored interior photographs are placeholders from Unsplash:
[hero](https://images.unsplash.com/photo-1618221195710-dd6b41faaea6) and
[about section](https://images.unsplash.com/photo-1556912172-45b7abe8b7e1).
The slideshow photographs are also from Unsplash:
[living room](https://images.unsplash.com/photo-1600607687939-ce8a6c25118c),
[bathroom](https://images.unsplash.com/photo-1620626011761-996317b8d101),
[entrance](https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3), and
[residence](https://images.unsplash.com/photo-1600585154340-be6161a56a0c).
They are available under the [Unsplash License](https://unsplash.com/license).
The [marble texture](https://commons.wikimedia.org/wiki/File:Marble_Texture.png)
is available under CC0. The footer's published address, email, phone number,
collections, and social links were taken from
[Samdani Group's website](https://samdanigroup.com/).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
