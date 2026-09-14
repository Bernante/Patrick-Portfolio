"use client";

import { useState } from "react";
import { faqs, site } from "@/lib/site";
import { Icon, type IconName } from "../Icon";
import { Reveal } from "../Reveal";

/**
 * FAQs / Contact page, rebuilt on the reference (portfolio.brewedops.cloud/
 * contact), a single screen:
 *  - Header: eyebrow "FAQs / Contact", title, lede.
 *  - Glass panel. Desktop (1100px+): two columns, 0.8fr / 1.35fr, filling the
 *    screen height. The FAQ column never drops below clamp(280px, 60vw − 360px,
 *    440px), so from 1280px the full email pill and the three reference-size
 *    (36px) social buttons share one row; narrower, the buttons move under it.
 *    Left, a dark FAQ card: eyebrow, two-tone title, a numbered accordion (one
 *    answer open at a time, the first open to start; the list scrolls if it
 *    outgrows the card) and, pinned to the bottom, the email pill plus round
 *    Facebook, LinkedIn and Telegram buttons (Telegram where the reference has
 *    Discord).
 *    Right, the form card: first/last name, email, a message box that grows to
 *    fill, and the send button with a one-line note.
 *  - Below 1100px the form comes first and the FAQ card follows; under 560px
 *    the name fields and the contact row stack.
 *  - Like the reference, the form is not live yet: the button reads "Work in
 *    Progress" and is disabled. It gets a hidden honeypot field for when it is
 *    connected.
 * Contact links are only the owner's real socials (site.socials).
 */


/** Desktop panel height: the screen minus the reference page's spacing and the header. */
const PANEL_H =
  "lg:h-[max(500px,calc(100dvh-clamp(28px,5vh,64px)-34px-clamp(30px,3.1vw,60px)*1.06-clamp(14px,1vw,19px)*1.6-clamp(16px,2.6vh,34px)-clamp(16px,3vh,32px)))]";

const LABEL =
  "text-[length:clamp(11px,0.72vw,12.5px)] font-bold tracking-[0.06em] text-ink-muted uppercase max-sm:text-[12px]";
const INPUT =
  "w-full min-w-0 rounded-[12px] border border-line-strong bg-white px-[14px] py-[clamp(10px,1.4vh,13px)] text-[length:clamp(13.5px,0.95vw,15.5px)] leading-[1.45] text-ink shadow-[inset_0_1px_2px_rgba(6,12,26,0.04)] transition-[border-color,box-shadow] duration-[180ms] placeholder:text-ink-muted placeholder:opacity-70 focus:border-[#ff7a1a] focus:shadow-[0_0_0_3px_rgba(255,122,26,0.18)] focus:outline-none max-lg:text-[16px]";

