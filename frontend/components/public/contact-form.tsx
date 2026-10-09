"use client";

import { FormEvent, useState } from "react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { validateEmail } from "@/lib/validation";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export function ContactForm({ interest }: { interest?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(interest ? `I'm interested in ${interest}.` : "");
  const [status, setStatus] = useState("");
  const [statusIsError, setStatusIsError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const nameError = name.trim().length < 2 ? "Enter at least two characters." : "";
  const emailError = !validateEmail(email) ? "Enter a valid email address." : "";
  const messageError = message.trim().length < 10 ? "Write at least ten characters." : "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setStatus("");
    if (nameError || emailError || messageError) {
      setStatusIsError(true);
      setStatus("Please correct the highlighted fields and try again.");
      return;
    }
    if (!contactEmail) {
      setStatusIsError(true);
      setStatus("Message delivery is not set up yet. Please check back soon; your message has not been sent.");
      return;
    }
    const subject = encodeURIComponent(`ADAPT enquiry from ${name.trim()}`);
    const body = encodeURIComponent(`${message.trim()}\n\nFrom: ${name.trim()}\nReply to: ${email.trim()}`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    setStatusIsError(false);
    setStatus("Your email app should open with this message ready to send. Please send it there to reach ADAPT.");
  }

  return <form className="public-contact-form" onSubmit={handleSubmit} noValidate data-scroll="card">
    <div className="public-contact-form__row">
      <label>Name<input value={name} onChange={(event) => { setName(event.target.value); setStatus(""); }} autoComplete="name" placeholder="Your name" required minLength={2} aria-invalid={submitted && !!nameError} aria-describedby={submitted && nameError ? "contact-name-error" : undefined} />{submitted && nameError ? <span id="contact-name-error" className="public-contact-form__field-error">{nameError}</span> : null}</label>
      <label>Email<input value={email} onChange={(event) => { setEmail(event.target.value); setStatus(""); }} autoComplete="email" type="email" placeholder="you@example.com" required aria-invalid={submitted && !!emailError} aria-describedby={submitted && emailError ? "contact-email-error" : undefined} />{submitted && emailError ? <span id="contact-email-error" className="public-contact-form__field-error">{emailError}</span> : null}</label>
    </div>
    <label>How can we help?<textarea value={message} onChange={(event) => { setMessage(event.target.value); setStatus(""); }} placeholder="Tell us what you’re looking for..." rows={6} required minLength={10} aria-invalid={submitted && !!messageError} aria-describedby={submitted && messageError ? "contact-message-error" : undefined} />{submitted && messageError ? <span id="contact-message-error" className="public-contact-form__field-error">{messageError}</span> : null}</label>
    <div className="public-contact-form__bottom"><p>We&apos;ll open your email app so you can send your message.</p><InteractiveHoverButton type="submit" text="Prepare message" className="public-contact-form__submit" /></div>
    {status ? <p role={statusIsError ? "alert" : "status"} className="public-contact-form__status" data-error={statusIsError}>{status}</p> : null}
  </form>;
}
