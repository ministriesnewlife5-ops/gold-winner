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
  receiverName: string;
  streetName: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  template: string;
  photo: string;
  submit: string;
}>;

const MAX_MOTHER_NAME = 25;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function OrderForm() {
  const router = useRouter();

  const [motherName, setMotherName] = useState("");
  const [receiverName, setReceiverName] = useState("");
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

  const cleanedPhone = useMemo(() => onlyDigits(phone), [phone]);

  function validate(): FieldErrors {
    const next: FieldErrors = {};

    const mn = motherName.trim();
    if (!mn) next.motherName = "Mother name is required.";
    if (mn.length > MAX_MOTHER_NAME) next.motherName = `Max ${MAX_MOTHER_NAME} characters.`;

    if (!photo) next.photo = "Photo is required.";

    if (!template) next.template = "Please select a template.";

    const rn = receiverName.trim();
    if (!rn) next.receiverName = "Receiver name is required.";

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
      fd.append("receiverName", receiverName.trim());
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
        <InputField
          label="Receiver Name"
          value={receiverName}
          onChange={setReceiverName}
          placeholder="Who will receive it?"
          error={errors.receiverName}
          name="receiverName"
          autoComplete="name"
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
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
