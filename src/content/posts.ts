/**
 * Short technical write-ups. Deliberately narrow: M-Pesa + Supabase patterns
 * are badly under-documented, and that gap is the reason this section exists.
 *
 * Content is stored as typed blocks rather than MDX — no extra dependency, no
 * runtime markdown parsing, and the renderer stays a server component.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "callout"; text: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  /** ISO date. */
  date: string;
  tags: string[];
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "mpesa-stk-push-callbacks-you-can-trust",
    title: "M-Pesa STK Push callbacks you can actually trust",
    description:
      "Daraja callbacks are unauthenticated, retried, and sometimes never arrive. Here's the handler shape I use so none of that corrupts your ledger.",
    date: "2026-06-14",
    tags: ["M-Pesa", "Daraja", "Next.js", "Webhooks"],
    body: [
      {
        type: "p",
        text: "Almost every M-Pesa integration tutorial stops at the moment the STK prompt appears on the phone. That is the easy half. The half that decides whether your app is trustworthy is what happens in the next ninety seconds — a callback arrives twice, or arrives out of order, or does not arrive at all while the customer stares at a spinner.",
      },
      {
        type: "p",
        text: "Three properties are worth designing for explicitly, because none of them come for free.",
      },
      {
        type: "h2",
        text: "1. The callback endpoint is public and unauthenticated",
      },
      {
        type: "p",
        text: "Safaricom POSTs to whatever CallBackURL you supplied, with no signature and no shared secret. Anyone who discovers the URL can post to it. So the callback body is a hint that something happened — never an instruction to credit an account.",
      },
      {
        type: "p",
        text: "The practical mitigations: use an unguessable path segment, correlate strictly on a CheckoutRequestID you generated and stored yourself, and treat any callback that does not match a pending transaction you already know about as noise to be logged and dropped.",
      },
      {
        type: "code",
        lang: "ts",
        code: `// app/api/mpesa/stk-callback/[secret]/route.ts
export async function POST(req: Request, { params }: Ctx) {
  const { secret } = await params;
  if (secret !== process.env.MPESA_CALLBACK_SECRET) {
    // Don't leak whether the path exists.
    return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  const { Body } = await req.json();
  const cb = Body?.stkCallback;
  if (!cb?.CheckoutRequestID) {
    return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  // The transaction must already exist, created when WE initiated the push.
  const { data: txn } = await admin
    .from("transactions")
    .select("id, status")
    .eq("checkout_request_id", cb.CheckoutRequestID)
    .maybeSingle();

  if (!txn) return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });

  await settle(txn, cb);
  return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
}`,
      },
      {
        type: "callout",
        text: "Always return a 200 with ResultCode 0, even when you reject the payload. A non-200 makes Daraja retry, and retrying a request you have deliberately discarded helps nobody.",
      },
      { type: "h2", text: "2. Callbacks are retried, so writes must be idempotent" },
      {
        type: "p",
        text: "If your handler is slow or your host hiccups, the same callback will land again. If crediting is a bare UPDATE that adds an amount, a retry silently doubles someone's balance — and you will find out weeks later, from a customer.",
      },
      {
        type: "p",
        text: "Push idempotency into the database rather than defending it in application code. A unique constraint on the M-Pesa receipt number turns a duplicate callback into a constraint violation you can swallow, and it holds even when two retries race.",
      },
      {
        type: "code",
        lang: "sql",
        code: `create table payments (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references transactions(id),
  -- The one field Safaricom guarantees unique per successful payment.
  mpesa_receipt text not null unique,
  amount_cents bigint not null check (amount_cents > 0),
  created_at timestamptz not null default now()
);`,
      },
      {
        type: "p",
        text: "Then the settle step becomes an insert that is allowed to fail harmlessly, followed by a status transition that is safe to repeat.",
      },
      {
        type: "code",
        lang: "ts",
        code: `const { error } = await admin.from("payments").insert({
  transaction_id: txn.id,
  mpesa_receipt: receipt,
  amount_cents: Math.round(amount * 100),
});

// 23505 = unique_violation. We've already processed this callback.
if (error && error.code !== "23505") throw error;

await admin
  .from("transactions")
  .update({ status: "paid", settled_at: new Date().toISOString() })
  .eq("id", txn.id)
  .eq("status", "pending"); // no-op if already settled`,
      },
      { type: "h2", text: "3. The callback might never arrive" },
      {
        type: "p",
        text: "This is the one that gets skipped, and it is the one users notice. A dropped callback leaves a transaction pending forever, and your customer has genuinely paid.",
      },
      {
        type: "p",
        text: "So never make the callback your only source of truth. Two cheap safety nets cover it:",
      },
      {
        type: "ul",
        items: [
          "While a transaction is pending, poll your own status endpoint from the client every few seconds — you are reading your own row, so this is cheap.",
          "If it is still pending after roughly a minute, call Daraja's stkpushquery endpoint server-side and settle from that response through the same idempotent path.",
        ],
      },
      {
        type: "p",
        text: "Because settlement is idempotent, it does not matter which signal wins. Callback first, query first, or both at once — the ledger lands in the same state.",
      },
      { type: "h2", text: "Translate result codes before showing them" },
      {
        type: "p",
        text: "A raw numeric code at the payment step is where user trust dies. Map them to sentences a person can act on:",
      },
      {
        type: "code",
        lang: "ts",
        code: `const RESULT_MESSAGES: Record<number, string> = {
  0: "Payment received.",
  1: "Not enough M-Pesa balance for this amount.",
  1032: "You cancelled the prompt. Tap retry when you're ready.",
  1037: "The prompt timed out — check your phone is on and try again.",
  2001: "Wrong M-Pesa PIN. Try once more.",
};

const message = RESULT_MESSAGES[code] ?? "That payment didn't go through. Please try again.";`,
      },
      {
        type: "p",
        text: "None of this is difficult. It is just the part that no tutorial covers, and the part that separates a demo from something a business can put its revenue through.",
      },
    ],
  },
  {
    slug: "multi-tenant-supabase-rls",
    title: "Multi-tenant Supabase: getting RLS right the first time",
    description:
      "Row-level security is the cheapest tenancy boundary you'll ever get — and the easiest to write in a way that only looks correct.",
    date: "2026-05-22",
    tags: ["Supabase", "Postgres", "RLS", "Architecture"],
    body: [
      {
        type: "p",
        text: "In a multi-tenant app, the question that matters is simple: can a member of group A ever read a row belonging to group B? If that answer lives in your frontend, it is one careless query away from being no. If it lives in Postgres, it holds regardless of what any future feature does.",
      },
      { type: "h2", text: "Derive tenancy, never accept it" },
      {
        type: "p",
        text: "The most common mistake I see is a policy that reads plausibly but trusts a value the client supplies. If the tenant id comes in on the request, filtering by it proves nothing — the client can send a different one.",
      },
      {
        type: "p",
        text: "Tenancy must be derived from the authenticated user's own membership rows, which the user cannot forge.",
      },
      {
        type: "code",
        lang: "sql",
        code: `-- Membership is the source of truth for tenancy.
create table memberships (
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id uuid not null references groups(id) on delete cascade,
  role text not null check (role in ('admin','chairperson','treasurer','member')),
  primary key (user_id, group_id)
);

alter table contributions enable row level security;

create policy "members read own group contributions"
on contributions for select
using (
  exists (
    select 1 from memberships m
    where m.group_id = contributions.group_id
      and m.user_id = auth.uid()
  )
);`,
      },
      {
        type: "h2",
        text: "Watch for recursive policies",
      },
      {
        type: "p",
        text: "The moment you put a policy on the memberships table itself, a policy that queries memberships starts recursing. Postgres will tell you, but the error is confusing the first time you hit it.",
      },
      {
        type: "p",
        text: "The fix is a security definer function, which runs with the definer's privileges and therefore bypasses RLS on the tables it touches. Keep these functions tiny and obviously correct, because they are a deliberate hole in your boundary.",
      },
      {
        type: "code",
        lang: "sql",
        code: `create or replace function public.is_member_of(gid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from memberships
    where group_id = gid and user_id = auth.uid()
  );
$$;

create policy "members read own group contributions"
on contributions for select
using (is_member_of(group_id));`,
      },
      {
        type: "callout",
        text: "Always pin `set search_path` on a security definer function. Without it, a function running with elevated privileges can be tricked into resolving a table name you did not intend.",
      },
      { type: "h2", text: "USING and WITH CHECK are different questions" },
      {
        type: "p",
        text: "USING decides which existing rows you can see or touch. WITH CHECK decides whether the row you are about to write is allowed to exist. A policy with only USING on an INSERT lets a user write rows into someone else's tenant — the read side looks locked down while the write side is wide open.",
      },
      {
        type: "code",
        lang: "sql",
        code: `create policy "treasurers record contributions"
on contributions for insert
with check (
  has_role_in(group_id, array['treasurer','chairperson','admin'])
);

create policy "treasurers amend own group contributions"
on contributions for update
using (has_role_in(group_id, array['treasurer','admin']))       -- which rows
with check (has_role_in(group_id, array['treasurer','admin'])); -- the result row`,
      },
      { type: "h2", text: "The service role key is not a shortcut" },
      {
        type: "p",
        text: "The service role bypasses RLS entirely. It belongs in exactly two places: webhook handlers and trusted server-side jobs. It must never be imported into anything that can reach the client, and it must never be prefixed NEXT_PUBLIC_.",
      },
      {
        type: "p",
        text: "When a query is awkward under RLS, the temptation is to reach for the service role and move on. That is the moment your tenancy boundary quietly stops existing. Fix the policy instead.",
      },
      { type: "h2", text: "Test the boundary, don't assume it" },
      {
        type: "p",
        text: "Write one test that signs in as a member of group A and asserts that a query for group B's rows returns nothing. It takes ten minutes and it is the only thing standing between you and a data leak that would end a SaaS product.",
      },
      {
        type: "ol",
        items: [
          "Seed two groups with distinct members.",
          "Authenticate as a member of group A using the anon key, not the service role.",
          "Select every tenant-scoped table without a filter and assert nothing from group B comes back.",
        ],
      },
      {
        type: "p",
        text: "If that test passes, the boundary is real. If you have never run it, you have a boundary that has only ever been reviewed by eye.",
      },
    ],
  },
  {
    slug: "store-kes-in-integer-cents",
    title: "Store KES as integers, always",
    description:
      "Floating-point money is a bug with a delay fuse. In an M-Pesa flow, that bug shows up as a mismatch between your price and the amount on the customer's phone.",
    date: "2026-04-30",
    tags: ["Payments", "Postgres", "TypeScript"],
    body: [
      {
        type: "p",
        text: "A JavaScript number cannot represent 0.1 exactly. Everyone knows this and everyone stores prices as floats anyway, because the errors are tiny and take months to surface.",
      },
      {
        type: "p",
        text: "In an M-Pesa flow the delay is much shorter, and the failure is public. You show KES 12,499.99 on the product page, the STK prompt says 12,500, and your customer is now looking at two different numbers on two different screens while deciding whether to trust you.",
      },
      { type: "h2", text: "One rule" },
      {
        type: "p",
        text: "Store money as an integer count of the smallest unit — cents — from the database through to the API boundary. Convert to a display string exactly once, at the edge, when rendering.",
      },
      {
        type: "code",
        lang: "ts",
        code: `// Everywhere internal: integer cents.
type Money = number; // KES cents

export function formatKES(cents: Money): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

// Daraja wants whole shillings — round once, deliberately, at the boundary.
export function toDarajaAmount(cents: Money): number {
  return Math.round(cents / 100);
}`,
      },
      {
        type: "callout",
        text: "Daraja rejects fractional amounts on STK Push. If you are rounding at the last second before the request, your customer is being charged a number you never showed them. Round when you set the price instead.",
      },
      { type: "h2", text: "In Postgres" },
      {
        type: "p",
        text: "Use bigint for cents, with a check constraint. Not float, not real, and not numeric unless you genuinely need fractional units — numeric is correct but slower and invites the same rounding ambiguity back in.",
      },
      {
        type: "code",
        lang: "sql",
        code: `create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_cents bigint not null check (price_cents >= 0),
  created_at timestamptz not null default now()
);`,
      },
      {
        type: "h2",
        text: "The naming half of the trick",
      },
      {
        type: "p",
        text: "Suffix every money field with the unit: price_cents, amount_cents, balance_cents. It reads slightly ugly and it is worth it — a reviewer can spot a unit mismatch in a diff without opening the schema, which is exactly when you want to catch it.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** Rough reading time, 200 wpm, rounded up. */
export function readingTime(post: Post): number {
  const words = post.body
    .map((block) => {
      if (block.type === "ul" || block.type === "ol") return block.items.join(" ");
      if (block.type === "code") return block.code;
      return block.text;
    })
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
