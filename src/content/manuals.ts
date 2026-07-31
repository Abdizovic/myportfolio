/**
 * Per-project user manuals.
 *
 * This file is the single source of truth for the downloadable PDF guides in
 * `/public/manuals`. It is read twice:
 *
 *   1. by the site, to render the "Download user guide" links, and
 *   2. by `scripts/generate-manuals.mjs`, which lays the same content out as a
 *      PDF. Run `npm run manuals` after editing anything here, otherwise the
 *      site links to a stale document.
 *
 * ── A word on the credentials below ─────────────────────────────────────────
 * These are demo sign-ins for publicly reachable deployments, published on
 * purpose so a recruiter or client can walk into the admin side of a project
 * without emailing first. Anyone on the internet can read them, which means:
 * treat every one of these deployments as a showcase holding disposable data,
 * never reuse these passwords anywhere else, and rotate them here whenever they
 * change upstream.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Deliberately dependency-free and self-contained: the generator script imports
 * it directly with Node's TypeScript stripping, so it must not import anything.
 */

export type ManualEnvironment = {
  label: string;
  url: string;
  /** One line on what this surface is for and who signs in there. */
  note: string;
};

export type ManualAccount = {
  role: string;
  fields: { label: string; value: string }[];
  note?: string;
};

export type ManualBlock =
  | { kind: "text"; text: string }
  | { kind: "steps"; items: string[] }
  | { kind: "bullets"; items: string[] }
  | { kind: "note"; text: string };

export type ManualSection = {
  title: string;
  blocks: ManualBlock[];
};

export type Manual = {
  /** Matches the project slug in `projects.ts`. */
  slug: string;
  project: string;
  title: string;
  subtitle: string;
  /** Public path to the generated PDF, served straight out of /public. */
  file: string;
  version: string;
  environments: ManualEnvironment[];
  accounts: ManualAccount[];
  /** Rendered as a boxed warning directly under the credentials table. */
  accountsNote: string;
  sections: ManualSection[];
};

/** Contact block printed in the footer of every generated PDF. */
export const manualAuthor = {
  name: "Abdikarim",
  role: "Frontend Developer & Freelancer",
  email: "abdkarimochieng@gmail.com",
} as const;

const SHARED_DEMO_WARNING =
  "These are shared demo accounts on a public deployment. Anyone reading this guide can sign in with them, so treat everything inside as throwaway sample data: do not enter real names, phone numbers, ID numbers or live payment details. Passwords are rotated from time to time — if one stops working, get in touch and I will send the current set.";

const MPESA_SANDBOX_NOTE =
  "Payments run against the M-Pesa sandbox, not live Safaricom rails. An STK Push prompt will not appear on a real handset and no money moves; the demo simulates the callback so you can follow the full flow end to end.";

