import type { Core } from '@strapi/strapi';
import { z } from 'zod';

export const sendEmailSchema = z.object({
  to: z.string().describe('Recipient email address'),
  subject: z.string().describe('Email subject line'),
  html: z.string().describe('Email body as HTML'),
  text: z
    .string()
    .optional()
    .describe('Plain text fallback (optional, derived from html if omitted)'),
  cc: z.string().optional().describe('CC email address (optional)'),
  bcc: z.string().optional().describe('BCC email address (optional)'),
  replyTo: z.string().optional().describe('Reply-to email address (optional)'),
});

export const sendEmailDescription =
  'Send an email using the configured email provider. Compose the email content as HTML. IMPORTANT: Before calling this tool, you MUST confirm the recipient email address with the user by repeating it back and asking for explicit approval. Always use the exact recipient email address the user specifies — never substitute it with a default or admin email. Also confirm the subject and body before sending.';

export type SendEmailParams = z.infer<typeof sendEmailSchema>;

export interface SendEmailResult {
  success: boolean;
  message: string;
  to: string;
  subject: string;
}

export async function sendEmail(
  strapi: Core.Strapi,
  params: SendEmailParams
): Promise<SendEmailResult> {
  const emailPlugin = strapi.plugin('email');
  if (!emailPlugin) {
    return {
      success: false,
      message:
        'The email plugin is not installed or enabled. Install @strapi/plugin-email and configure an email provider (e.g. strapi-provider-email-resend).',
      to: params.to,
      subject: params.subject,
    };
  }

  try {
    await emailPlugin.service('email').send({
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      cc: params.cc,
      bcc: params.bcc,
      replyTo: params.replyTo,
    });
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : String(error);

    // Detect common Resend domain verification error
    const isDomainError =
      /not allowed|verify|domain|can only send/i.test(detail);
    const hint = isDomainError
      ? ' This usually means the sending domain is not verified in Resend. In test mode, emails can only be delivered to the account owner\'s address. Verify your domain at https://resend.com/domains to send to any recipient.'
      : '';

    return {
      success: false,
      message: `Failed to send email to ${params.to}: ${detail}.${hint}`,
      to: params.to,
      subject: params.subject,
    };
  }

  return {
    success: true,
    message: `Email successfully sent to ${params.to} with subject "${params.subject}".`,
    to: params.to,
    subject: params.subject,
  };
}
