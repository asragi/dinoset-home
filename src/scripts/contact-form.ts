import { site } from "../config/site";

type Field = HTMLInputElement | HTMLTextAreaElement;

const form = document.querySelector<HTMLFormElement>("#contact-form");

function messageFor(field: Field): string {
  const { validity } = field;
  if (validity.valueMissing || !field.value.trim()) return "入力してください。";
  if (validity.typeMismatch) return "メールアドレスの形式で入力してください。";
  if (validity.tooLong) return `${field.maxLength}文字以内で入力してください。`;
  return field.validationMessage;
}

function validate(field: Field): boolean {
  field.setCustomValidity("");
  if (field.required && !field.value.trim()) {
    field.setCustomValidity("入力してください。");
  }
  const valid = field.checkValidity();
  field.setAttribute("aria-invalid", String(!valid));
  const error = document.getElementById(`${field.id}-error`);
  if (error) error.textContent = valid ? "" : messageFor(field);
  return valid;
}

if (form) {
  const fields = Array.from(
    form.querySelectorAll<Field>("input[required], textarea[required]"),
  );
  const trap = form.querySelector<HTMLInputElement>('[name="website"]');
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const status = form.querySelector<HTMLElement>(".contact-form__status");
  const submitLabel = submit?.textContent?.trim() ?? "送信する";
  let sending = false;

  // Use the Constraint Validation API, but render our own messages.
  form.noValidate = true;
  if (submit) submit.disabled = false;

  for (const field of fields) {
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validate(field);
    });
    field.addEventListener("blur", () => {
      if (field.value) validate(field);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;

    const invalid = fields.filter((field) => !validate(field));
    if (invalid.length > 0) {
      invalid[0]?.focus();
      return;
    }
    // Honeypot: bots fill every field. Pretend nothing happened.
    if (trap?.value) return;

    const data = new FormData(form);
    sending = true;
    form.setAttribute("aria-busy", "true");
    if (status) status.textContent = "";
    if (submit) {
      submit.disabled = true;
      submit.textContent = "送信中…";
    }

    try {
      const { send } = await import("@emailjs/browser");
      await send(
        site.emailjs.serviceId,
        site.emailjs.templateId,
        {
          from_name: String(data.get("from_name") ?? "").trim(), // テンプレート側の変数名なので変えない
          email: String(data.get("email") ?? "").trim(),
          message: String(data.get("message") ?? "").trim(),
        },
        { publicKey: site.emailjs.publicKey },
      );
      const done = document.createElement("p");
      done.className = "contact-success";
      done.setAttribute("role", "status");
      done.tabIndex = -1;
      done.textContent =
        "送信しました。お問い合わせありがとうございます。内容を確認のうえ、ご連絡します。";
      form.replaceWith(done);
      done.focus();
    } catch {
      if (status) {
        status.textContent =
          "送信できませんでした。時間をおいて、もう一度お試しください。";
      }
      if (submit) {
        submit.disabled = false;
        submit.textContent = submitLabel;
      }
      form.removeAttribute("aria-busy");
      sending = false;
    }
  });
}