export function Contact() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-8 lg:mx-[calc(min(4vw,64px)-56px)] lg:mt-[calc(clamp(28px,5vh,64px)-3rem)] lg:mb-[calc(clamp(16px,3vh,32px)-3rem)]"
    >
      <header className="flex flex-col gap-[8px] max-lg:pr-[56px]">
        <p className="text-[12px] font-semibold tracking-[0.08em] text-blueberry uppercase">FAQs / Contact</p>
        <h1
          id="contact-heading"
          className="text-[length:clamp(30px,3.1vw,60px)] leading-[1.06] font-bold tracking-[-0.028em] text-ink max-lg:leading-[1.08] max-lg:tracking-[-0.022em]"
        >
          Useful systems. Simple solutions.
        </h1>
        <p className="text-[length:clamp(14px,1vw,19px)] leading-[1.6] text-ink-muted max-lg:leading-[1.5] max-lg:font-medium sm:max-lg:max-w-[60ch]">
          Tell me which repetitive process is slowing you down, and I will reply with how it could be simplified.
        </p>
      </header>

      <Reveal className="mt-[clamp(16px,2.6vh,34px)] block">
        <div
          className={`flex flex-col gap-[18px] rounded-[28px] border border-line [background:var(--glass-bg)] px-[14px] py-[clamp(14px,2vh,24px)] [box-shadow:var(--glass-shadow)] max-sm:gap-[12px] max-sm:rounded-[22px] max-sm:p-[12px] lg:grid lg:grid-cols-[minmax(clamp(280px,calc(60vw-360px),440px),0.8fr)_minmax(0,1.35fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-[clamp(16px,1.6vw,28px)] lg:px-[clamp(14px,1.4vw,24px)] ${PANEL_H}`}
        >
          {/* ---- FAQ card (after the form below 1100px) ---- */}
          <aside
            aria-labelledby="faq-heading"
            className="relative order-last flex min-h-0 min-w-0 flex-col gap-[clamp(16px,2.4vh,28px)] overflow-hidden rounded-[20px] px-[clamp(18px,1.6vw,28px)] py-[clamp(18px,2.4vh,30px)] text-[#f6ecd9] [background:radial-gradient(70%_50%_at_0%_0%,rgba(255,122,26,0.22),transparent_60%),radial-gradient(60%_50%_at_100%_100%,rgba(227,164,127,0.18),transparent_60%),#1c0f0b] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_60px_-36px_rgba(20,10,8,0.6)] lg:order-none"
          >
            <div className="flex flex-none flex-col gap-[8px]">
              <p className="text-[12px] font-semibold tracking-[0.08em] text-[#ff7a1a] uppercase">FAQs</p>
              <h2
                id="faq-heading"
                className="text-[length:clamp(20px,min(1.7vw,3vh),30px)] leading-[1.12] font-bold tracking-[-0.022em] text-[#f6ecd9]"
              >
                Quick answers.
                <span className="block font-semibold text-[rgba(246,236,217,0.62)]">Still have one? Write below.</span>
              </h2>
            </div>

            <ul className="scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-y-auto border-t border-[rgba(255,255,255,0.1)]">
              {faqs.map((faq, i) => {
                const isOpen = open === i;
                return (
                  <li key={faq.q} className="border-b border-[rgba(255,255,255,0.1)]">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[clamp(12px,1.1vw,18px)] py-[clamp(9px,1.3vh,13px)] text-left focus-visible:rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7a1a]"
                    >
                      <span className="pt-[3px] text-[length:clamp(11px,0.72vw,12.5px)] font-bold tracking-[0.12em] text-[#ff7a1a] max-sm:text-[12px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[length:clamp(13px,min(0.95vw,1.8vh),15.5px)] leading-[1.3] font-semibold tracking-[-0.01em] transition-colors duration-200 group-hover:text-[#ff7a1a] max-sm:text-[15px]">
                        {faq.q}
                      </span>
                      <Icon
                        name="caret-down"
                        size={14}
                        weight="bold"
                        className={`transition-[rotate,color] duration-[260ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isOpen ? "rotate-180 text-[#ff7a1a]" : "text-[rgba(246,236,217,0.62)]"}`}
                      />
                    </button>
                    {isOpen && (
                      <div id={`faq-a-${i}`} className="pr-[28px] pb-[clamp(10px,1.4vh,14px)] pl-[calc(1.6em+clamp(12px,1.1vw,18px))]">
                        <p className="animate-[faq-in_.26s_cubic-bezier(0.25,0.1,0.25,1)_both] text-[length:clamp(12px,min(0.85vw,1.6vh),14px)] leading-[1.5] text-[rgba(246,236,217,0.62)] max-sm:text-[14px] motion-reduce:animate-none">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-none flex-wrap items-center justify-start gap-x-[18px] gap-y-[10px]">
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-[36px] flex-none items-center gap-[8px] rounded-full bg-[rgba(255,255,255,0.06)] px-[14px] py-[9px] text-[length:clamp(12px,0.8vw,13.5px)] leading-[1.3] font-semibold whitespace-nowrap text-[#f6ecd9] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] transition-[background-color,translate] duration-200 hover:-translate-y-[1px] hover:bg-[rgba(255,255,255,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7a1a] max-sm:text-[14px] max-[380px]:gap-[6px] max-[380px]:px-[12px] max-[380px]:text-[12px]!"
              >
                {/* The whole address always shows: the pill grows to fit it (no ellipsis). */}
                <Icon name="email" size={16} weight="bold" className="flex-none text-[#ff7a1a]" />
                <span>{site.email}</span>
              </a>
              <ul className="flex gap-[8px]">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} profile`}
                      className="grid h-[36px] w-[36px] place-items-center rounded-full bg-[rgba(255,255,255,0.06)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] transition-[background-color,translate] duration-200 hover:-translate-y-[2px] hover:bg-[rgba(255,255,255,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7a1a] max-sm:h-[44px] max-sm:w-[44px]"
                    >
                      <Icon name={social.icon as IconName} size={17} weight="fill" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ---- Form card ---- */}
          <div className="flex min-h-0 min-w-0 rounded-[20px] border border-line-strong bg-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(6,12,26,0.04),0_24px_50px_-36px_rgba(58,28,22,0.45)]">
            <form
              aria-label="Contact form"
              onSubmit={(event) => event.preventDefault()}
              className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-[clamp(10px,1.5vh,16px)] px-[clamp(18px,1.6vw,28px)] py-[clamp(18px,2.4vh,28px)]"
            >
              {/* Honeypot: hidden from people, filled only by bots. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="pointer-events-none absolute -left-[10000px] h-px w-px opacity-0"
              />
              <div className="grid grid-cols-2 gap-[clamp(10px,1vw,16px)] max-[560px]:grid-cols-1">
                <label className="flex min-w-0 flex-col gap-[6px]">
                  <span className={LABEL}>First name</span>
                  <input name="firstName" type="text" required maxLength={80} autoComplete="given-name" placeholder="Juan" className={INPUT} />
                </label>
                <label className="flex min-w-0 flex-col gap-[6px]">
                  <span className={LABEL}>Last name</span>
                  <input name="lastName" type="text" required maxLength={80} autoComplete="family-name" placeholder="Dela Cruz" className={INPUT} />
                </label>
              </div>
              <label className="flex min-w-0 flex-col gap-[6px]">
                <span className={LABEL}>Email</span>
                <input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@yourbusiness.com" className={INPUT} />
              </label>
              <label className="flex min-h-0 min-w-0 flex-1 flex-col gap-[6px]">
                <span className={LABEL}>Tell me more about your business</span>
                <textarea
                  name="message"
                  required
                  maxLength={5000}
                  placeholder="Which process takes the most time? What tools are you using now?"
                  className={`${INPUT} min-h-[160px] flex-1 resize-none lg:min-h-[96px]`}
                />
              </label>
              <div className="flex flex-none flex-wrap items-center gap-x-[16px] gap-y-[10px]">
                <button
                  type="submit"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-[9px] rounded-full bg-ink py-[12px] pr-[20px] pl-[18px] text-[length:clamp(13px,0.85vw,14.5px)] font-bold tracking-[-0.005em] text-cream opacity-40 grayscale max-sm:text-[15px]"
                >
                  <Icon name="send" size={17} weight="duotone" className="text-[#ff7a1a]" />
                  Work in Progress
                  <Icon name="arrow-up-right" size={14} weight="bold" />
                </button>
                <p className="text-[length:clamp(11.5px,0.75vw,13px)] text-ink-muted max-sm:text-[12.5px]">
                  One business day. No newsletter, no drip.
                </p>
              </div>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
