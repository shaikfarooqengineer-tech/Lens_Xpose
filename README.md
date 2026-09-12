# Lens Expose

Cinematic portfolio built with React, TypeScript, Vinext, and CSS. Requires Node 22.13+ (Node 24 recommended).

## Run
npm install
npm run dev

## Content
Edit lib/content.ts for photography, films, testimonials, and social links. Current photography is a credited Pexels moodboard. Testimonials are explicitly labeled samples, the collaborator strip uses disciplines instead of unverified client logos, and films show a real missing-media state. Replace these before client launch. Supplied camera artwork lives in public/images.

## Services
Copy .env.example into .env and configure a verified Resend sender, recipient and API token for contact notifications. No message is reported as sent without provider success. Configure an HTTPS Instagram feed adapter returning { data: [{ id, media_url, permalink, caption, media_type, thumbnail_url }] }. The adapter must handle current Meta account eligibility and token renewal; secrets never enter the client bundle. Set actual social handles in lib/content.ts. No social feed is simulated.

## Motion
Hero-scoped sticky background; native scroll-driven horizontal desktop gallery with measured travel; mobile swipe gallery; reversible entrance reveals; paused-on-interaction testimonial carousel; accessible image dialogs; decorative cursor plume; reduced-motion alternatives.
