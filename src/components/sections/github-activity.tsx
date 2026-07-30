import { ArrowUpRightIcon, GitBranchIcon, GithubIcon, StarIcon } from "@/components/icons";
import { Card, Container } from "@/components/ui";
import { githubUsername } from "@/content/site";

/**
 * Live GitHub snapshot: profile totals plus the most recently pushed public
 * repositories.
 *
 * Fetched on the server and cached for an hour, so visitors never pay for the
 * round trip and we stay well inside GitHub's unauthenticated rate limit. Set
 * GITHUB_TOKEN to raise that limit if you ever need to.
 *
 * Every failure path degrades to a link to the profile — a portfolio should
 * never show a broken widget because a third-party API had a bad minute.
 */

type GitHubUser = {
  login: string;
  name: string | null;
  public_repos: number;
  followers: number;
  html_url: string;
};

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
};

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function getGitHub(): Promise<{ user: GitHubUser; repos: GitHubRepo[] } | null> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${githubUsername}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.github.com/users/${githubUsername}/repos?sort=pushed&per_page=100`,
        { headers, next: { revalidate: 3600 } },
      ),
    ]);

    if (!userRes.ok || !reposRes.ok) return null;

    const user = (await userRes.json()) as GitHubUser;
    const all = (await reposRes.json()) as GitHubRepo[];
    if (!Array.isArray(all)) return null;

    const repos = all
      .filter((repo) => !repo.fork && !repo.archived)
      .slice(0, 6);

    return { user, repos };
  } catch {
    return null;
  }
}

function relativeTime(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

function ProfileLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={`https://github.com/${githubUsername}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover ${className}`}
    >
      View full profile
      <ArrowUpRightIcon className="size-4" />
    </a>
  );
}

export async function GitHubActivity() {
  const data = await getGitHub();

  return (
    <Container>
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-lg bg-surface-2 text-xl text-foreground"
            >
              <GithubIcon />
            </span>
            <div>
              <h3 className="text-sm font-semibold">Recent GitHub activity</h3>
              <p className="font-mono text-xs text-muted">@{githubUsername}</p>
            </div>
          </div>

          {data ? (
            <dl className="flex items-center gap-6">
              <div>
                <dt className="text-xs text-muted">Public repos</dt>
                <dd className="font-mono text-lg font-semibold">
                  {data.user.public_repos}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Followers</dt>
                <dd className="font-mono text-lg font-semibold">
                  {data.user.followers}
                </dd>
              </div>
            </dl>
          ) : null}
        </div>

        {data && data.repos.length > 0 ? (
          <>
            <ul className="grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0">
              {data.repos.map((repo) => (
                <li key={repo.id} className="border-border sm:border-b sm:odd:border-r">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full flex-col gap-2 p-5 transition-colors hover:bg-surface-2"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <GitBranchIcon className="size-4 shrink-0 text-accent" />
                      <span className="truncate">{repo.name}</span>
                    </span>
                    <span className="line-clamp-2 text-xs leading-relaxed text-muted">
                      {repo.description ?? "No description."}
                    </span>
                    <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 font-mono text-[11px] text-muted">
                      {repo.language ? <span>{repo.language}</span> : null}
                      {repo.stargazers_count > 0 ? (
                        <span className="inline-flex items-center gap-1">
                          <StarIcon className="size-3.5" />
                          {repo.stargazers_count}
                        </span>
                      ) : null}
                      <span>pushed {relativeTime(repo.pushed_at)}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="p-5">
              <ProfileLink />
            </div>
          </>
        ) : (
          <div className="p-6">
            <p className="text-sm text-muted">
              {data
                ? "No public repositories to show yet."
                : "Couldn't reach GitHub just now — the profile is still there."}
            </p>
            <ProfileLink className="mt-3" />
          </div>
        )}
      </Card>
    </Container>
  );
}

/** Streamed in via Suspense while the GitHub request is in flight. */
export function GitHubActivitySkeleton() {
  return (
    <Container>
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border p-6">
          <div className="skeleton size-10 rounded-lg" />
          <div className="space-y-2">
            <div className="skeleton h-3.5 w-40 rounded" />
            <div className="skeleton h-3 w-24 rounded" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2.5 p-5">
              <div className="skeleton h-3.5 w-32 rounded" />
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-2/3 rounded" />
            </div>
          ))}
        </div>
      </Card>
    </Container>
  );
}
