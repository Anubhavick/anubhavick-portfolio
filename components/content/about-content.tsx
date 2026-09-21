import Link from "next/link";
import { experience, projects } from "@/content";

/**
 * Bio content — used unchanged by the About window and the /about route.
 * No hooks, safe in a server or client tree.
 */
export function AboutContent() {
  const current = experience.find((entry) => !entry.endDate) ?? experience[0];
  const shippedCount = projects.filter((p) => p.status === "shipped").length;

  return (
    <div className="flex flex-col gap-4 p-5">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-2xl text-ink">Anubhav Mishra</h1>
        <p className="text-sm text-ink-muted">
          Full-stack engineer specializing in AI/ML integration, blockchain, and cloud-native
          architecture.
        </p>
      </header>

      <div className="flex max-w-[68ch] flex-col gap-3 text-sm text-ink">
        <p>
          I build production systems end to end — React and Next.js on the front, Python/FastAPI
          and Node.js on the back, Solidity when the problem calls for a smart contract. Recent
          work has landed sub-100ms API latency, a 60% bundle-size reduction, and 99%+ accuracy on
          an AI classification pipeline, at 95%+ test coverage.
        </p>
        <p>
          I&apos;ve published two npm packages with 500+ combined weekly downloads
          {current && (
            <>
              , and currently work as {current.role} at {current.organization}
            </>
          )}
          . I&apos;m a 3rd-year Computer Science student at Manav Rachna International Institute
          of Research &amp; Studies, in Faridabad, Haryana.
        </p>
        <p>
          {shippedCount} shipped projects live under{" "}
          <Link href="/projects" className="text-accent underline-offset-4 hover:underline">
            Projects
          </Link>
          , the full work history is under{" "}
          <Link href="/experience" className="text-accent underline-offset-4 hover:underline">
            Experience
          </Link>
          , and the full toolset is under{" "}
          <Link href="/stack" className="text-accent underline-offset-4 hover:underline">
            Stack
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
