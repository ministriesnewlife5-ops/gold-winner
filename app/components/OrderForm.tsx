"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { FileUpload } from "./FileUpload";
import { InputField } from "./InputField";
import { Loader } from "./Loader";
import { TemplateSelector } from "./TemplateSelector";

type FieldErrors = Partial<{
  motherName: string;
  streetName: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  template: string;
  photo: string;
  termsAccepted: string;
  submit: string;
}>;

const MAX_MOTHER_NAME = 25;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function OrderForm() {
  const router = useRouter();

  const [motherName, setMotherName] = useState("");
  const [streetName, setStreetName] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [phone, setPhone] = useState("");
  const [template, setTemplate] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const cleanedPhone = useMemo(() => onlyDigits(phone), [phone]);

  function validate(): FieldErrors {
    const next: FieldErrors = {};

    const mn = motherName.trim();
    if (!mn) next.motherName = "Mother name is required.";
    if (mn.length > MAX_MOTHER_NAME) next.motherName = `Max ${MAX_MOTHER_NAME} characters.`;

    if (!photo) next.photo = "Photo is required.";

    if (!template) next.template = "Please select a template.";

    const sn = streetName.trim();
    if (!sn) next.streetName = "Street name is required.";

    const ar = area.trim();
    if (!ar) next.area = "Area is required.";

    const ct = city.trim();
    if (!ct) next.city = "City is required.";

    const st = state.trim();
    if (!st) next.state = "State is required.";

    const pc = pinCode.trim();
    if (!pc) next.pinCode = "Pin code is required.";
    if (pc && pc.length !== 6) next.pinCode = "Pin code must be exactly 6 digits.";

    if (!cleanedPhone) next.phone = "Mobile number is required.";
    if (cleanedPhone && cleanedPhone.length !== 10) next.phone = "Mobile number must be exactly 10 digits.";

    if (!termsAccepted) next.termsAccepted = "You must accept the Terms and Conditions.";

    return next;
  }

  async function handleSubmit() {
    if (submitting) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setErrors({});

    try {
      const fd = new FormData();
      fd.append("motherName", motherName.trim());
      fd.append("template", template);
      fd.append(
        "address",
        [streetName.trim(), area.trim(), city.trim(), state.trim(), pinCode.trim()]
          .filter(Boolean)
          .join(", ")
      );
      fd.append("phone", cleanedPhone);
      if (photo) fd.append("photo", photo, photo.name);

      const res = await fetch("/api/submit", {
        method: "POST",
        body: fd,
      });

      const json = (await res.json()) as { orderId?: string; error?: string };
      if (!res.ok || !json.orderId) {
        setErrors({ submit: json.error || "Something went wrong. Please try again." });
        return;
      }

      router.push(`/success?orderId=${encodeURIComponent(json.orderId)}`);
    } catch {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="flex flex-col gap-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Mother Name"
          value={motherName}
          onChange={setMotherName}
          placeholder="e.g., Asha"
          maxLength={MAX_MOTHER_NAME}
          error={errors.motherName}
          name="motherName"
          autoComplete="off"
        />
      </div>

      <FileUpload
        file={photo}
        onChange={(f) => {
          setPhoto(f);
          if (!f) {
            setErrors((prev) => ({ ...prev, photo: "Photo is required." }));
          } else {
            setErrors((prev) => {
              const next = { ...prev };
              delete next.photo;
              return next;
            });
          }
        }}
        error={errors.photo}
      />

      <TemplateSelector value={template} onChange={setTemplate} error={errors.template} />

      <div className="mt-4">
        <h3 className="text-base font-semibold text-[color:var(--surface-text)] mb-4">Communication Address</h3>
        <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Street Name"
          value={streetName}
          onChange={setStreetName}
          placeholder="Street name"
          error={errors.streetName}
          name="streetName"
          autoComplete="street-address"
        />
        <InputField
          label="Area"
          value={area}
          onChange={setArea}
          placeholder="Area"
          error={errors.area}
          name="area"
          autoComplete="address-line2"
        />
        <InputField
          label="City"
          value={city}
          onChange={setCity}
          placeholder="City"
          error={errors.city}
          name="city"
          autoComplete="address-level2"
        />
        <InputField
          label="State"
          value={state}
          onChange={setState}
          placeholder="State"
          error={errors.state}
          name="state"
          autoComplete="address-level1"
        />
        <InputField
          label="Pin Code"
          value={pinCode}
          onChange={(v) => setPinCode(onlyDigits(v).slice(0, 6))}
          placeholder="Pin code"
          error={errors.pinCode}
          inputMode="numeric"
          name="pinCode"
          autoComplete="postal-code"
        />
        </div>
      </div>

      <InputField
        label="Mobile Number"
        value={phone}
        onChange={(v) => setPhone(onlyDigits(v).slice(0, 10))}
        placeholder="10-digit number"
        error={errors.phone}
        inputMode="numeric"
        name="phone"
        autoComplete="tel"
      />

      {errors.submit ? (
        <div className="rounded-2xl border border-[color:var(--danger-border)] bg-[color:var(--danger-bg)] p-4 text-sm text-[color:var(--danger-text)]">
          {errors.submit}
        </div>
      ) : null}

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="termsCheckbox"
          checked={termsAccepted}
          onChange={(e) => {
            setTermsAccepted(e.target.checked);
            if (e.target.checked) {
              setErrors((prev) => {
                const next = { ...prev };
                delete next.termsAccepted;
                return next;
              });
            }
          }}
          className="mt-0.5 h-4 w-4 rounded border border-[color:var(--line-soft)] accent-[color:var(--gold)] cursor-pointer"
        />
        <label htmlFor="termsCheckbox" className="text-xs text-[color:var(--surface-text)] cursor-pointer select-none">
          I accept the{" "}
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="underline hover:text-[color:var(--gold)] transition-colors"
          >
            Terms and Conditions
          </button>
        </label>
      </div>
      {errors.termsAccepted ? <div className="text-xs text-[color:var(--danger-text)]">{errors.termsAccepted}</div> : null}

      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[color:var(--card-border)] bg-white p-6 shadow-[var(--shadow)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[color:var(--surface-text)]">
                Terms and Conditions
              </h3>
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="rounded-full p-2 text-[color:var(--surface-text-faint)] hover:bg-[color:var(--line-soft)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <ol className="flex flex-col gap-3 text-sm text-[color:var(--surface-text)] list-decimal list-inside">
              <li>Only one entry per participant will be considered.</li>
              <li>Submitted content must not be offensive, abusive, or inappropriate.</li>
              <li>We deserve the right to reject or remove any entry that does not meet guidelines.</li>
              <li>Participants grant us the right to use submitted photos and messages for marketing, promotional, and communication purposes.</li>
              <li>We reserve the right to modify, suspend, or cancel the contest at any time.</li>
            </ol>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTerms(false);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.termsAccepted;
                    return next;
                  });
                }}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--gold)] px-5 text-sm font-semibold text-[color:var(--text-on-gold)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                I Agree
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !termsAccepted}
          className="inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--gold)] px-6 text-sm font-semibold text-[color:var(--text-on-gold)] shadow-[var(--button-shadow)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 active:translate-y-0"
        >
          {submitting ? <Loader label="Submitting…" /> : "Submit"}
        </button>
        <div className="text-xs text-[color:var(--surface-text-faint)]">
          You’ll get an order ID immediately after submission.
        </div>
      </div>
    </motion.div>
  );
}
