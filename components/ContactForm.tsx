'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, AlertCircle, Send, Mail } from 'lucide-react';
import { serviceOptions, budgetOptionsByCurrency, type CurrencyCode } from '@/content';
import CustomSelect from './CustomSelect';

type Status = { type: 'ok' | 'err'; message: string } | null;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>(null);
  const [pending, setPending] = useState(false);

  const [service, setService] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [budget, setBudget] = useState('');
  const [formKey, setFormKey] = useState(0);

  function handleCurrencyChange(newCurrency: CurrencyCode) {
    if (newCurrency !== currency) {
      setCurrency(newCurrency);
      setBudget('');
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    setPending(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setStatus({
          type: 'err',
          message: json.error || 'Unable to send inquiry. Please try again or email us directly.',
        });
      } else {
        setStatus({
          type: 'ok',
          message:
            json.message ||
            'Thank you. Your project inquiry has been received. Our technical team will review and reply within 24–48 hours.',
        });
        form.reset();
        setService('');
        setCurrency('INR');
        setBudget('');
        setFormKey((k) => k + 1);
      }
    } catch {
      setStatus({
        type: 'err',
        message: 'Network connection error. Please email contact@techverseinfotech.com directly.',
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form key={formKey} className="contact-form" onSubmit={onSubmit} noValidate>
      {/* Honeypot field strictly hidden */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <input type="text" name="fax" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="contact-form__row">
        <div className="form-field">
          <label htmlFor="fullName">Full Name *</label>
          <input
            id="fullName"
            name="fullName"
            required
            autoComplete="name"
            placeholder="e.g. Jane Doe"
          />
        </div>
        <div className="form-field">
          <label htmlFor="company">Company Name</label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            placeholder="e.g. Acme Corp"
          />
        </div>
      </div>

      <div className="contact-form__row">
        <div className="form-field">
          <label htmlFor="email">Business Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@company.com"
          />
        </div>
        <div className="form-field">
          <label htmlFor="websiteUrl">Website URL</label>
          <input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            autoComplete="url"
            placeholder="https://www.example.com"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="service">Service Required</label>
        <CustomSelect
          id="service"
          name="service"
          value={service}
          onChange={setService}
          options={serviceOptions}
          placeholder="Select a service practice"
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">How can we help *</label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          placeholder="Tell us about your requirements, current workflows, tech stack preferences, and what you aim to build..."
        />
      </div>

      <div className="form-field">
        <div className="form-field__label-row">
          <label htmlFor="budget">Budget Range (optional)</label>
          <div className="currency-selector" role="group" aria-label="Select currency">
            <button
              type="button"
              className={`currency-btn ${currency === 'INR' ? 'currency-btn--active' : ''}`}
              onClick={() => handleCurrencyChange('INR')}
            >
              ₹ INR
            </button>
            <button
              type="button"
              className={`currency-btn ${currency === 'USD' ? 'currency-btn--active' : ''}`}
              onClick={() => handleCurrencyChange('USD')}
            >
              $ USD
            </button>
          </div>
        </div>

        <input type="hidden" name="currency" value={currency} />

        <CustomSelect
          id="budget"
          name="budget"
          value={budget}
          onChange={setBudget}
          options={budgetOptionsByCurrency[currency]}
          placeholder="Select budget range"
        />
      </div>

      {status && (
        <div
          className={`contact-status ${status.type === 'ok' ? 'contact-status--ok' : 'contact-status--err'}`}
          role="status"
        >
          {status.type === 'ok' ? (
            <CheckCircle2 size={18} className="contact-status__icon" />
          ) : (
            <AlertCircle size={18} className="contact-status__icon" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <div className="contact-form__footer">
        <button className="btn btn--primary contact-submit-btn" type="submit" disabled={pending}>
          <span>{pending ? 'Sending Inquiry…' : 'Send Project Inquiry'}</span>
          <Send size={15} />
        </button>
        <a className="btn btn--secondary contact-email-btn" href="mailto:contact@techverseinfotech.com">
          <Mail size={15} />
          <span>Or email us directly</span>
        </a>
      </div>
    </form>
  );
}
