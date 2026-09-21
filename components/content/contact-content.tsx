import type { SocialLink } from "@/content/schema";
import { renderIcon } from "@/lib/icons";

interface ContactContentProps {
  socials: SocialLink[];
}

/**
 * Contact info — used unchanged by the Contact window and the /contact
 * route. No hooks, safe in a server or client tree.
 */
export function ContactContent({ socials }: ContactContentProps) {
  const email = socials.find((s) => s.id === "email");
  const others = socials.filter((s) => s.id !== "email");

  return (
    <div className="flex flex-col gap-5 p-5">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-xl text-ink">Get in touch</h1>
        <p className="max-w-[52ch] text-sm text-ink-muted">
          Best reached by email, or find me on any of these.
        </p>
      </header>

      {email && (
        <a
          href={email.url}
          className="w-fit rounded-control border border-hairline bg-surface-2/60 px-3 py-2 font-mono text-sm text-ink hover:border-accent hover:text-accent"
        >
          {email.handle}
        </a>
      )}

      <ul className="flex flex-col gap-2.5">
        {others.map((social) => (
          <li key={social.id}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-ink hover:text-accent"
            >
              {renderIcon(social.icon, { size: 16, strokeWidth: 1.6, className: "shrink-0 text-ink-muted" })}
              <span>{social.label}</span>
              {social.handle && (
                <span className="font-mono text-xs text-ink-muted">{social.handle}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
