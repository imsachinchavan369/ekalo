"use client";

import { Instagram, MessageCircle, Send, Sparkles, Twitter, Youtube } from "lucide-react";
import { InlineEditButton } from "@/components/admin/InlineEditButton";
import { useSiteContent } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";

export function Footer() {
  const { content } = useSiteContent();
  const footer = content.footer;

  return (
    <footer className="border-t border-white/10 bg-black/55">
      <div className="relative mx-auto grid max-w-[1320px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.45fr_0.8fr_0.8fr_0.9fr_1.35fr] lg:px-10">
        <InlineEditButton
          title="Footer"
          fields={[
            { name: "description", label: "Description", value: footer.description, type: "textarea" },
            { name: "platformLinks", label: "Platform links, comma separated", value: footer.platformLinks.join(", ") },
            { name: "companyLinks", label: "Company links, comma separated", value: footer.companyLinks.join(", ") },
            { name: "supportLinks", label: "Support links, comma separated", value: footer.supportLinks.join(", ") }
          ]}
          buildUpdates={(values) => ({
            footer: {
              description: values.description,
              platformLinks: values.platformLinks.split(",").map((link) => link.trim()).filter(Boolean),
              companyLinks: values.companyLinks.split(",").map((link) => link.trim()).filter(Boolean),
              supportLinks: values.supportLinks.split(",").map((link) => link.trim()).filter(Boolean)
            }
          })}
        />
        <div>
          <a href="/" className="flex items-center gap-3" aria-label="EKALO home">
            <Sparkles className="h-9 w-9 fill-ekalo-gold text-ekalo-gold" aria-hidden="true" />
            <span>
              <span className="block text-3xl font-extrabold leading-none text-white">{content.navbar.logoText}</span>
              <span className="mt-1 block text-sm text-white/80">{content.navbar.tagline}</span>
            </span>
          </a>
          <p className="mt-4 max-w-sm text-white/60">{footer.description}</p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Youtube, Twitter, MessageCircle].map((Icon, index) => (
              <a
                key={index}
                href="#"
                aria-label="EKALO social profile"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-ekalo-gold/60 hover:text-ekalo-gold"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Platform" links={footer.platformLinks} />
        <FooterColumn title="Company" links={footer.companyLinks} />
        <FooterColumn title="Support" links={footer.supportLinks} />

        <div>
          <h3 className="font-semibold text-white">Newsletter</h3>
          <p className="mt-3 max-w-sm text-white/60">Get updates on new challenges and exciting rewards.</p>
          <form className="mt-5 flex rounded-lg border border-ekalo-line bg-black/35 p-1">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 bg-transparent px-4 text-white outline-none placeholder:text-white/40"
            />
            <Button type="submit" size="sm" variant="purpleGhost" aria-label="Subscribe to newsletter">
              <Send className="h-5 w-5" aria-hidden="true" />
            </Button>
          </form>
        </div>
      </div>
      <p className="px-5 pb-8 text-center text-sm text-white/40">© 2024 EKALO. All rights reserved.</p>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-white/60">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="transition hover:text-ekalo-gold">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
