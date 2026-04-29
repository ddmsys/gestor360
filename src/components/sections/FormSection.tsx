"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import type { FormContent, FormField } from "@/types/cms";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { fadeInUp } from "@/lib/animations";

interface Props {
  content: FormContent;
  preCapitulo?: number;
}

// Gera schema Zod dinamicamente a partir dos campos
function buildSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    let rule: z.ZodTypeAny = z.string();
    if (field.type === "email") {
      rule = z.string().email("E-mail inválido");
    } else if (field.type === "tel") {
      rule = z.string().min(10, "Telefone inválido");
    } else if (field.type === "checkbox") {
      rule = z.boolean();
    }
    if (field.required) {
      if (rule instanceof z.ZodString) {
        rule = rule.min(1, `${field.label} é obrigatório`);
      }
    } else {
      rule = rule.optional();
    }
    shape[field.field_key] = rule;
  }
  return z.object(shape);
}

// Componente de campo individual
function FieldRenderer({
  field,
  error,
  register,
}: {
  field: FormField;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: string;
}) {
  if (field.type === "textarea") {
    return (
      <Textarea
        {...register(field.field_key)}
        label={field.label}
        placeholder={field.placeholder}
        required={field.required}
        error={error}
      />
    );
  }
  if (field.type === "select" && field.options) {
    return (
      <Select
        {...register(field.field_key)}
        label={field.label}
        required={field.required}
        error={error}
        placeholder={field.placeholder ?? "Selecione..."}
        options={field.options.map((o) => ({ value: o, label: o }))}
      />
    );
  }
  if (field.type === "checkbox") {
    return (
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          {...register(field.field_key)}
          type="checkbox"
          className="mt-0.5 w-4 h-4 rounded border-[var(--color-border)] text-brand-blue focus:ring-brand-blue"
        />
        <span className="text-sm text-[var(--color-text-body)]">
          {field.label}
        </span>
        {error && <span className="text-xs text-error">{error}</span>}
      </label>
    );
  }
  return (
    <Input
      {...register(field.field_key)}
      type={field.type}
      label={field.label}
      placeholder={field.placeholder}
      required={field.required}
      error={error}
    />
  );
}

const BG_STYLES: Record<string, string> = {
  white: "bg-white",
  canvas: "bg-[var(--color-bg-canvas)]",
  blue: "bg-brand-blue",
};

const TEXT_ON_BG: Record<string, { title: string; sub: string }> = {
  white: {
    title: "text-[var(--color-text-title)]",
    sub: "text-[var(--color-text-body)]",
  },
  canvas: {
    title: "text-[var(--color-text-title)]",
    sub: "text-[var(--color-text-body)]",
  },
  blue: { title: "text-white", sub: "text-white/80" },
};

export function FormSection({ content, preCapitulo }: Props) {
  const {
    title,
    subtitle,
    badge,
    fields = [],
    submit_label = "Enviar",
    success_title = "Recebemos seu cadastro!",
    success_message = "Verifique seu e-mail — as ferramentas gratuitas estão a caminho.",
    bg = "canvas",
    layout = "centered",
  } = content;

  const [submitted, setSubmitted] = useState(false);
  const schema = buildSchema(fields);
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const bgClass = BG_STYLES[bg] ?? BG_STYLES.canvas;
  const textClass = TEXT_ON_BG[bg] ?? TEXT_ON_BG.canvas;

  async function onSubmit(values: FormValues) {
    const payload: Record<string, unknown> = { ...values };
    if (preCapitulo) {
      payload.capitulo_origem = preCapitulo;
    }
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSubmitted(true);
  }

  return (
    <section className={`${bgClass} py-16 sm:py-20`}>
      <div
        className={`mx-auto max-w-[var(--container-xl)] px-4 sm:px-6 ${layout === "centered" ? "flex flex-col items-center" : ""}`}
      >
        {/* Cabeçalho */}
        {(badge || title || subtitle) && (
          <motion.div
            className={`flex flex-col gap-3 mb-10 ${layout === "centered" ? "text-center items-center" : ""}`}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {badge && <Badge variant="blue">{badge}</Badge>}
            {title && (
              <h2
                className={`font-display font-black text-heading leading-tight tracking-tight ${textClass.title} max-w-2xl`}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={`text-body-lg ${textClass.sub} max-w-xl leading-relaxed`}
              >
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Formulário ou sucesso */}
        <motion.div
          className={`w-full ${layout === "centered" ? "max-w-lg" : ""}`}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {submitted ? (
            <div className="bg-white rounded-[var(--radius-xl)] p-8 text-center shadow-[var(--shadow-md)] border border-[var(--color-border)]">
              <div
                className="w-14 h-14 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4"
                aria-hidden="true"
              >
                <svg
                  className="w-7 h-7 text-brand-blue"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="font-display font-black text-title text-[var(--color-text-title)] mb-2">
                {success_title}
              </h3>
              <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
                {success_message}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-[var(--radius-xl)] p-6 sm:p-8 shadow-[var(--shadow-sm)] border border-[var(--color-border)] flex flex-col gap-4"
              noValidate
            >
              {fields.map((field) => (
                <FieldRenderer
                  key={field.field_key}
                  field={field}
                  register={register}
                  error={errors[field.field_key]?.message as string | undefined}
                />
              ))}
              <Button type="submit" loading={isSubmitting} className="mt-2">
                {submit_label}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