export const manuals: Manual[] = [
  // ── HOROLOGY ──────────────────────────────────────────────────────────────
  {
    slug: "horology",
    project: "HOROLOGY",
    title: "HOROLOGY — User Guide",
    subtitle:
      "Walkthrough of the Watch Co. storefront and the admin console, including demo sign-in details.",
    file: "/manuals/horology-user-guide.pdf",
    version: "Revision 1 — July 2026",
    environments: [
      {
        label: "Storefront",
        url: "https://watchproject-storefront.vercel.app",
        note: "The shop customers see. Browsable without an account; you only sign in to keep an order history.",
      },
      {
        label: "Admin console",
        url: "https://watchproject-admin.vercel.app",
        note: "Where the shop is run — catalogue, stock and orders. Sign-in required; use the credentials below.",
      },
    ],
    accounts: [
      {
        role: "Admin console",
        fields: [
          { label: "Admin code", value: "czUF0aZ3AbbrbZjW" },
          { label: "Email", value: "abdkarimochieng@gmail.com" },
          { label: "Password", value: "#Abdik2109" },
        ],
        note: "Full access to products, inventory and order fulfilment. The admin code is required on Create an admin account, alongside the email and password — not on an ordinary sign-in.",
      },
      {
        role: "Storefront shopper",
        fields: [{ label: "Account", value: "Not required — browse and check out as a guest" }],
        note: "You may create your own shopper account from the Sign in link if you want to see the order-history view.",
      },
    ],
    accountsNote: SHARED_DEMO_WARNING,
    sections: [
      {
        title: "1. What HOROLOGY is",
        blocks: [
          {
            kind: "text",
            text: "HOROLOGY is a Kenya-focused luxury watch shop. It is built for how people here actually buy online: every price is quoted in Kenyan Shillings with no currency conversion at the end, and checkout finishes with an M-Pesa prompt on your own phone instead of a card form.",
          },
          {
            kind: "text",
            text: "It ships as one monorepo deployed to two separate addresses. Splitting them means the shop stays fast and public while the management screens sit behind their own sign-in on their own domain — a shopper never loads a byte of admin code, and the admin app can be taken down or redeployed without the shop going with it.",
          },
          {
            kind: "bullets",
            items: [
              "Storefront — the public shop: catalogue, product pages, cart, M-Pesa checkout.",
              "Admin console — the back office: products, images, pricing, stock levels and order fulfilment.",
              "Both apps read and write one shared database, so a stock change in admin shows on the shop immediately.",
            ],
          },
        ],
      },
      {
        title: "2. Finding a watch on the storefront",
        blocks: [
          {
            kind: "text",
            text: "Open the storefront address. No sign-in is needed to browse.",
          },
          {
            kind: "steps",
            items: [
              "Use the top navigation to filter the catalogue: All Watches, Dress, Dive, Chronograph or Smart.",
              "Or scroll to Shop by Category on the home page and pick from Chronographs, Dive Watches, Dress Watches, Minimalist or Smartwatches.",
              "The Featured Watches strip on the home page shows a rotating selection with prices already in Ksh.",
              "Click any watch to open its product page — full description, specification, gallery and current stock.",
            ],
          },
          {
            kind: "note",
            text: "Where a watch is discounted you will see two figures: the sale price first, then the original struck through. The first number is what you pay.",
          },
        ],
      },
      {
        title: "3. Cart and checkout",
        blocks: [
          {
            kind: "steps",
            items: [
              "On a product page, press Add to put the watch in your cart. The cart icon in the header shows the running count.",
              "Open the cart from the header to change quantities or remove a line. The total updates as you go.",
              "Press through to checkout and fill in your delivery details — name, phone number and delivery address.",
              "Check the order summary. The figure shown is the exact amount that will appear on your phone; there is no conversion step and no fee added after this screen.",
              "Enter the Safaricom number you want to pay from, in the format 07XXXXXXXX, and confirm.",
            ],
          },
          {
            kind: "note",
            text: "Free shipping applies over the threshold shown on the home page, and every watch carries the stated warranty and 30-day return window. Those terms are part of the demo content.",
          },
        ],
      },
      {
        title: "4. Paying with M-Pesa",
        blocks: [
          {
            kind: "text",
            text: "Checkout uses M-Pesa STK Push (Lipa Na M-Pesa Online). No card details are ever collected, and nothing sensitive is typed into the website — you approve the payment on your own handset with your own PIN.",
          },
          {
            kind: "steps",
            items: [
              "Submit the checkout form. The site sends a payment request to Safaricom and switches to a waiting state.",
              "A prompt appears on the phone number you entered, showing the merchant and the exact amount.",
              "Enter your M-Pesa PIN on the handset to approve.",
              "The site is polling in the background. Once Safaricom confirms, the page moves to the paid state and your order number is shown. Keep the tab open until then.",
            ],
          },
          {
            kind: "bullets",
            items: [
              "If you ignore the prompt it times out after about a minute and the order is marked failed — nothing is charged and stock is released.",
              "If you cancel on the handset, the site says so in plain language rather than showing an error code.",
              "If your balance is short, the order fails cleanly and you can retry from the same cart.",
            ],
          },
          { kind: "note", text: MPESA_SANDBOX_NOTE },
        ],
      },
      {
        title: "5. Signing in to the admin console",
        blocks: [
          {
            kind: "steps",
            items: [
              "Open the admin address. You land on the Watch Co. Admin sign-in screen (visiting the root redirects you to /login).",
              "Enter the admin email and password from the credentials table at the front of this guide.",
              "Press Sign In. You arrive at the console dashboard.",
            ],
          },
          {
            kind: "bullets",
            items: [
              "Forgot password? sends a reset link — avoid it on the shared demo account, as it changes the password for everyone reading this guide.",
              "Create an admin account is for invited staff. It expects the admin code from the credentials table above alongside an email and password, so it is not the route in for a demo visit — use Sign In with the demo account instead.",
            ],
          },
        ],
      },
      {
        title: "6. Managing the catalogue",
        blocks: [
          {
            kind: "text",
            text: "The catalogue section is where watches are created and edited. Anything saved here is live on the storefront on the next page load.",
          },
          {
            kind: "steps",
            items: [
              "Open Products from the console navigation to see everything currently listed.",
              "Create a new watch, or click an existing one to edit it.",
              "Fill in name, brand, category (this drives the storefront navigation), description and specification.",
              "Upload images. The first image is the one used on category cards and in the cart.",
              "Set the price in Kenyan Shillings. Add a compare-at price if you want the struck-through sale styling on the storefront.",
              "Set the stock quantity, then save.",
            ],
          },
          {
            kind: "note",
            text: "Prices are stored as whole cents rather than decimals, which is why the amount on the product page and the amount on the M-Pesa prompt can never drift apart by a rounding error.",
          },
        ],
      },
      {
        title: "7. Stock and orders",
        blocks: [
          {
            kind: "text",
            text: "Every order moves through an explicit sequence of states, and the console shows you where each one is. Nothing skips a step.",
          },
          {
            kind: "bullets",
            items: [
              "Pending — the order exists, payment has not been requested yet.",
              "Awaiting approval — the STK prompt is on the customer's phone. Stock is held against this order.",
              "Paid — Safaricom confirmed. The order is ready to pack.",
              "Failed or cancelled — timed out, declined or cancelled. The held stock is released automatically.",
            ],
          },
          {
            kind: "steps",
            items: [
              "Open Orders in the console. Filter by state to find what needs attention.",
              "Click an order for the full picture: line items, delivery details, and the M-Pesa receipt for paid orders.",
              "Pack and ship, then mark the order fulfilled. The customer's view updates with it.",
              "Watch Inventory for low-stock items and top them up from the product editor.",
            ],
          },
        ],
      },
      {
        title: "8. If something goes wrong",
        blocks: [
          {
            kind: "bullets",
            items: [
              "The M-Pesa prompt never arrived — check the number is a Safaricom line entered as 07XXXXXXXX, then retry from the cart.",
              "The page is still saying 'waiting for approval' — leave it a moment. If the confirmation is delayed, the console reconciles the order against Safaricom and the correct state wins.",
              "You were signed out of admin — sessions expire. Sign in again with the same details.",
              "A product edit is not showing on the shop — reload the storefront page; catalogue pages are cached briefly for speed.",
              "The admin address shows the sign-in screen again after signing in — clear cookies for the domain and retry.",
            ],
          },
        ],
      },
    ],
  },

  // ── Chama Management Platform ─────────────────────────────────────────────
  {
    slug: "chama-management-platform",
    project: "Chama Management Platform",
    title: "Chama Management Platform — User Guide",
    subtitle:
      "How a savings group is run on the platform, role by role, with demo sign-ins for admin, chairperson and member.",
    file: "/manuals/chama-management-platform-user-guide.pdf",
    version: "Revision 1 — July 2026",
    environments: [
      {
        label: "Platform",
        url: "https://chama-management-platform-hazel.vercel.app",
        note: "One address for everyone. What you can see and do is decided by the role on your account, not by a separate app.",
      },
    ],
    accounts: [
      {
        role: "Admin",
        fields: [
          { label: "Email", value: "abdkarimochieng@gmail.com" },
          { label: "Password", value: "Chama@Admin2026" },
        ],
        note: "Group setup, membership, roles and subscription billing.",
      },
      {
        role: "Chairperson",
        fields: [
          { label: "Email", value: "ochiengabdikarim@gmail.com" },
          { label: "Password", value: "@Abdik2109" },
        ],
        note: "Approves payouts and loan disbursements, sees full group position.",
      },
      {
        role: "Member",
        fields: [
          { label: "Email", value: "abdizovicabdi@gmail.com" },
          { label: "Password", value: "#Abdik2109" },
        ],
        note: "Contributes, and sees their own history plus the group totals.",
      },
    ],
    accountsNote:
      SHARED_DEMO_WARNING +
      " Sign in with all three accounts in turn — the point of the platform is how differently the same screens behave depending on who is looking at them.",
    sections: [
      {
        title: "1. What the platform is for",
        blocks: [
          {
            kind: "text",
            text: "A chama runs on trust, and trust runs on a record everyone agrees with. In most groups that record is the treasurer's notebook plus a WhatsApp thread of M-Pesa screenshots. Contributions get missed, the running total is whatever the treasurer last said it was, and a member who wants to check their own history has to ask someone.",
          },
          {
            kind: "text",
            text: "This platform replaces the notebook. Contributions come in over M-Pesa and land in the group's ledger automatically. Payouts go out the same way, behind an approval. Every member can open the app and see their own history and the group's position without asking anyone — which turns a whole category of arguments into a lookup.",
          },
          {
            kind: "note",
            text: "Each group is a separate tenant. Isolation is enforced in the database rather than in the app, so a member of one chama cannot see another chama's figures under any circumstances.",
          },
        ],
      },
      {
        title: "2. The four roles",
        blocks: [
          {
            kind: "text",
            text: "Everyone signs in at the same address. Your role decides what appears once you are in.",
          },
          {
            kind: "bullets",
            items: [
              "Admin — creates the group, invites and removes members, assigns roles, manages the subscription.",
              "Chairperson — approves payouts and loan disbursements, and sees the full group position.",
              "Treasurer — records and reconciles money, follows up unmatched or missing contributions.",
              "Member — contributes, and views their own statement plus the group totals.",
            ],
          },
          {
            kind: "note",
            text: "The menu you see is built from the same permissions the database enforces. Hiding a button is a courtesy; the actual boundary sits underneath, so nothing can be reached by guessing a URL.",
          },
        ],
      },
      {
        title: "3. Signing in",
        blocks: [
          {
            kind: "steps",
            items: [
              "Open the platform address and choose Sign in.",
              "Enter one of the demo email and password pairs from the table at the front of this guide.",
              "You land on the dashboard for that role. To try a different role, sign out and sign back in with another pair.",
            ],
          },
        ],
      },
      {
        title: "4. Admin — setting the group up",
        blocks: [
          {
            kind: "steps",
            items: [
              "From the dashboard, open the group settings. Set the group name, the contribution amount and how often it is due.",
              "Open Members and invite people by email. Each invitee gets a link to set their own password.",
              "Assign a role as you invite — chairperson, treasurer or member. Roles can be changed later from the same screen.",
              "Review the subscription section to see the group's current plan and renewal date.",
            ],
          },
          {
            kind: "bullets",
            items: [
              "Removing a member ends their access but leaves their contribution history in the ledger. Money records are never deleted.",
              "There is no way to edit a past contribution. Corrections are made by posting an adjusting entry, so the trail stays intact.",
            ],
          },
        ],
      },
      {
        title: "5. Member — making a contribution",
        blocks: [
          {
            kind: "steps",
            items: [
              "Sign in as the member and open Contributions from the dashboard.",
              "Choose Contribute. The amount is pre-filled from the group's schedule; change it if you are paying more or catching up.",
              "Enter your Safaricom number as 07XXXXXXXX and confirm.",
              "Approve the prompt on your handset with your M-Pesa PIN.",
              "The contribution appears in your statement and in the group total as soon as Safaricom confirms — no screenshot to send to anyone.",
            ],
          },
          { kind: "note", text: MPESA_SANDBOX_NOTE },
        ],
      },
      {
        title: "6. The ledger and statements",
        blocks: [
          {
            kind: "text",
            text: "Everything is append-only. Contributions in and payouts out are both rows that are written once and never changed, and every balance you see is calculated from them rather than stored. That is what makes any figure on screen traceable back to the exact M-Pesa transaction behind it.",
          },
          {
            kind: "bullets",
            items: [
              "My contributions — your own history, with dates, amounts and receipt numbers.",
              "Group position — total contributed, total paid out, and what the group is currently holding.",
              "Per-member summary — who is up to date and who is behind, visible to the whole group.",
            ],
          },
        ],
      },
      {
        title: "7. Chairperson — payouts and loans",
        blocks: [
          {
            kind: "text",
            text: "Money leaving the group is a deliberately slower path than money coming in. Sending funds out is the one action that cannot be undone, so it is never a single click.",
          },
          {
            kind: "steps",
            items: [
              "Open Payouts to see requests waiting on you, each with the requesting member, the amount and the reason.",
              "Check the request against the group's position, shown alongside.",
              "Approve or decline. An approval is recorded against your name and the time.",
              "On approval the transfer is queued and shows as pending until Safaricom confirms it, at which point it is written into the ledger.",
            ],
          },
          {
            kind: "note",
            text: "Payout requests carry an idempotency key, so a double-click or a retried request can never disburse the same money twice.",
          },
        ],
      },
      {
        title: "8. Subscription billing",
        blocks: [
          {
            kind: "text",
            text: "Each group pays for the platform on its own plan. M-Pesa has no equivalent of a stored card that can be charged silently, so recurring billing means prompting a human on a schedule — which the platform is built around rather than against.",
          },
          {
            kind: "bullets",
            items: [
              "The admin sees the plan, the renewal date and the payment history.",
              "A reminder goes out before renewal, and the renewal itself is an STK prompt the admin approves.",
              "A missed renewal moves the group into a grace period rather than cutting access off immediately.",
            ],
          },
        ],
      },
      {
        title: "9. If something goes wrong",
        blocks: [
          {
            kind: "bullets",
            items: [
              "No M-Pesa prompt — confirm the number is a Safaricom line in 07XXXXXXXX form, then try again. Only one prompt can be outstanding at a time.",
              "A contribution is missing — check the Unmatched queue. Payments that could not be tied to a member land there for the treasurer rather than being dropped.",
              "A menu item you expected is not there — you are signed in under a role that does not have it. Sign out and back in as admin or chairperson.",
              "A payout is stuck on pending — it is waiting on Safaricom's confirmation. It will settle or fail on its own; it will not silently vanish.",
              "You cannot sign in — passwords on the demo accounts are rotated periodically. Get in touch for the current set.",
            ],
          },
        ],
      },
    ],
  },

  // ── Duka POS ──────────────────────────────────────────────────────────────
  {
    slug: "duka-pos",
    project: "Duka POS",
    title: "Duka POS — User Guide",
    subtitle:
      "Running a shop counter on Duka POS: the till, inventory, reports and the demo sign-in.",
    file: "/manuals/duka-pos-user-guide.pdf",
    version: "Revision 1 — July 2026",
    environments: [
      {
        label: "Duka POS",
        url: "https://duka-pos-urit.vercel.app",
        note: "The whole application — till, inventory and reports behind one sign-in.",
      },
    ],
    accounts: [
      {
        role: "Admin",
        fields: [
          { label: "Email", value: "abdkarimochieng@gmail.com" },
          { label: "Password", value: "#Abdik2109" },
        ],
        note: "Full access: selling at the till, editing inventory and reading reports.",
      },
    ],
    accountsNote: SHARED_DEMO_WARNING,
    sections: [
      {
        title: "1. What Duka POS is",
        blocks: [
          {
            kind: "text",
            text: "Duka POS is a point-of-sale and inventory system for a small shop — a duka, a kiosk, a café counter. It is the thing that sits between a customer handing over money and the shopkeeper knowing, at the end of the day, what sold and what is running out.",
          },
          {
            kind: "text",
            text: "It runs in a browser, so the till can be a laptop, a tablet or a phone. Prices and totals are in Kenyan Shillings throughout.",
          },
          {
            kind: "bullets",
            items: [
              "Dashboard — today's revenue, average sale, low-stock warnings, best sellers and recent transactions.",
              "Till — the selling screen: pick products, build an order, take payment.",
              "Inventory — the product list, prices, stock counts and total stock value.",
              "Reports — sales filtered by day or date range.",
            ],
          },
        ],
      },
      {
        title: "2. Signing in",
        blocks: [
          {
            kind: "steps",
            items: [
              "Open the Duka POS address. The sign-in screen loads.",
              "Enter the email and password from the credentials table at the front of this guide.",
              "Press Sign In. You land on the dashboard.",
            ],
          },
          {
            kind: "note",
            text: "Add the address to your phone or tablet home screen and it opens full-screen like an app, which is how it is meant to be used at a counter.",
          },
        ],
      },
      {
        title: "3. Reading the dashboard",
        blocks: [
          {
            kind: "text",
            text: "The dashboard is written for a glance, not a study. It answers the questions a shopkeeper actually asks before opening.",
          },
          {
            kind: "bullets",
            items: [
              "Revenue and average sale — today's takings and what a typical basket is worth.",
              "Low Stock Alert — items about to run out, so you reorder before a customer asks for something you do not have.",
              "Best Sellers by revenue — what is actually earning, which is not always what sells the most units.",
              "Slow Moving by quantity — stock sitting on the shelf tying up cash.",
              "Recent Transactions — the last few sales, with View All for the full list.",
            ],
          },
        ],
      },
      {
        title: "4. Making a sale",
        blocks: [
          {
            kind: "steps",
            items: [
              "Open the till screen.",
              "Narrow the product grid with the category buttons across the top, or search for an item by name.",
              "Tap a product to add it to the order. Tap it again to increase the quantity.",
              "The order panel on the right lists every line and the running total. Adjust quantities there, remove a line, or press Clear to start over.",
              "Press CHARGE to take payment. The button stays disabled until there is something in the order.",
              "Choose the payment method, confirm, and issue the receipt.",
            ],
          },
          {
            kind: "note",
            text: "Completing a sale reduces stock for every item on it straight away, so the inventory count and the low-stock warnings stay honest without anyone updating them by hand.",
          },
        ],
      },
      {
        title: "5. Taking payment",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Cash — enter the amount handed over and the screen shows the change to give back.",
              "M-Pesa — enter the customer's number and send the prompt; they approve on their handset and the sale closes once it is confirmed.",
            ],
          },
          {
            kind: "text",
            text: "Either way the sale is recorded with its payment method, so the day's report shows you the cash-versus-M-Pesa split rather than one undifferentiated total.",
          },
          { kind: "note", text: MPESA_SANDBOX_NOTE },
        ],
      },
      {
        title: "6. Inventory",
        blocks: [
          {
            kind: "steps",
            items: [
              "Open Inventory to see every product, its category, price and stock on hand. The header shows the total value of stock you are holding.",
              "Add a product with its name, category, selling price and opening quantity. The category you choose is what appears as a filter button on the till.",
              "Edit a product to change price or details. Existing sales keep the price they were made at.",
              "Receive new stock by updating the quantity when a delivery arrives.",
            ],
          },
          {
            kind: "note",
            text: "Set a sensible low-stock level per product. That number is what drives the Low Stock Alert on the dashboard — set it too low and you find out you are out of something from a customer.",
          },
        ],
      },
      {
        title: "7. Reports",
        blocks: [
          {
            kind: "steps",
            items: [
              "Open the sales or reports screen.",
              "Pick Today or Yesterday for the quick view, or set a custom date range.",
              "Press Filter Reports to apply it.",
              "Read off the totals, and open any individual transaction to see its lines and payment method.",
            ],
          },
          {
            kind: "text",
            text: "Run the day's report before closing. It is the fastest way to check that the money in the drawer matches the cash the system says you took.",
          },
        ],
      },
      {
        title: "8. If something goes wrong",
        blocks: [
          {
            kind: "bullets",
            items: [
              "CHARGE will not press — the order is empty. Add at least one item.",
              "A product is missing from the till — check its category filter, or confirm it exists and has stock in Inventory.",
              "Stock counts look wrong — a sale reduces stock the moment it completes. Compare against the day's transactions in reports before adjusting by hand.",
              "The M-Pesa prompt did not arrive — check the number is a Safaricom line in 07XXXXXXXX form and resend, or take the payment in cash and record it that way.",
              "The screen is stale — pull to refresh or reload the page. The till reads live data on load.",
            ],
          },
        ],
      },
    ],
  },

  // ── Booking & Appointment Portal ──────────────────────────────────────────
  {
    slug: "booking-appointment-portal",
    project: "Booking & Appointment Portal",
    title: "Booking & Appointment Portal — User Guide",
    subtitle:
      "Taking bookings on the portal, from the customer's side and the business owner's, with the demo admin sign-in.",
    file: "/manuals/booking-appointment-portal-user-guide.pdf",
    version: "Revision 1 — July 2026",
    environments: [
      {
        label: "Booking portal",
        url: "https://ratiba-blush.vercel.app",
        note: "Customer booking pages and the owner's dashboard behind one address.",
      },
    ],
    accounts: [
      {
        role: "Admin",
        fields: [
          { label: "Email", value: "abdkarimochieng@gmail.com" },
          { label: "Password", value: "MyNewPassword123" },
        ],
        note: "Sign in with these details to reach the owner dashboard — services, availability and bookings.",
      },
      {
        role: "Customer",
        fields: [{ label: "Account", value: "Not required — book as a guest" }],
        note: "Customers can book without registering. Creating an account only adds a place to see and manage past bookings.",
      },
    ],
    accountsNote: SHARED_DEMO_WARNING,
    sections: [
      {
        title: "1. What the portal is for",
        blocks: [
          {
            kind: "text",
            text: "Any business that sells someone's time — a salon, a clinic, a garage, a consultant — spends a surprising amount of the day on the phone arranging when. This portal moves that online: the business publishes its services and its working hours, and customers pick a slot that is genuinely free.",
          },
          {
            kind: "text",
            text: "It is built as a SaaS product, so a business signs up, configures its own services and staff, and gets its own booking page, without anything being set up by hand.",
          },
          {
            kind: "bullets",
            items: [
              "Booking pages — what a customer sees: services, real availability, and a short form.",
              "Dashboard — what the owner sees: the day's diary, upcoming appointments and customer records.",
              "Services and availability — the settings that decide which slots are ever offered.",
            ],
          },
        ],
      },
      {
        title: "2. Booking as a customer",
        blocks: [
          {
            kind: "steps",
            items: [
              "Open the portal address and choose the service you want. Each one shows how long it takes and what it costs.",
              "Pick a date. The calendar only offers days the business is open.",
              "Pick a time. Only genuinely free slots are shown — anything already booked is gone from the list rather than shown and then refused.",
              "Fill in your name, phone number and email, and add a note if there is anything the business should know.",
              "Confirm. You get a booking reference on screen and a confirmation message.",
            ],
          },
          {
            kind: "note",
            text: "Keep the booking reference. It is what you need to check, reschedule or cancel without an account.",
          },
        ],
      },
      {
        title: "3. Changing or cancelling a booking",
        blocks: [
          {
            kind: "steps",
            items: [
              "Open the manage-booking link from your confirmation, or enter your reference on the portal.",
              "Choose Reschedule to move it — you get the same availability calendar, and the old slot is released as the new one is taken.",
              "Choose Cancel to drop it. The slot goes straight back into the pool for other customers.",
            ],
          },
          {
            kind: "note",
            text: "Where the business has set a cutoff — say, no changes within two hours of the appointment — the option is closed off past that point and you are asked to call instead.",
          },
        ],
      },
      {
        title: "4. Signing in as the administrator",
        blocks: [
          {
            kind: "text",
            text: "The admin side is behind its own sign-in, separate from the customer booking pages.",
          },
          {
            kind: "steps",
            items: [
              "Open the portal and go to the admin sign-in.",
              "Enter the email and password from the credentials table at the front of this guide.",
              "Submit. You land on the dashboard.",
            ],
          },
        ],
      },
      {
        title: "5. Setting up services",
        blocks: [
          {
            kind: "text",
            text: "Services are the foundation. A slot can only ever be offered because a service defines how long it takes, so this is the first screen to visit on a new account.",
          },
          {
            kind: "steps",
            items: [
              "Open Services from the dashboard.",
              "Add a service with its name, description, duration and price.",
              "Add any buffer needed either side — cleaning up, resetting a room, writing notes — so back-to-back bookings do not run into each other.",
              "Save. The service appears on the customer booking page immediately.",
            ],
          },
        ],
      },
      {
        title: "6. Working hours and availability",
        blocks: [
          {
            kind: "steps",
            items: [
              "Open availability or working hours from the dashboard.",
              "Set the opening and closing time for each day of the week, and mark the days you are closed.",
              "Block out one-off dates — public holidays, leave, a full-day booking elsewhere. Blocked dates disappear from the customer calendar.",
              "Save. Availability recalculates from your hours, your service durations and the bookings already taken.",
            ],
          },
          {
            kind: "note",
            text: "Slots are worked out at the moment a customer looks, not stored in advance. That is why a slot someone else just took vanishes from your calendar on refresh, and why the same time can never be sold twice.",
          },
        ],
      },
      {
        title: "7. Running the day",
        blocks: [
          {
            kind: "steps",
            items: [
              "Open the dashboard for today's diary in order of time.",
              "Click an appointment for the customer's details, the service booked and any note they left.",
              "Mark it confirmed, completed, cancelled or a no-show as the day goes on.",
              "Add a walk-in or a phone booking directly from the dashboard — it takes the same slot check as an online one, so nothing gets double-booked.",
              "Use the customer list to see someone's history before they arrive.",
            ],
          },
        ],
      },
      {
        title: "8. If something goes wrong",
        blocks: [
          {
            kind: "bullets",
            items: [
              "A customer says no slots are available — check the working hours for that day, and check the date is not blocked out.",
              "A slot disappeared while booking — someone else took it. Pick another; the calendar refreshes on its own.",
              "A booking is missing from the diary — check the date filter, and check it was not cancelled. Cancelled bookings are hidden by default rather than deleted.",
              "You cannot sign in — the demo password is rotated periodically. Get in touch for the current set.",
            ],
          },
        ],
      },
    ],
  },

  // ── Mwangaza Academy ──────────────────────────────────────────────────────
  {
    slug: "mwangaza-academy",
    project: "Mwangaza Academy",
    title: "Mwangaza Academy — User Guide",
    subtitle:
      "How fee invoicing, M-Pesa paybill reconciliation and SMS receipts work in the school portal.",
    file: "/manuals/mwangaza-academy-user-guide.pdf",
    version: "Revision 1 — July 2026",
    environments: [
      {
        label: "School portal",
        url: "https://school-fees-portal-56m9.vercel.app",
        note: "Bursar and administrator screens for fee structures, invoices, payments and statements.",
      },
    ],
    accounts: [
      {
        role: "Bursar / administrator",
        fields: [
          { label: "Email", value: "abdkarimochieng@gmail.com" },
          { label: "Password", value: "#Abdik2109" },
        ],
        note: "Full access to fee structures, invoices, payments and statements.",
      },
    ],
    accountsNote: SHARED_DEMO_WARNING,
    sections: [
      {
        title: "1. What the portal is for",
        blocks: [
          {
            kind: "text",
            text: "Fee collection in most small and mid-sized Kenyan schools runs on a paybill number and a spreadsheet. A parent pays, the bursar reads the M-Pesa confirmation SMS, and types the amount against a pupil by hand. It works until it does not: a parent uses a sibling's admission number, someone pays one round figure across two children, or a transaction is entered twice at the end of a long day.",
          },
          {
            kind: "text",
            text: "This portal takes the re-typing out. Parents pay to the school's paybill from their own phones, the payment is matched to a pupil automatically, and both the parent and the ledger are updated the moment it lands.",
          },
        ],
      },
      {
        title: "2. Fee structures and invoices",
        blocks: [
          {
            kind: "steps",
            items: [
              "Open the fee structure screen and set the term's charges per class — tuition, transport, boarding, activity fees.",
              "Generate invoices for the term. Every pupil in a class gets an invoice built from that class's structure.",
              "Review the run before publishing. Individual invoices can be adjusted for bursaries, siblings' discounts or a mid-term admission.",
              "Publish. Balances become visible and payments can be matched against them.",
            ],
          },
        ],
      },
      {
        title: "3. How a parent pays",
        blocks: [
          {
            kind: "steps",
            items: [
              "The parent opens M-Pesa on their own phone and chooses Lipa na M-Pesa, then Pay Bill.",
              "They enter the school's business number.",
              "In the account number field they enter the pupil's admission number. This is the single most important field — it is what ties the money to the child.",
              "They enter the amount and their PIN.",
              "Safaricom notifies the portal, the payment is matched to the pupil, the balance updates, and an SMS receipt goes back to the parent.",
            ],
          },
          {
            kind: "note",
            text: "Tell parents to use the admission number, not the pupil's name and not a phone number. A typo here is the main reason a payment needs a human to sort out.",
          },
        ],
      },
      {
        title: "4. The review queue",
        blocks: [
          {
            kind: "text",
            text: "Some payments cannot be matched automatically — a mistyped admission number, a pupil who left, a parent paying for two children in one transaction. Those are never dropped and never guessed at.",
          },
          {
            kind: "steps",
            items: [
              "Open the review queue. Each unmatched payment shows the M-Pesa details and a suggested pupil.",
              "Accept the suggestion, or search for the right pupil.",
              "Split a single payment across siblings where one transaction covers more than one child.",
              "Confirm. The payment posts to the ledger and the receipt goes out.",
            ],
          },
        ],
      },
      {
        title: "5. Balances and statements",
        blocks: [
          {
            kind: "bullets",
            items: [
              "A pupil's balance is calculated from their invoices and payments, never stored as a number someone can edit.",
              "Any figure on the dashboard drills back to the exact M-Pesa transaction that produced it, which is what makes a disputed balance a two-minute conversation.",
              "Statements are printable per pupil, per class or per term.",
              "Overpayments carry forward to the next term rather than needing a manual refund.",
            ],
          },
        ],
      },
      {
        title: "6. SMS notifications",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Receipts go out automatically on every matched payment.",
              "Arrears reminders can be sent to a whole class or to a filtered list of parents.",
              "Every message sent is logged against the pupil, so there is a record of who was told what and when.",
            ],
          },
        ],
      },
      {
        title: "7. If something goes wrong",
        blocks: [
          {
            kind: "bullets",
            items: [
              "A parent's payment is not showing — check the review queue first. It is almost always an admission number typed wrong.",
              "A parent was charged twice — repeated notifications from Safaricom are ignored by design, so the same transaction can only post once. Check the transaction ID against the ledger.",
              "The SMS did not arrive — check the parent's number on the pupil record, then the message log.",
              "A balance looks wrong — open the statement. Every line is either an invoice or a payment, so the discrepancy is always visible.",
            ],
          },
        ],
      },
    ],
  },
];

export function getManual(slug: string): Manual | undefined {
  return manuals.find((manual) => manual.slug === slug);
}
