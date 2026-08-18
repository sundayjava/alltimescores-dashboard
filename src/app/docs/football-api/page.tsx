import Link from "next/link";
import type { Metadata } from "next";
import { AuthBadge } from "@/components/docs/method-badge";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import {
  EndpointCard,
  FieldLabel,
  FieldsTable,
} from "@/components/docs/endpoint-card";
import { RefTable } from "@/components/docs/ref-table";
import { PlanCard } from "@/components/docs/plan-card";

export const metadata: Metadata = {
  title: "Football API Reference",
  description:
    "Endpoint reference for the football data API plus its API-keys, plans, billing, and usage surfaces.",
};

const NAV = [
  { href: "#auth", label: "Auth" },
  { href: "#keys", label: "API Keys" },
  { href: "#plans", label: "Plans & Limits" },
  { href: "#billing", label: "Billing" },
  { href: "#usage", label: "Usage" },
  { href: "#data", label: "Football Data" },
  { href: "#realtime", label: "Realtime" },
  { href: "#errors", label: "Errors" },
];

export default function FootballApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Masthead */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-mono text-sm font-semibold text-foreground">
              alltimescores<span className="text-accent">/</span>football-api
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              for frontend & dashboard integration — v1
            </span>
          </div>
          <nav className="mt-2 flex flex-wrap gap-4">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-mono text-xs text-muted-foreground hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-10 pb-24">
        {/* Hero */}
        <div className="mb-14">
          <p className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-accent uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Sold Product · Platform Dashboard
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Football API Reference
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            The football data product we sell, plus everything a customer&apos;s
            dashboard needs around it — issuing API keys, reading plan
            limits, upgrading a subscription, and watching usage. Two auth
            models live side by side here; §1 explains which one each
            section uses.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            <div className="bg-card p-4">
              <p className="mb-1.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                Data API base
              </p>
              <p className="font-mono text-sm text-foreground">
                /api/v1/football
              </p>
            </div>
            <div className="bg-card p-4">
              <p className="mb-1.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                Dashboard base
              </p>
              <p className="font-mono text-sm text-foreground">
                /api/v1/platform/*
              </p>
            </div>
            <div className="bg-card p-4">
              <p className="mb-1.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                Endpoints documented
              </p>
              <p className="font-mono text-sm text-foreground">
                20 data · 5 key · 8 usage · 4 billing
              </p>
            </div>
          </div>
        </div>

        {/* 01 — Auth */}
        <section id="auth" className="mb-16 scroll-mt-24">
          <SectionHead num="01" title="Two auth models" />
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            Don&apos;t mix these up — using the wrong one is the single most
            common integration mistake.
          </p>

          <FieldsTable
            columns={["Surface", "Mechanism", "Used for"]}
            rows={[
              [
                <AuthBadge key="a" kind="apikey" />,
                <code key="b">x-api-key: ft_live_...</code>,
                "Every /api/v1/football/* data route — what the customer's own backend calls.",
              ],
              [
                <AuthBadge key="a" kind="session" />,
                <>
                  httpOnly <code>access_token</code> cookie, set at login
                </>,
                <>
                  The dashboard itself — managing keys, billing, usage
                  stats. Send requests with{" "}
                  <code>credentials: &quot;include&quot;</code>; there&apos;s
                  nothing to attach manually.
                </>,
              ],
            ]}
          />

          <FieldLabel>Calling the data API</FieldLabel>
          <CodeBlock>
            {`curl "https://api.alltimescores.com/api/v1/football/fixtures?league=39&season=2025&next=5" \\
  -H "x-api-key: ft_live_5f3a...9c21"`}
          </CodeBlock>

          <Callout>
            <strong className="text-accent">Heads up —</strong> the API key
            never travels through the dashboard&apos;s cookie session. If
            your dashboard needs to <em>test</em> a key against the live
            data API, do it as a real <code>x-api-key</code> request from
            the browser or your backend — not by reusing the logged-in
            cookie.
          </Callout>
        </section>

        {/* 02 — API Keys */}
        <section id="keys" className="mb-16 scroll-mt-24">
          <SectionHead num="02" title="API Keys" />
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            Session-authenticated. Base:{" "}
            <code className="text-foreground">/api/v1/platform/api-keys</code>
            . A key&apos;s raw value is shown exactly once — at creation and
            at rotation — and only its hash is ever stored, so there is no
            &quot;reveal&quot; endpoint. Design the UI around that: a modal
            with a copy button and a &quot;you won&apos;t see this
            again&quot; warning is the moment, not something to defer.
          </p>

          <EndpointCard method="POST" path="/">
            <p>Creates a key.</p>
            <FieldLabel>Body</FieldLabel>
            <FieldsTable
              columns={["Field", "Type", "Notes"]}
              rows={[
                [
                  <>
                    name<span className="ml-1 text-[10px] text-red-500">required</span>
                  </>,
                  "string",
                  "2–50 chars",
                ],
              ]}
            />
            <FieldLabel>201 response</FieldLabel>
            <CodeBlock>
              {`{ "success": true, "message": "API key created. Save it now because it won't be shown again.",
  "data": { "apiKey": "ft_live_5f3a8c...9c21" } }`}
            </CodeBlock>
          </EndpointCard>

          <EndpointCard method="GET" path="/">
            <p>
              Lists the caller&apos;s keys.{" "}
              <strong>Revoked keys are omitted</strong> — if you want a
              &quot;revoked&quot; tab, hold onto them client-side rather
              than expecting the API to return them.
            </p>
            <FieldLabel>200 response — one item</FieldLabel>
            <CodeBlock>
              {`{ "id": "...", "name": "Production", "revoked": false,
  "createdAt": "...", "updatedAt": "...", "lastUsedAt": "..." | null }`}
            </CodeBlock>
          </EndpointCard>

          <EndpointCard method="PATCH" path="/:id">
            <p>
              Renames a key. Body: <code>{"{ name: string }"}</code>, same
              2–50 char rule. Returns the updated key (never the raw
              value).
            </p>
          </EndpointCard>

          <EndpointCard method="POST" path="/:id/rotate">
            <p>
              Issues a new raw key for the same record and invalidates the
              old one immediately — also un-revokes it if it had been
              revoked. Same one-time-reveal response shape as create, with
              the message <em>&quot;Copy this key now. It won&apos;t be
              shown again.&quot;</em>
            </p>
          </EndpointCard>

          <EndpointCard method="DELETE" path="/:id">
            <p>
              Revokes a key. It&apos;s a soft delete — the record stays for
              history/audit, but any request made with it now gets a 401.
              Returns the key with <code>revoked: true</code>.
            </p>
          </EndpointCard>

          <Callout>
            <strong className="text-accent">
              Design for the list you fetched —
            </strong>{" "}
            only surface rename/rotate/revoke actions on keys returned from{" "}
            <code>GET /</code> for the signed-in user. The API takes any key
            id you send it without re-checking ownership, so the id itself
            isn&apos;t a safety net — don&apos;t build a flow that lets a
            user type or paste an arbitrary id.
          </Callout>
        </section>

        {/* 03 — Plans & Limits */}
        <section id="plans" className="mb-16 scroll-mt-24">
          <SectionHead num="03" title="Plans & Limits" />
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            Every data-API request counts against a single rolling daily
            quota — there&apos;s no per-minute rate limit, just this one
            cap, checked fresh on every call.
          </p>

          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <PlanCard name="FREE" price="$0" limit="100" />
            <PlanCard name="STARTER" price="$10 / 30 days" limit="5,000" />
            <PlanCard name="PRO" price="$20 / 30 days" limit="50,000" />
            <PlanCard
              name="ENTERPRISE"
              price="$50 / 30 days"
              limit="Unlimited"
              highlight
            />
          </div>

          <FieldLabel>Over the limit</FieldLabel>
          <p className="mb-2 text-sm text-muted-foreground">
            Every route under <code className="text-foreground">/api/v1/football/*</code>{" "}
            (except <code className="text-foreground">/health</code> and{" "}
            <code className="text-foreground">/sse</code>) returns this the
            moment a plan&apos;s daily count is reached — build your client
            to recognize it and stop retrying until the next day:
          </p>
          <CodeBlock>
            {`429 Too Many Requests
{
  "success": false,
  "message": "Daily request limit exceeded.",
  "data": { "plan": "STARTER", "limit": 5000, "used": 5000 }
}`}
          </CodeBlock>
        </section>

        {/* 04 — Billing */}
        <section id="billing" className="mb-16 scroll-mt-24">
          <SectionHead num="04" title="Subscriptions & Billing" />
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            Session-authenticated. Reading state lives under{" "}
            <code className="text-foreground">/api/v1/platform/subscriptions</code>
            ; the real paid-upgrade flow lives under{" "}
            <code className="text-foreground">/api/v1/platform/billing</code>.
          </p>

          <EndpointCard method="GET" path="/subscriptions/current">
            <p>
              The caller&apos;s subscription row, or <code>null</code> if
              they&apos;ve never had one (fresh FREE users). Use this to
              render the current plan, status, and renewal date.
            </p>
            <FieldLabel>200 response</FieldLabel>
            <CodeBlock>
              {`{ "plan": "PRO", "status": "ACTIVE", "startsAt": "...",
  "expiresAt": "...", "autoRenew": true, ... }`}
            </CodeBlock>
            <p>
              <code>status</code> is one of <code>PENDING</code> ·{" "}
              <code>ACTIVE</code> · <code>CANCELLED</code> ·{" "}
              <code>EXPIRED</code> · <code>PAST_DUE</code>.
            </p>
          </EndpointCard>

          <EndpointCard method="POST" path="/billing/checkout">
            <p>
              The real upgrade path — this is what an &quot;Upgrade to
              Pro&quot; button should call. Body:{" "}
              <code>{'{ plan: "STARTER" | "PRO" | "ENTERPRISE" }'}</code>.
              Creates a pending payment and returns a hosted checkout URL —
              redirect the user there; a webhook activates the plan once
              payment completes, so <code>/subscriptions/current</code> may
              briefly show <code>PENDING</code> after redirect back.
            </p>
            <FieldLabel>200 response</FieldLabel>
            <CodeBlock>
              {`{ "data": { "payment": { ... }, "checkoutUrl": "https://alltimescores.lemonsqueezy.com/checkout/..." } }`}
            </CodeBlock>
            <FieldLabel>Rejections you should handle in the UI</FieldLabel>
            <FieldsTable
              columns={["Status", "Message", "Means"]}
              rows={[
                [
                  "401",
                  "Free plan does not require checkout.",
                  "FREE has no checkout — just don't show the button for it.",
                ],
                [
                  "409",
                  "You already have a {plan} subscription.",
                  "They're already on the plan they're requesting.",
                ],
                [
                  "400",
                  "Downgrades should be done through Change Plan.",
                  "Checkout only goes same-plan-or-higher; downgrade UI isn't wired up yet — hide it or route to support.",
                ],
                [
                  "409",
                  "You already have a pending checkout.",
                  "An unfinished checkout exists — resume it, don't start another.",
                ],
              ]}
            />
          </EndpointCard>

          <EndpointCard method="GET" path="/billing/history">
            <p>
              The user&apos;s payments, most recent first — for a
              billing/invoices tab. Each item:{" "}
              <code>
                {"{ amount, currency, provider, status, plan, paidAt, createdAt, ... }"}
              </code>
              .
            </p>
          </EndpointCard>

          <Callout tone="warn">
            <strong>Not ready to wire up yet —</strong>{" "}
            <code>POST /subscriptions/cancel</code> currently looks up a
            subscription by the caller&apos;s <em>user</em> id instead of
            their subscription id, so in practice it 404s (&quot;Subscription
            not found.&quot;) for real accounts. Hold off building a working
            cancel button against it until backend confirms it&apos;s fixed.
            Likewise, <code>POST /subscriptions/upgrade</code> changes the
            plan instantly with no payment step at all — treat it as an
            internal/downgrade-to-FREE utility, not the customer-facing
            upgrade flow; use <code>/billing/checkout</code> for anything
            the user pays for.
          </Callout>
        </section>

        {/* 05 — Usage */}
        <section id="usage" className="mb-16 scroll-mt-24">
          <SectionHead num="05" title="Usage Analytics" />
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            Session-authenticated, base{" "}
            <code className="text-foreground">/api/v1/platform/api-usage</code>
            . Everything here is scoped to the signed-in user, combined
            across all of their keys — enough to build a &quot;your API
            usage&quot; dashboard panel. No query params on any of these;
            the windows below are fixed server-side.
          </p>

          <RefTable
            rows={[
              { path: "/summary", returns: "today's count, all-time total, avg response time, last request" },
              { path: "/daily", returns: "[{ date, requests }] — last 30 days" },
              { path: "/endpoints", returns: "top 10 endpoints by request count" },
              { path: "/status-codes", returns: "request counts grouped by HTTP status" },
              { path: "/recent", returns: "last 20 requests — endpoint, method, status, response time, IP, user agent, time" },
              { path: "/api-keys", returns: "request count broken down per API key" },
              { path: "/slow-endpoints", returns: "top 10 endpoints by average response time" },
              { path: "/success-rate", returns: "{ total, successful, successRate }" },
            ]}
          />
        </section>

        {/* 06 — Football Data */}
        <section id="data" className="mb-16 scroll-mt-24">
          <SectionHead num="06" title="Football Data" />
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            API-key authenticated, base{" "}
            <code className="text-foreground">/api/v1/football</code>. Every
            response shares one envelope; <code>data</code> is what changes
            per endpoint.
          </p>

          <CodeBlock>
            {`{
  "success": true, "message": "Success", "timestamp": "...", "requestId": "...",
  "executionTime": "42ms", "cached": true, "data": { /* endpoint-specific */ }
}`}
          </CodeBlock>
          <p className="mb-2 text-sm text-muted-foreground">
            <code className="text-foreground">cached</code> tells you
            whether this came from Redis or a fresh upstream call — useful
            for debugging staleness, not something to branch your UI on.
          </p>

          <Callout tone="warn">
            <strong>Known inconsistency —</strong> on six endpoints —{" "}
            <strong>Standings, Teams, Leagues, Statistics, Events,
            Lineups</strong> — the top-level <code>cached</code> flag is
            always <code>false</code>, and the real payload sits one level
            deeper than usual: <code>data.data</code> instead of{" "}
            <code>data</code>, with the real cache flag at{" "}
            <code>data.cached</code>. Every other endpoint below is flat (
            <code>data</code> is the payload directly). It&apos;s a known
            backend bug, not documented behavior — write your response
            parsing defensively for those six until it&apos;s fixed.
          </Callout>

          <h3 className="mt-8 mb-3 text-sm font-semibold text-foreground">
            Fixtures & live matches
          </h3>
          <RefTable
            rows={[
              {
                path: "/fixtures",
                optional:
                  "id, ids, league, season, team, live, date, from, to, next, last, round, status, venue, timezone",
                returns:
                  "Fixture search/list. live=all for everything live right now — this one endpoint covers “today's matches,” “this team's season,” and “live now.”",
              },
              {
                path: "/head-to-head",
                required: "h2h",
                optional: "last (default 10)",
                returns: "Last N meetings between two teams (“33-34” team-id pair), same fixture shape.",
              },
              {
                path: "/match",
                required: "fixture",
                returns:
                  "Composite endpoint — fixture + events + statistics + lineups merged. Use for a match-detail screen instead of four calls.",
              },
            ]}
          />

          <h3 className="mt-8 mb-3 text-sm font-semibold text-foreground">
            Leagues, standings & teams
          </h3>
          <RefTable
            rows={[
              {
                path: "/leagues",
                returns: "Full leagues/cups catalog. No filters wired up yet — query strings are currently ignored.",
              },
              { path: "/standings", required: "league, season", returns: "Standings table for one league + season." },
              { path: "/rounds", required: "league, season", returns: "Round names (e.g. “Regular Season - 1”) — a plain string array." },
              {
                path: "/teams",
                optional: "id, league, season, country, name, code, search, venue — at least one required",
                returns: "Team profile + venue.",
              },
              {
                path: "/team-statistics",
                required: "league, season, team",
                returns: "One team's season aggregate — form, W/D/L, goals, streaks, clean sheets, cards. A single object, not an array.",
              },
            ]}
          />

          <h3 className="mt-8 mb-3 text-sm font-semibold text-foreground">
            Match detail
          </h3>
          <RefTable
            rows={[
              { path: "/events", required: "fixture", returns: "Match timeline — goals, cards, subs, VAR." },
              { path: "/statistics", required: "fixture", returns: "Per-team match stats — shots, possession, cards." },
              { path: "/lineups", required: "fixture", returns: "Starting XI, subs, formation, coach for both teams." },
              { path: "/prediction", required: "fixture", returns: "Win/draw/lose prediction, goals advice, form comparison, recent H2H." },
            ]}
          />

          <h3 className="mt-8 mb-3 text-sm font-semibold text-foreground">
            Players, coaches & rankings
          </h3>
          <RefTable
            rows={[
              {
                path: "/players",
                optional: "id, team, league, season, search, page (default 1)",
                required: "search needs team, or league+season",
                returns: "Player profiles + season stats. Paginated via api-football's own paging, not page/limit.",
              },
              { path: "/coaches", optional: "id, team, search", returns: "Coach profile + career history." },
              { path: "/injuries", optional: "league, season, team, player, fixture, date", returns: "Injury records matching the filters." },
              { path: "/transfers", optional: "player, team", returns: "Transfer history for a player or team." },
              { path: "/top-scorers", required: "league, season", returns: "Top 20 goal scorers, ranked." },
              { path: "/top-assists", required: "league, season", returns: "Top assist providers, ranked. Same shape as top-scorers." },
              { path: "/top-yellow-cards", required: "league, season", returns: "Most yellow cards, ranked." },
              { path: "/top-red-cards", required: "league, season", returns: "Most red cards, ranked." },
            ]}
          />
        </section>

        {/* 07 — Realtime */}
        <section id="realtime" className="mb-16 scroll-mt-24">
          <SectionHead num="07" title="Realtime & Health" />

          <EndpointCard method="GET" path="/sse/events" auth="public">
            <p>
              A Server-Sent Events stream pushing live fixtures, live
              events, statistics, and lineup changes as they happen —
              subscribe instead of polling{" "}
              <code>/fixtures?live=all</code>. Also carries the
              platform&apos;s <code>broadcast</code> notices.
            </p>
            <CodeBlock>
              {`const source = new EventSource("/api/v1/football/sse/events");
source.addEventListener("live-fixtures", (e) => { JSON.parse(e.data) });`}
            </CodeBlock>
            <p>
              Event names: <code>connected</code>, <code>live-fixtures</code>
              , <code>live-events</code>, <code>live-statistics</code>,{" "}
              <code>live-lineups</code>, <code>broadcast</code>. A heartbeat
              comment ships every 30s and needs no handling.
            </p>
          </EndpointCard>

          <EndpointCard method="GET" path="/health" auth="public">
            <p>
              Liveness check. Returns{" "}
              <code>{'{ status: "ok" }'}</code> — note this is the one
              endpoint that skips the standard envelope.
            </p>
          </EndpointCard>

          <Callout>
            <strong className="text-accent">
              Both of these are unauthenticated today
            </strong>{" "}
            — no <code>x-api-key</code>, no plan check. Fine to build
            against as-is, but don&apos;t assume they inherit the same
            access control as the rest of <code>/football/*</code>.
          </Callout>
        </section>

        {/* 08 — Errors */}
        <section id="errors" className="mb-16 scroll-mt-24">
          <SectionHead num="08" title="Errors" />
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            One shared envelope across the whole API, plus the two auth
            surfaces&apos; own flavors.
          </p>

          <FieldLabel>Data API (x-api-key)</FieldLabel>
          <FieldsTable
            columns={["Status", "Message", "Cause"]}
            rows={[
              ["401", "API Key is required.", "No x-api-key header sent."],
              ["401", "Invalid API Key.", "Unknown, revoked, or disabled key."],
              ["401", "User not found.", "The key's owner account is missing or deactivated."],
              ["429", "Daily request limit exceeded.", "See §3."],
            ]}
          />

          <FieldLabel>Dashboard (session cookie)</FieldLabel>
          <FieldsTable
            columns={["Status", "Message", "Cause"]}
            rows={[
              ["401", "Authentication required.", "No session cookie."],
              ["401", "Invalid access token.", "Cookie present but expired/malformed — redirect to login."],
              ["403", "Account is deactivated.", "Account soft-deleted or deactivated."],
            ]}
          />

          <FieldLabel>Generic (either surface)</FieldLabel>
          <CodeBlock>
            {`{ "success": false, "message": "...", "requestId": "...", "timestamp": "..." }`}
          </CodeBlock>
          <p className="text-sm text-muted-foreground">
            A failed body validation adds an <code>errors</code> field on a
            400 — Zod&apos;s field-level breakdown (
            <code>{"{ fieldErrors, formErrors }"}</code>).
          </p>
        </section>

        {/* 09 — Checklist */}
        <section className="mb-4 scroll-mt-24">
          <SectionHead num="09" title="Build checklist" />
          <ul className="flex flex-col gap-2.5">
            {[
              <>Dashboard auth uses the cookie session (<code>credentials: &quot;include&quot;</code>); data-API calls use <code>x-api-key</code> — never mix the two up in one client.</>,
              <>Build the key-creation modal around the one-time reveal — copy button, explicit warning, no &quot;show again&quot; affordance.</>,
              <>Surface the plan&apos;s daily limit and today&apos;s usage (<code>/api-usage/summary</code>) somewhere visible, and handle 429 distinctly from other errors.</>,
              <>Point the real &quot;Upgrade&quot; button at <code>/billing/checkout</code>, not <code>/subscriptions/upgrade</code> — and hold off on a &quot;Cancel&quot; button until the subscription-id bug in §4 is fixed backend-side.</>,
              <>For Standings, Teams, Leagues, Statistics, Events, or Lineups, unwrap the extra <code>data.data</code> layer described in §6 before reading the payload.</>,
              <>Prefer <code>/match?fixture=</code> over four separate calls for a match-detail screen; prefer the SSE feed over polling for anything live.</>,
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 text-sm text-muted-foreground ring-1 ring-foreground/10 [&_code]:text-foreground"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-[11px] text-accent">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <footer className="flex flex-wrap justify-between gap-3 border-t border-border pt-5 font-mono text-xs text-muted-foreground">
          <span>Football API Reference — Data, Keys, Billing & Usage</span>
          <Link href="/console" className="hover:text-accent">
            Back to console
          </Link>
        </footer>
      </div>
    </div>
  );
}

function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-2 flex items-baseline gap-3 border-b border-border pb-3">
      <span className="font-mono text-xs text-muted-foreground">{num}</span>
      <h2 className="text-lg font-bold tracking-tight text-foreground">
        {title}
      </h2>
    </div>
  );
}
