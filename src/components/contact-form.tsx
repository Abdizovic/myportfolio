"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { buttonClass } from "@/components/ui";
import {
  initialContactState,
  sendContactMessage,
} from "@/app/actions/contact";

const field =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted/70 focus:border-accent focus:outline-none";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={buttonClass({ className: "w-full sm:w-auto" })}
    >
      {pending ? "Sending…" : "Send message"}
      {pending ? null : <ArrowRightIcon className="size-4" />}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(sendContactMessage, initialContactState);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-xl border border-accent/40 bg-accent-soft p-8"
      >
        <span className="grid size-11 place-items-center rounded-full bg-accent text-accent-contrast">
          <CheckIcon className="size-6" />
        </span>
        <div>
          <h3 className="text-lg font-semibold">Message sent</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{state.message}</p>
        </div>
      </div>
    );
  }

  const errors = state.fieldErrors ?? {};
  const values = state.values;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company (leave this empty)</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={values?.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            placeholder="Jane Wanjiru"
            className={`mt-2 ${field} ${errors.name ? "border-red-500/70" : ""}`}
          />
          {errors.name ? (
            <p id="name-error" className="mt-1.5 text-xs text-red-500">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={values?.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="jane@company.co.ke"
            className={`mt-2 ${field} ${errors.email ? "border-red-500/70" : ""}`}
          />
          {errors.email ? (
            <p id="email-error" className="mt-1.5 text-xs text-red-500">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          defaultValue={values?.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="What are you building, and what does it need to do? Rough timeline and budget are helpful too."
          className={`mt-2 resize-y ${field} ${errors.message ? "border-red-500/70" : ""}`}
        />
        {errors.message ? (
          <p id="message-error" className="mt-1.5 text-xs text-red-500">
            {errors.message}
          </p>
        ) : null}
      </div>

      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500"
        >
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        <p className="text-xs text-muted">Typical reply time: under 24 hours.</p>
      </div>
    </form>
  );
}
