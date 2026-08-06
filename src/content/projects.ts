/**
 * Projects + case studies.
 *
 * Any link left as `null` is hidden in the UI rather than rendered dead — fill
 * these in as the live sites and screen recordings go up.
 *
 * A note on `results`: these are written qualitatively on purpose. Swap in real
 * numbers (invoices reconciled, checkout completion rate, payout volume) once
 * you have them — concrete metrics are the single highest-leverage edit you can
 * make to this page.
 */

export type CaseStudySection = {
  title: string;
  body: string[];
  list?: string[];
};

/** A deployed surface of a project — a monorepo can expose more than one. */
export type ProjectDeployment = {
  label: string;
  url: string;
  /** One line on what this surface is and who it is for. */
  description: string;
};

export type Project = {
  slug: string;
  name: string;
  /** One-line description used on the card and in metadata. */
  tagline: string;
  /** Two or three sentences, case-study page only. */
  summary: string;
  year: string;
  status: "Live" | "In development" | "Private client work";
  domain: string;
  liveUrl: string | null;
  /**
   * Every deployed surface, for projects that ship more than one app. When set,
   * this replaces the single "Visit live site" button with one per surface;
   * `liveUrl` should still point at the primary one for cards and metadata.
   */
  deployments?: ProjectDeployment[];
  demoVideoUrl: string | null;
  repoUrl: string | null;
  tags: string[];
  features: string[];
  /** Short label pairs shown as a spec strip on the case-study page. */
  facts: { label: string; value: string }[];
  caseStudy: CaseStudySection[];
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "autohub-marketplace",
    name: "AutoHub Marketplace",
    tagline:
      "Car marketplace monorepo — a KES-priced storefront with an AI sales assistant, and a separate admin console for listings and orders.",
    summary:
      "A vehicle marketplace shipped as one monorepo and two deployments: a customer storefront where buyers browse listings, ask an AI assistant real questions about stock, and reserve a car over M-Pesa; and a dealer-side admin console on its own domain for inventory, pricing, enquiries and orders. The assistant is grounded in the live catalogue, so it answers from what is actually on the lot rather than from a scripted FAQ.",
    year: "2026",
    status: "Live",
    domain: "E-commerce / Automotive / AI",
    liveUrl: "https://autohub-marketplace-web.vercel.app",
    deployments: [
      {
        label: "Customer storefront",
        url: "https://autohub-marketplace-web.vercel.app",
        description:
          "The public marketplace — browse and filter vehicles, chat to the AI assistant, and reserve or buy over M-Pesa. No account needed to look.",
      },
      {
        label: "Admin console",
        url: "https://autohub-marketplace-admin-p6qn.vercel.app",
        description:
          "The dealer back office — listings, photos, pricing, stock status, enquiries and order fulfilment, behind its own sign-in.",
      },
    ],
    demoVideoUrl: null, // TODO: paste the Loom / YouTube walkthrough URL
    repoUrl: null, // TODO: add if the repo is public
    tags: [
      "Next.js",
      "TypeScript",
      "Monorepo",
      "Supabase",
      "Tailwind CSS",
      "Claude API",
      "AI chatbot",
      "M-Pesa",
    ],
    features: [
      "AI sales assistant grounded in the live vehicle catalogue — it answers from real stock, price and availability, not a scripted FAQ",
      "Monorepo shipping two independently deployed apps — customer storefront and dealer admin console — against one shared database",
      "Faceted vehicle search: make, model, body type, year, mileage, transmission, fuel and KES price band",
      "Vehicle detail pages with a full photo gallery, specification table and finance-style monthly estimate",
      "Enquiry and test-drive booking captured against a listing, so a lead is never a loose WhatsApp message",
      "M-Pesa checkout for reservation deposits, with the same idempotent callback handling as the rest of my payment work",
      "Admin console for listings, imagery, pricing, stock status, enquiries and order fulfilment",
    ],
    facts: [
      { label: "Role", value: "Solo developer — design, frontend, backend, AI" },
      { label: "Timeline", value: "2026" },
      { label: "Deployments", value: "Two — storefront + admin console" },
      { label: "AI", value: "Anthropic Claude API, catalogue-grounded" },
      { label: "Data", value: "Supabase Postgres + Storage" },
    ],
    caseStudy: [
      {
        title: "The problem",
        body: [
          "Buying a used car in Kenya starts on a marketplace listing and immediately leaves it. The listing shows a photo and a price; every real question — is it still available, what is the mileage, has it been serviced, will you take an offer — becomes a phone call or a WhatsApp thread with a dealer who is answering forty of them a day.",
          "That hurts both sides. Buyers wait hours for an answer that is written on the listing they are already looking at, and dealers spend their day re-typing the same five facts instead of selling. The information exists; it just is not reachable at the moment someone wants it.",
        ],
      },
      {
        title: "The approach",
        body: [
          "The marketplace itself is the straightforward part: server-rendered listing pages, faceted search across the attributes people actually filter by, and prices held in KES cents as integers so nothing drifts between a listing card and an M-Pesa prompt.",
          "The part worth building carefully is the assistant. It sits on the storefront and answers questions about the catalogue, and the design constraint I set was that it must never invent a fact about a vehicle. Rather than fine-tuning anything or pasting the catalogue into a prompt, the assistant is given tools that read the same database the listing pages read — search the catalogue, fetch one vehicle, check availability — and it answers from what those return. If a car sold this morning, the assistant knows, because it is looking at the row the storefront is looking at.",
        ],
        list: [
          "Next.js App Router, server-rendered listing and detail pages for fast first paint and clean indexing",
          "Supabase Postgres for the catalogue, enquiries and orders; Supabase Storage for vehicle imagery",
          "Anthropic Claude API for the assistant, with catalogue access exposed as tools rather than pasted into the prompt",
          "Every assistant response traceable to the listing rows that produced it",
          "M-Pesa checkout for reservation deposits, reusing the idempotent callback pattern from my other payment work",
        ],
      },
      {
        title: "Two apps, one repo",
        body: [
          "The storefront and the admin console are separate Next.js applications in one monorepo, deployed to two domains. A shopper's bundle contains only shop code — no admin routes, no management components, nothing hidden behind a runtime check rather than simply not being there.",
          "It also decouples the release cadence. A dealer adding listings changes the admin app far more often than the marketplace changes, and pushing an inventory tweak should not risk the page a buyer is mid-enquiry on. Vehicle, price and order types live in shared packages, so a schema change breaks the build in both apps rather than breaking production in one.",
        ],
        list: [
          "Storefront at autohub-marketplace-web.vercel.app — public, cached, indexed",
          "Admin console at autohub-marketplace-admin-p6qn.vercel.app — authenticated, noindex",
          "One Supabase project behind both, with row-level security deciding what each app's client may read",
          "Shared types for vehicles, pricing and orders, so the two apps cannot drift out of agreement",
        ],
      },
      {
        title: "Hard parts",
        body: [
          "Keeping the assistant honest was the whole job. A chatbot that confidently offers a car that sold last week is worse than no chatbot at all, because it costs the dealer the trust that made the buyer ask. Grounding every answer in a tool call against live rows is what makes the difference — and where the catalogue genuinely does not have an answer (service history, a specific negotiation), the assistant says so and hands the conversation to the dealer instead of filling the gap.",
          "Scoping it was the second part. An assistant with database access will happily answer questions it has no business answering, so the tools it holds are narrow and read-only: search listings, read one listing, check availability. It cannot write, cannot see another customer's enquiry, and cannot reach anything the public storefront could not already display.",
          "The third was cost and latency on a page people browse casually. Catalogue context is cached rather than re-sent on every turn, and the assistant is given the small slice of the catalogue a question actually needs rather than the whole inventory — a search tool returning ten matching rows beats pasting four hundred listings into a prompt, in both directions.",
        ],
      },
      {
        title: "Where it landed",
        body: [
          "The questions that used to become phone calls now get answered on the page, from live data, at whatever hour the buyer is browsing. The ones that genuinely need a human arrive at the dealer as an enquiry attached to a specific vehicle rather than as an unattributed message.",
          "On the operations side, the dealer runs the whole lot from the admin console — list a car, upload photos, change a price, mark one sold — and the storefront and the assistant both reflect it on the next load, because there is only one place the truth lives.",
        ],
      },
    ],
    featured: true,
  },
  {
    slug: "mwangaza-academy",
    name: "Mwangaza Academy",
    tagline:
      "School management system with fee invoicing, M-Pesa paybill reconciliation and SMS notifications.",
    summary:
      "A school operations portal built around the part Kenyan schools actually struggle with: getting fees paid, matched to the right student, and confirmed to the parent. Bursars raise term invoices, parents pay to a paybill from their own phones, and the system reconciles and notifies without anyone re-keying an M-Pesa SMS into a spreadsheet.",
    year: "2025",
    status: "Live",
    domain: "Education / Fintech",
    liveUrl: "https://school-fees-portal-56m9.vercel.app",
    demoVideoUrl: null, // TODO: paste the Loom / YouTube walkthrough URL
    repoUrl: null, // TODO: add if the repo is public
    tags: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "React Query",
      "Tailwind CSS",
      "M-Pesa C2B",
      "Africa's Talking",
    ],
    features: [
      "Term-based fee structures with automatic per-student invoice generation",
      "M-Pesa paybill (C2B) integration that matches payments to students by admission number",
      "Automated SMS receipts and arrears reminders via Africa's Talking",
      "Bursar dashboard for balances, payment history and printable statements",
    ],
    facts: [
      { label: "Role", value: "Solo developer — design, frontend, backend" },
      { label: "Timeline", value: "Ongoing" },
      { label: "Payments", value: "M-Pesa C2B (paybill)" },
      { label: "Data", value: "Supabase Postgres + RLS" },
    ],
    caseStudy: [
      {
        title: "The problem",
        body: [
          "Fee collection in most small and mid-sized Kenyan schools runs on a paybill number and a spreadsheet. A parent pays, the bursar reads the M-Pesa confirmation SMS, then types the amount against a student by hand. It works until it doesn't: a parent uses a sibling's admission number, someone pays a round figure across two children, or a transaction is entered twice at the end of a long day.",
          "The cost lands on the bursar's office — hours of manual reconciliation each week, disputed balances that nobody can evidence, and parents who only discover arrears when a child is sent home.",
        ],
      },
      {
        title: "The approach",
        body: [
          "I modelled the domain around an immutable ledger rather than a mutable balance field. Invoices and payments are both append-only rows; a student's balance is derived, never stored. That single decision removed an entire class of reconciliation bugs and made every figure on screen traceable to the transaction that produced it.",
          "For collection I registered C2B validation and confirmation URLs against the school's paybill, using the M-Pesa account number field as the student's admission number. Daraja posts each payment to the confirmation endpoint, which resolves the admission number to a student, writes a payment row, and fires an SMS receipt through Africa's Talking.",
        ],
        list: [
          "Next.js App Router with server components for dashboards, React Query for the interactive bursar views",
          "Supabase Postgres with row-level security scoped per school, so a bursar can only ever read their own institution's rows",
          "Daraja C2B confirmation handler running as a route handler with the Supabase service role, isolated from anything client-reachable",
          "Africa's Talking for transactional SMS — receipts on payment, reminders on arrears",
        ],
      },
      {
        title: "Hard parts",
        body: [
          "M-Pesa callbacks are unauthenticated POSTs from Safaricom's infrastructure, and they retry. Treating them as trusted, or as exactly-once, is the most common way these integrations break. Every confirmation is deduplicated on the M-Pesa transaction ID with a unique constraint, so a retried callback is a no-op instead of a double credit.",
          "The second hard part was the messy middle of real payments: partial amounts, overpayments that need to roll to next term, and a parent typing an admission number with a typo. Unmatched payments land in a review queue with a suggested student rather than being silently dropped — a bursar resolves them in a click, and the ledger stays honest.",
          "Daraja's OAuth tokens expire hourly, and the sandbox behaves differently from production. I wrapped token acquisition in a cached helper with a safety margin before expiry, and kept shortcodes and credentials fully environment-driven so sandbox and production never share configuration.",
        ],
      },
      {
        title: "Where it landed",
        body: [
          "Reconciliation moved from a manual, end-of-day spreadsheet exercise to something that happens the moment a parent pays. Parents get an instant SMS receipt, which cut the volume of 'did my payment go through' calls to the office.",
          "Because balances are derived from an append-only ledger, any figure on the dashboard can be drilled back to the exact M-Pesa transaction that produced it — which is what makes a disputed balance a two-minute conversation instead of an afternoon.",
        ],
      },
    ],
    featured: true,
  },
  {
    slug: "horology",
    name: "HOROLOGY",
    tagline:
      "Kenya-focused luxury watch monorepo — a KES-priced storefront and a separate admin console, deployed independently.",
    summary:
      "A commerce build shipped as one monorepo and two deployments: a public storefront with prices in KES and an STK Push checkout, and an admin console on its own domain for catalogue, stock and order fulfilment. Shoppers never load a byte of admin code, and either app can be redeployed without taking the other down.",
    year: "2025",
    status: "Live",
    domain: "E-commerce / Fintech",
    liveUrl: "https://watchproject-storefront.vercel.app",
    deployments: [
      {
        label: "Storefront",
        url: "https://watchproject-storefront.vercel.app",
        description:
          "The public shop — catalogue, product pages, cart and M-Pesa checkout. No account needed to browse.",
      },
      {
        label: "Admin console",
        url: "https://watchproject-admin.vercel.app",
        description:
          "The back office — products, images, pricing, stock and order fulfilment, behind its own sign-in.",
      },
    ],
    demoVideoUrl: null, // TODO: paste the Loom / YouTube walkthrough URL
    repoUrl: null, // TODO: add if the repo is public
    tags: [
      "Next.js",
      "TypeScript",
      "Monorepo",
      "Supabase",
      "React Query",
      "Tailwind CSS",
      "M-Pesa STK Push",
    ],
    features: [
      "Monorepo shipping two independently deployed apps against one shared database",
      "Storefront: category navigation (Dress, Dive, Chronograph, Smart) with KES-native pricing",
      "Guest checkout over M-Pesa STK Push — enter your number, approve on your handset, done",
      "Admin console on a separate domain for catalogue, imagery, stock and fulfilment",
      "Order state machine driven by Daraja callbacks, with a polling fallback",
      "Shared pricing and order types, so the two apps cannot drift out of agreement",
    ],
    facts: [
      { label: "Role", value: "Solo developer — design, frontend, backend" },
      { label: "Timeline", value: "2025" },
      { label: "Deployments", value: "Two — storefront + admin console" },
      { label: "Payments", value: "M-Pesa STK Push (Lipa Na M-Pesa Online)" },
      { label: "Data", value: "Supabase Postgres + Storage" },
    ],
    caseStudy: [
      {
        title: "The problem",
        body: [
          "Most e-commerce templates assume a card and a dollar price. In Kenya that combination is a conversion killer: card penetration is low, buyers distrust entering card details on an unfamiliar storefront, and a USD price with an unclear exchange rate reads as a hidden cost.",
          "A high-consideration category like luxury watches makes it worse. If a buyer is about to spend six figures in KES, every point of friction or ambiguity at checkout is a reason to close the tab.",
        ],
      },
      {
        title: "The approach",
        body: [
          "Prices are stored and displayed in KES cents as integers — no floats, no conversion step, no rounding surprises between the product page and the M-Pesa prompt. The number on the card is the number on your phone.",
          "Checkout collects a phone number and triggers an STK Push. The buyer approves on their own handset with their own PIN, which means no card details ever touch the site. The UI holds an honest 'waiting for your approval' state while Daraja resolves, rather than pretending the order is complete.",
        ],
        list: [
          "Next.js App Router, server-rendered catalogue pages for fast first paint and clean indexing",
          "Orders as an explicit state machine: pending → awaiting approval → paid / failed / cancelled",
          "STK Push initiated server-side; CheckoutRequestID stored against the order to correlate the callback",
          "Admin console behind Supabase Auth with RLS, covering catalogue, stock and fulfilment",
        ],
      },
      {
        title: "Two apps, one repo",
        body: [
          "The storefront and the admin console are separate Next.js applications in one monorepo, deployed to two domains. That split is the structural decision the rest of the build leans on. A shopper's bundle contains only shop code — no admin routes, no management components, nothing that has to be hidden behind a check at runtime rather than simply not being there. The attack surface of the public app shrinks to what it actually does.",
          "It also decouples the release cadence. The admin console changes far more often than the shop does, and pushing a fulfilment tweak should not risk the page a customer is mid-checkout on. Two deployments means two independent rollbacks.",
        ],
        list: [
          "Storefront at watchproject-storefront.vercel.app — public, cached, indexed",
          "Admin console at watchproject-admin.vercel.app — authenticated, noindex, redirects to /login at the root",
          "Product, price and order types live in shared packages, so a schema change breaks the build in both apps rather than in production in one",
          "One Supabase project behind both, with RLS deciding what each app's client is allowed to read",
        ],
      },
      {
        title: "Hard parts",
        body: [
          "STK Push has a genuinely awkward failure surface. The prompt can be ignored until it times out, cancelled on the handset, or rejected for insufficient funds — and each of those arrives as a different Daraja result code, some minutes later. I mapped result codes to human sentences ('you cancelled the prompt', 'the request timed out — try again') instead of surfacing raw codes, because a numeric error at the payment step is where trust evaporates.",
          "Callbacks also cannot be relied on as the only signal. Networks drop, and a callback that never arrives leaves an order stuck in limbo. The client polls order status while a transaction is pending, and a server-side status query reconciles anything the callback missed — whichever confirms first wins, and the state machine makes the write idempotent either way.",
          "Stock was the other subtle one. Reserving inventory at STK initiation means abandoned prompts silently eat stock; reserving at confirmation means two buyers can both be told yes. I settled on a short-lived reservation tied to the pending order, released automatically on timeout or failure.",
        ],
      },
      {
        title: "Where it landed",
        body: [
          "Checkout is three fields and a phone tap, with no card form and no currency ambiguity — the two things that most reliably lose a Kenyan buyer.",
          "On the operations side, the admin console means the person running the shop can list a watch, watch stock move and mark an order fulfilled without touching the database or asking a developer for anything — and it lives on its own domain, so the shop is never waiting on a back-office deploy.",
        ],
      },
    ],
    featured: true,
  },
  {
    slug: "chama-management-platform",
    name: "Chama Management Platform",
    tagline:
      "Multi-tenant SaaS for savings groups — role-based access, M-Pesa contributions and payouts, subscription billing.",
    summary:
      "Chamas are how a large share of Kenyans save and invest together, and most still run on a treasurer's notebook and a WhatsApp group. This is a multi-tenant platform where each group gets its own isolated space, members contribute over STK Push, payouts go out over B2C, and every shilling is visible to the people it belongs to.",
    year: "2026",
    status: "In development",
    domain: "Fintech / SaaS",
    liveUrl: "https://chama-management-platform-hazel.vercel.app",
    demoVideoUrl: null, // TODO: paste the Loom / YouTube walkthrough URL
    repoUrl: null, // TODO: add if the repo is public
    tags: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "React Query",
      "Tailwind CSS",
      "M-Pesa STK Push",
      "M-Pesa B2C",
      "Multi-tenant",
    ],
    features: [
      "Multi-tenant architecture — every group's data isolated at the database level",
      "Role-based access for admin, chairperson, treasurer and member",
      "M-Pesa STK Push for contributions and B2C for member payouts and loan disbursement",
      "Subscription billing per group, with plan tiers and recurring collection",
    ],
    facts: [
      { label: "Role", value: "Solo developer — architecture, frontend, backend" },
      { label: "Timeline", value: "2026, in progress" },
      { label: "Payments", value: "M-Pesa STK Push + B2C" },
      { label: "Data", value: "Supabase Postgres, RLS-enforced tenancy" },
    ],
    caseStudy: [
      {
        title: "The problem",
        body: [
          "A chama runs on trust, and trust runs on a shared, agreed record. In practice that record is a treasurer's notebook plus a WhatsApp thread of M-Pesa screenshots. Contributions get missed, the running total is whatever the treasurer last said it was, and a member who wants to check their own history has to ask someone.",
          "The failure mode isn't usually fraud — it's ambiguity. Nobody can independently verify the number, so disputes become personal rather than factual.",
        ],
      },
      {
        title: "The approach",
        body: [
          "Every group is a tenant, and tenancy is enforced in the database rather than in application code. Row-level security policies key off the authenticated user's membership, so a query written carelessly in the frontend still cannot return another group's rows. Roles layer on top: a member sees their own contributions and the group totals, a treasurer records and reconciles, a chairperson approves payouts, an admin manages membership.",
          "Money moves in both directions. Contributions come in over STK Push, so a member approves on their own handset and the ledger updates from the callback. Payouts and loan disbursements go out over B2C, which is a materially more sensitive surface and is gated behind an explicit approval step rather than a single click.",
        ],
        list: [
          "Supabase RLS as the tenancy boundary, with policies tested as first-class behaviour",
          "Role-based UI derived from the same permissions the database enforces — never a client-side-only check",
          "STK Push contributions and B2C payouts, both reconciled into one append-only ledger",
          "Per-group subscription billing with plan tiers and recurring collection",
        ],
      },
      {
        title: "Hard parts",
        body: [
          "B2C is the sharp edge. Sending money out requires initiator credentials and a security credential encrypted against Safaricom's public certificate, and unlike a failed collection, a mistake here moves real money to the wrong person. Payouts require a recorded approval, are idempotency-keyed so a retried request can't double-disburse, and land in the ledger as a pending row until the result callback confirms them.",
          "Multi-tenancy plus RLS is easy to get subtly wrong. The trap is writing a policy that reads correctly but relies on a value the client controls. I kept tenancy derived strictly from the authenticated user's membership rows, and treated 'can a member of group A ever see group B' as a test case rather than an assumption.",
          "Subscription billing on M-Pesa has no equivalent of a stored card you can silently charge. Recurring collection means prompting a human on a schedule and handling the ones who don't approve — so billing is built around grace periods and reminders rather than assuming a charge will land.",
        ],
      },
      {
        title: "Where it landed",
        body: [
          "The core outcome is that the group's record stops being one person's notebook. Every member can independently see their own contribution history and the group's position, which turns a category of disputes into a lookup.",
          "Architecturally, tenancy sits in the database rather than in the frontend — the property I most wanted, because it's the one that has to hold even when a future feature is written in a hurry.",
        ],
      },
    ],
    featured: true,
  },
  {
    slug: "duka-pos",
    name: "Duka POS",
    tagline:
      "Browser-based point of sale and inventory for a Kenyan shop counter — cash and M-Pesa, live stock, daily reports.",
    summary:
      "A till that runs on whatever the shopkeeper already owns. Duka POS is a browser point-of-sale for a duka, kiosk or café counter: ring up a sale on a phone or a laptop, take cash or M-Pesa, and have stock counts and the day's numbers stay correct without anyone maintaining a book.",
    year: "2026",
    status: "Live",
    domain: "Retail / Point of sale",
    liveUrl: "https://duka-pos-urit.vercel.app",
    demoVideoUrl: null, // TODO: paste the Loom / YouTube walkthrough URL
    repoUrl: null, // TODO: add if the repo is public
    tags: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Tailwind CSS",
      "M-Pesa",
      "Offline-tolerant",
    ],
    features: [
      "Touch-first till: category filters, tap to add, running order panel, one charge button",
      "Cash and M-Pesa on the same sale, with change calculated at the counter",
      "Stock decremented the moment a sale completes — no end-of-day stock-take to stay accurate",
      "Dashboard with today's revenue, average basket, low-stock alerts and best sellers",
      "Inventory with per-product reorder levels and a running total stock value",
      "Sales reports by day or custom range, split by payment method",
    ],
    facts: [
      { label: "Role", value: "Solo developer — design, frontend, backend" },
      { label: "Timeline", value: "2026" },
      { label: "Payments", value: "Cash + M-Pesa" },
      { label: "Runs on", value: "Any browser — phone, tablet or laptop" },
    ],
    caseStudy: [
      {
        title: "The problem",
        body: [
          "The shops this is built for do not have a till. They have a phone, a drawer, and an exercise book that is written up when it is quiet. The result is that nobody knows what the stock actually is until they count it, and nobody knows what sold until the month is over and the numbers are guesses.",
          "Existing POS software assumes a counter with a dedicated terminal, a receipt printer and a monthly licence. That is the wrong shape and the wrong price for a duka turning over a few thousand shillings a day.",
        ],
      },
      {
        title: "The approach",
        body: [
          "The whole thing runs in a browser, so the hardware is whatever the shopkeeper already carries. The till screen is built for a thumb rather than a mouse: category buttons across the top, a grid of products, an order panel down the side, and a single large charge button that stays disabled until there is something to charge for.",
          "Stock is not a separate chore. Completing a sale writes the sale and decrements every line's quantity in the same transaction, which is what makes the low-stock alert on the dashboard something you can act on rather than something you have to verify first.",
        ],
        list: [
          "Sale and stock movement written together, so a count can never disagree with the day's transactions",
          "Payment method recorded per sale, giving a cash-versus-M-Pesa split instead of one blended total",
          "Per-product reorder levels driving the dashboard's low-stock list",
          "Reports over a date range, readable at a glance before closing up",
        ],
      },
      {
        title: "Hard parts",
        body: [
          "Connectivity is the real constraint. A counter cannot stop taking money because the network dipped, so the till holds its state locally and the charge action is written to be safe to retry — a sale that is submitted twice because the shopkeeper tapped again on a slow connection resolves to one sale, not two.",
          "The second was resisting features. Every POS grows towards accounting software, and each addition costs a little of the speed that makes it usable at a busy counter. The till screen is deliberately the only screen you need during trading hours; everything else lives behind it.",
        ],
      },
      {
        title: "Where it landed",
        body: [
          "The daily close went from an evening of adding up a book to opening the report and comparing it with the drawer.",
          "Because stock moves with every sale, the shopkeeper finds out something is running low from the dashboard in the morning rather than from a customer asking for it in the afternoon.",
        ],
      },
    ],
    featured: false,
  },
  {
    slug: "booking-appointment-portal",
    name: "Booking & Appointment Portal",
    tagline:
      "Multi-business booking SaaS — published services, real availability, and an owner dashboard to run the day.",
    summary:
      "A booking product for businesses that sell someone's time: salons, clinics, garages, consultants. A business publishes its services and working hours, customers book a slot that is genuinely free, and the phone stops ringing about scheduling.",
    year: "2026",
    status: "Live",
    domain: "SaaS / Scheduling",
    liveUrl: "https://ratiba-blush.vercel.app",
    demoVideoUrl: null, // TODO: paste the Loom / YouTube walkthrough URL
    repoUrl: null, // TODO: add if the repo is public
    tags: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "React Query",
      "Tailwind CSS",
      "Multi-tenant",
    ],
    features: [
      "Guest booking — pick a service, pick a slot, three fields, done. No account required",
      "Availability computed at request time from working hours, service duration and buffers",
      "Per-business tenancy — each business gets its own booking page and dashboard, data isolated with row-level security",
      "Owner dashboard: today's diary, appointment states, customer history, walk-in entry",
      "Reschedule and cancel by reference, with a configurable cutoff before the appointment",
      "Per-service duration, price and buffer, plus one-off blocked dates for holidays and leave",
    ],
    facts: [
      { label: "Role", value: "Solo developer — architecture, frontend, backend" },
      { label: "Timeline", value: "2026" },
      { label: "Tenancy", value: "Per-business, RLS-enforced" },
      { label: "Scheduling", value: "Availability computed live, never stored" },
    ],
    caseStudy: [
      {
        title: "The problem",
        body: [
          "A small service business loses a real share of its day to arranging when. Every booking is a phone call, every change is another one, and the diary is a paper page that only one person can look at.",
          "The scheduling tools that solve this are priced and shaped for Western SMBs. What is missing locally is something a salon owner can set up in an evening and hand to customers as a link.",
        ],
      },
      {
        title: "The approach",
        body: [
          "The core question the product has to answer correctly is 'is this slot free', and the tempting shortcut is to pre-generate slots into a table. I compute availability at request time from the business's working hours, the duration and buffer of the service being booked, and the appointments already taken. It costs a query; it means the calendar cannot ever be stale.",
          "The second decision was tenancy. Each business's data — services, working hours, appointments — has to stay strictly separate from every other business's, and the cheapest way to get that wrong is to filter by business ID in application code, where one missed condition leaks another business's calendar. I pushed isolation into Postgres row-level security instead: policies key off the authenticated business, so a query written carelessly in the frontend still cannot return another business's rows.",
        ],
        list: [
          "Availability derived at request time, never stored — a taken slot disappears on the next look",
          "Booking writes guarded against the slot being taken between the customer seeing it and confirming",
          "Owner dashboard behind its own authenticated route, kept separate from the public booking pages",
          "Per-business tenancy enforced with row-level security rather than in application code",
        ],
      },
      {
        title: "Hard parts",
        body: [
          "Double-booking is the failure that destroys trust in a scheduling product, and it lives in the gap between rendering a calendar and someone pressing confirm. The write re-checks the slot inside the same transaction that takes it, so the loser of a race gets an honest 'that just went' rather than a confirmation for an appointment that does not exist.",
          "Buffers and durations interact in ways that are easy to get subtly wrong. A 45-minute service with a 15-minute buffer does not divide neatly into an 8-to-5 day, and rounding it to fit produces slots that quietly overrun. Availability is generated from the actual arithmetic and simply offers fewer slots when the numbers do not fit.",
          "Reschedule is really a cancel and a book that must both happen or neither. Releasing the old slot first opens a window where a customer can lose their appointment entirely, so the new slot is taken before the old one is released.",
        ],
      },
      {
        title: "Where it landed",
        body: [
          "Booking is a link a business can put in a bio or send in a message, and it ends with a reference rather than a promise to call back.",
          "On the owner's side the diary is one screen for the day, with walk-ins entered through the same slot check as online bookings — so the paper page and the app can never disagree, because there is no paper page.",
        ],
      },
    ],
    featured: false,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
