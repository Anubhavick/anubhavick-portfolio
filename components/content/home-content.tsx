import Link from "next/link";
import { socialLinks } from "@/content";
import { SITE_TAGLINE } from "@/lib/site";

const NAV = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/stack", label: "Stack" },
  { href: "/contact", label: "Contact" },
  { href: "/terminal", label: "Terminal" },
  { href: "/help", label: "Help" },
];

/**
 * The server-rendered fallback for "/" — sits under the desktop shell in
 * the DOM. Once JS boots, the shell covers it visually, but crawlers and
 * no-JS visitors get this real content instead of an empty body.
 */
export function HomeContent() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[68ch] flex-col gap-6 px-6 py-16">
      <header className="flex flex-col gap-2">
        <p className="font-display text-3xl text-ink">AM</p>
        <h1 className="text-2xl text-ink">Anubhav Mishra</h1>
        <p className="text-base text-ink-muted">{SITE_TAGLINE}</p>
      </header>

      <p className="max-w-[60ch] text-sm text-ink-muted">
        This portfolio is built as a desktop-OS metaphor and is booting up. If you&apos;re reading
        this instead of a desktop, JavaScript is disabled or still loading — every link below
        works as a plain page either way.
      </p>

      <nav aria-label="Primary">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-sm text-accent underline-offset-4 hover:underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {socialLinks.map((link) => (
          <li key={link.id}>
            <a
              href={link.url}
              target={link.id === "email" ? undefined : "_blank"}
              rel={link.id === "email" ? undefined : "noopener noreferrer"}
              className="text-sm text-ink-muted underline-offset-4 hover:text-accent hover:underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
