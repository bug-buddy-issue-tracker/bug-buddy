"use server";

import { ContactEmail } from "@/emails/contact.email";
import { transporter } from "@/lib/mail-transporter";
import { render } from "@react-email/components";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email("Invalid email address"),
  message: z.string().min(1, "Message is required").max(5000),
});

export async function sendContactEmail(formData: {
  name: string;
  email: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const parsed = contactSchema.safeParse(formData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { name, email, message } = parsed.data;

  try {
    const html = await render(ContactEmail({ name, email, message }));

    await transporter.sendMail({
      from: "no-reply@notifications.bugbuddy.dev",
      to: "contact@matthewjenkinson.dev",
      replyTo: email,
      subject: `Bug Buddy contact: ${name}`,
      html,
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Failed to send message. Please try again.",
    };
  }
}
