import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY!;
const fromEmail = process.env.RESEND_FROM_EMAIL || "D SAJAWAT <onboarding@resend.dev>";
const adminEmail = process.env.RESEND_ADMIN_EMAIL || "dsajawat@gmail.com";

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY");
}

export const resend = new Resend(resendApiKey);

interface BaseEmailProps {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: BaseEmailProps) {
  return resend.emails.send({
    from: fromEmail,
    to,
    subject,
    html,
  });
}

export async function sendAdminNotification(inquiry: {
  name: string;
  phone: string;
  eventType?: string;
  message?: string;
  source: string;
  pageUrl?: string;
  createdAt: string;
}) {
  const sourceLabels: Record<string, string> = {
    contact: "Contact Form",
    quote: "Quote Request",
    hero_cta: "Hero CTA",
    collection_card: "Collection Card",
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">D SAJAWAT</h1>
        <p style="color: #fef3c7; margin: 8px 0 0; font-size: 14px;">New Inquiry Received</p>
      </div>
      
      <div style="background: #fafafa; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px; padding: 30px;">
        <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="margin: 0 0 16px; font-size: 18px; color: #1f2937; display: flex; align-items: center; gap: 8px;">
            <span style="background: #fef3c7; color: #b45309; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${sourceLabels[inquiry.source] || inquiry.source}</span>
          </h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #6b7280; width: 120px;">Name</td>
              <td style="padding: 8px 0; color: #1f2937;">${inquiry.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Phone</td>
              <td style="padding: 8px 0; color: #1f2937;"><a href="tel:${inquiry.phone}" style="color: #f59e0b; text-decoration: none;">${inquiry.phone}</a></td>
            </tr>
            ${inquiry.eventType ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Event Type</td>
              <td style="padding: 8px 0; color: #1f2937;">${inquiry.eventType}</td>
            </tr>
            ` : ""}
            ${inquiry.message ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #6b7280; vertical-align: top;">Message</td>
              <td style="padding: 8px 0; color: #1f2937;">${inquiry.message.replace(/\n/g, "<br>")}</td>
            </tr>
            ` : ""}
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Source</td>
              <td style="padding: 8px 0; color: #1f2937;">${inquiry.pageUrl || "Direct"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Received</td>
              <td style="padding: 8px 0; color: #1f2937;">${new Date(inquiry.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="https://wa.me/919888919983?text=${encodeURIComponent(`New inquiry from ${inquiry.name} (${inquiry.phone}) - ${sourceLabels[inquiry.source] || inquiry.source}`)}" 
             style="display: inline-block; background: #22c55e; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Reply on WhatsApp
          </a>
        </div>

        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px;">
          D SAJAWAT • Ludhiana, Punjab • Auto-generated notification
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `🔔 New ${sourceLabels[inquiry.source] || "Inquiry"}: ${inquiry.name} - ${inquiry.phone}`,
    html,
  });
}

export async function sendCustomerConfirmation(inquiry: {
  name: string;
  phone: string;
  source: string;
  createdAt: string;
}) {
  const sourceLabels: Record<string, string> = {
    contact: "inquiry",
    quote: "quote request",
    hero_cta: "inquiry",
    collection_card: "collection inquiry",
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">D SAJAWAT</h1>
        <p style="color: #fef3c7; margin: 8px 0 0; font-size: 14px;">Where Elegance Meets Celebration</p>
      </div>
      
      <div style="background: #fafafa; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px; padding: 30px;">
        <p style="font-size: 16px; color: #1f2937; margin-bottom: 16px;">Dear <strong>${inquiry.name}</strong>,</p>
        
        <p style="color: #4b5563; margin-bottom: 20px;">
          Thank you for your <strong>${sourceLabels[inquiry.source] || "inquiry"}</strong>! We've received your details and our team will get back to you within <strong>24 hours</strong>.
        </p>

        <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 12px; font-size: 14px; color: #6b7280; font-weight: 600;">Your Submission Summary</h3>
          <p style="margin: 4px 0; color: #1f2937;"><strong>Phone:</strong> ${inquiry.phone}</p>
          <p style="margin: 4px 0; color: #1f2937;"><strong>Submitted:</strong> ${new Date(inquiry.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
        </div>

        <p style="color: #4b5563; margin-bottom: 8px;">For immediate assistance, you can also reach us directly:</p>
        
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://wa.me/919888919983" style="display: inline-flex; align-items: center; gap: 8px; background: #22c55e; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat on WhatsApp
          </a>
        </div>

        <p style="color: #4b5563; font-size: 14px;">📞 <strong>Call:</strong> +91 98889 19983 / +91 73555 55649</p>
        <p style="color: #4b5563; font-size: 14px;">📍 <strong>Visit:</strong> Ludhiana, Punjab, India</p>
        <p style="color: #4b5563; font-size: 14px;">📷 <strong>Instagram:</strong> <a href="https://www.instagram.com/d_sajawat/" style="color: #f59e0b;">@d_sajawat</a></p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

        <p style="text-align: center; color: #9ca3af; font-size: 12px;">
          D SAJAWAT • Premium Wedding & Event Fabrics • Pan India Delivery
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: inquiry.phone.includes("@") ? inquiry.phone : adminEmail, // Fallback if no email
    subject: `✅ We received your ${sourceLabels[inquiry.source] || "inquiry"} - D SAJAWAT`,
    html,
  });
}

export async function sendStatusUpdateEmail(inquiry: {
  name: string;
  phone: string;
  email?: string;
  status: string;
  notes?: string;
}) {
  const statusLabels: Record<string, { label: string; color: string }> = {
    contacted: { label: "Contacted", color: "#3b82f6" },
    quoted: { label: "Quoted", color: "#8b5cf6" },
    converted: { label: "Converted", color: "#22c55e" },
    spam: { label: "Marked as Spam", color: "#ef4444" },
    archived: { label: "Archived", color: "#6b7280" },
  };

  const { label, color } = statusLabels[inquiry.status] || { label: inquiry.status, color: "#6b7280" };

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">D SAJAWAT</h1>
        <p style="color: #fef3c7; margin: 8px 0 0; font-size: 14px;">Update on Your Inquiry</p>
      </div>
      <div style="background: #fafafa; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px; padding: 30px;">
        <p style="font-size: 16px; color: #1f2937;">Dear <strong>${inquiry.name}</strong>,</p>
        <p style="color: #4b5563;">Your inquiry status has been updated to:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="background: ${color}; color: white; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 16px;">${label}</span>
        </div>
        ${inquiry.notes ? `<p style="color: #4b5563; background: white; padding: 16px; border-radius: 8px; border-left: 4px solid ${color};">${inquiry.notes}</p>` : ""}
        <p style="color: #4b5563; margin-top: 24px;">Questions? <a href="https://wa.me/919888919983" style="color: #f59e0b;">Chat on WhatsApp</a></p>
      </div>
    </body>
    </html>
  `;

  const toEmail = inquiry.email || adminEmail;
  return sendEmail({
    to: toEmail,
    subject: `📋 Update: Your D SAJAWAT inquiry is now "${label}"`,
    html,
  });
}

export async function sendSwatchConfirmation(inquiry: {
  name: string;
  phone: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">D SAJAWAT</h1>
        <p style="color: #fef3c7; margin: 8px 0 0; font-size: 14px;">Your Swatch Kit Has Shipped! 📦</p>
      </div>
      <div style="background: #fafafa; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px; padding: 30px;">
        <p style="font-size: 16px; color: #1f2937;">Dear <strong>${inquiry.name}</strong>,</p>
        <p style="color: #4b5563;">Great news! Your fabric swatch kit is on the way.</p>
        ${inquiry.trackingNumber ? `
        <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 8px; font-weight: 600; color: #6b7280;">Tracking Number</p>
          <p style="margin: 0; font-family: monospace; font-size: 16px; color: #1f2937;">${inquiry.trackingNumber}</p>
        </div>
        ` : ""}
        ${inquiry.estimatedDelivery ? `
        <p style="color: #4b5563;">Estimated delivery: <strong>${inquiry.estimatedDelivery}</strong></p>
        ` : ""}
        <p style="color: #4b5563; margin-top: 24px;">Questions? <a href="https://wa.me/919888919983" style="color: #f59e0b;">Chat on WhatsApp</a></p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail, // Send to admin for now (no customer email captured in swatch flow)
    subject: `📦 Swatch Kit Shipped: ${inquiry.name} - ${inquiry.trackingNumber || "Pending"}`,
    html,
  });
}