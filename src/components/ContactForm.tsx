"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { Icon } from "./Icon";

const SERVICES = [
  "AI Automation",
  "GoHighLevel Build",
  "Web Development",
  "Video Editing",
  "Not sure yet",
];

/**
 * No backend required: the form composes a pre-filled email and hands it to
 * the reader's mail client. Swap `handleSubmit` for a fetch to your endpoint
 * (Formspree, Resend, a GHL webhook) when you want submissions server-side.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const service = String(data.get("service") ?? "");
    const message = String(data.get("message") ?? "");
    const email = String(data.get("email") ?? "");

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Service: ${service}`,
      "",
      message,
    ].join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      `New project enquiry — ${service}`,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  };

  const field =
    "mt-2 block w-full rounded-2xl border border-line-strong bg-white px-4 py-3.5 text-[16px] text-ink placeholder:text-ink-muted/60 focus:border-blueberry"; // 16px: iPhones zoom into smaller inputs
  const label = "block text-[1rem] font-semibold text-ink";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Your name <span className="text-blueberry">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Juan Dela Cruz"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            Email address <span className="text-blueberry">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className={label}>
          What do you need help with?
        </label>
        <select id="service" name="service" defaultValue={SERVICES[0]} className={field}>
          {SERVICES.map((service) => (
            <option key={service}>{service}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={label}>
          Tell me about the project <span className="text-blueberry">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="What are you doing by hand today that you would rather not?"
          className={`${field} resize-y`}
        />
        <p id="message-hint" className="mt-2 text-[0.95rem] text-ink-muted">
          A couple of sentences is plenty — I will follow up with the right questions.
        </p>
      </div>

      <button
        type="submit"
        className="inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl bg-blueberry px-7 text-[1.1rem] font-semibold text-cream transition hover:-translate-y-0.5 hover:bg-blueberry-700 active:scale-[0.98] sm:w-auto"
      >
        Send message
        <Icon name="send" size={22} weight="fill" />
      </button>

      <p role="status" aria-live="polite" className="min-h-[1.5rem] text-[1rem] text-ink-muted">
        {sent
          ? "Your email app should be open with the message ready — press send there and I'll reply within one business day."
          : ""}
      </p>
    </form>
  );
}
