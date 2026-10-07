import { createClient } from "@supabase/supabase-js";

interface Bindings {
  SUPABASE_URL: string;
  SUPABASE_SECRET_KEY: string;
  BREVO_API_KEY: string;
  CONTACT_FROM_EMAIL: string;
  CONTACT_FROM_NAME: string;
  CONTACT_TO_EMAIL: string;
  ASSETS?: {
    fetch(request: Request): Promise<Response>;
  };
}

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  service?: unknown;
  message?: unknown;
  hp_field?: unknown;
}

const SERVICE_NAMES: Record<string, string> = {
  "menu-development": "Menu Development",
  consulting: "F&B Consulting",
  mentoring: "Culinary Mentoring",
  operations: "Kitchen Operations",
  "private-dining": "Private Dining",
  other: "Other",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "no-store",
    },
  });
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function singleLine(value: unknown): string {
  return clean(value).replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hasRequiredEnv(env: Bindings): boolean {
  return Boolean(
    env.SUPABASE_URL &&
      env.SUPABASE_SECRET_KEY &&
      env.BREVO_API_KEY &&
      env.CONTACT_FROM_EMAIL &&
      env.CONTACT_FROM_NAME &&
      env.CONTACT_TO_EMAIL,
  );
}

async function sendBrevoEmail(
  env: Bindings,
  data: {
    enquiryId: string;
    name: string;
    email: string;
    company: string;
    serviceLabel: string;
    message: string;
  },
): Promise<boolean> {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: env.CONTACT_FROM_NAME,
        email: env.CONTACT_FROM_EMAIL,
      },
      to: [{ email: env.CONTACT_TO_EMAIL }],
      replyTo: {
        email: data.email,
        name: data.name,
      },
      subject: `New ${data.serviceLabel} enquiry — ${data.name}`,
      textContent: [
        "PANBRAMSYAH — New Portfolio Enquiry",
        "",
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Company / Restaurant: ${data.company || "Not provided"}`,
        `Service: ${data.serviceLabel}`,
        "",
        "Message:",
        data.message,
        "",
        `Enquiry ID: ${data.enquiryId}`,
        "Sent from thechefscript.site",
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    console.error("Brevo email error:", {
      status: response.status,
      body: await response.text(),
    });

    return false;
  }

  const result = (await response.json().catch(() => null)) as
    | { messageId?: string }
    | null;

  console.log(
    "Contact email accepted by Brevo:",
    result?.messageId ?? "accepted",
  );

  return true;
}


async function sendVisitorAcknowledgement(
  env: Bindings,
  data: {
    name: string;
    email: string;
    serviceLabel: string;
  },
): Promise<boolean> {
  const safeName = escapeHtml(data.name);
  const safeService = escapeHtml(data.serviceLabel);

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: env.CONTACT_FROM_NAME,
        email: env.CONTACT_FROM_EMAIL,
      },
      to: [
        {
          email: data.email,
          name: data.name,
        },
      ],
      replyTo: {
        email: env.CONTACT_TO_EMAIL,
        name: env.CONTACT_FROM_NAME,
      },
      subject: "We received your enquiry — PANBRAMSYAH",

      textContent: [
        `Hi ${data.name},`,
        "",
        "Thank you for reaching out.",
        "",
        `Your ${data.serviceLabel} enquiry has been received successfully. I’ll review the details you provided and get back to you as soon as possible.`,
        "",
        "Best regards,",
        "PANBRAMSYAH",
        "Professional Chef · Private Chef · Culinary Consultant",
        "thechefscript.site",
      ].join("\n"),

      htmlContent: `
        <div style="margin:0;padding:0;background:#f4f1ea;">
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="width:100%;background:#f4f1ea;"
          >
            <tr>
              <td align="center" style="padding:32px 16px;">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    width:100%;
                    max-width:680px;
                    background:#ffffff;
                    border-collapse:collapse;
                  "
                >
                  <tr>
                    <td style="padding:48px 48px 18px;">
                      <p
                        style="
                          margin:0;
                          font-family:Arial,Helvetica,sans-serif;
                          font-size:13px;
                          line-height:1.4;
                          font-weight:700;
                          letter-spacing:2.4px;
                          text-transform:uppercase;
                          color:#8b1e2d;
                        "
                      >
                        PANBRAMSYAH
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:20px 48px 0;">
                      <h1
                        style="
                          margin:0;
                          font-family:Georgia,'Times New Roman',serif;
                          font-size:42px;
                          line-height:1.12;
                          font-weight:400;
                          color:#171515;
                        "
                      >
                        Thank you for reaching out.
                      </h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:36px 48px 0;">
                      <p
                        style="
                          margin:0 0 26px;
                          font-family:Arial,Helvetica,sans-serif;
                          font-size:16px;
                          line-height:1.75;
                          color:#3a3735;
                        "
                      >
                        Hi ${safeName},
                      </p>

                      <p
                        style="
                          margin:0;
                          font-family:Arial,Helvetica,sans-serif;
                          font-size:16px;
                          line-height:1.85;
                          color:#3a3735;
                        "
                      >
                        Your
                        <strong style="color:#171515;">${safeService}</strong>
                        enquiry has been received successfully. I’ll review the
                        details you provided and get back to you as soon as
                        possible.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:42px 48px 0;">
                      <div style="border-top:1px solid #ded8cf;"></div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:34px 48px 48px;">
                      <p
                        style="
                          margin:0 0 8px;
                          font-family:Arial,Helvetica,sans-serif;
                          font-size:15px;
                          line-height:1.65;
                          color:#171515;
                        "
                      >
                        Best regards,
                      </p>

                      <p
                        style="
                          margin:0 0 4px;
                          font-family:Arial,Helvetica,sans-serif;
                          font-size:17px;
                          line-height:1.5;
                          font-weight:700;
                          color:#171515;
                        "
                      >
                        PANBRAMSYAH
                      </p>

                      <p
                        style="
                          margin:0 0 16px;
                          font-family:Arial,Helvetica,sans-serif;
                          font-size:14px;
                          line-height:1.6;
                          color:#5b5652;
                        "
                      >
                        Professional Chef · Private Chef · Culinary Consultant
                      </p>

                      <p
                        style="
                          margin:0;
                          font-family:Arial,Helvetica,sans-serif;
                          font-size:12px;
                          line-height:1.6;
                          color:#9a948d;
                        "
                      >
                        thechefscript.site
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    console.error("Brevo visitor acknowledgement error:", {
      status: response.status,
      body: await response.text(),
    });

    return false;
  }

  const result = (await response.json().catch(() => null)) as
    | { messageId?: string }
    | null;

  console.log(
    "Visitor acknowledgement accepted by Brevo:",
    result?.messageId ?? "accepted",
  );

  return true;
}

async function handleContact(
  request: Request,
  env: Bindings,
): Promise<Response> {
  if (!hasRequiredEnv(env)) {
    console.error("Missing contact-form environment variables.");

    return json(
      {
        success: false,
        code: "SERVER_CONFIGURATION_ERROR",
        message:
          "The contact service is temporarily unavailable. Please try again later.",
      },
      500,
    );
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return json(
      {
        success: false,
        message: "Invalid request format.",
      },
      415,
    );
  }

  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return json(
      {
        success: false,
        message: "Invalid request.",
      },
      400,
    );
  }

  if (clean(body.hp_field)) {
    console.log("Honeypot submission blocked.");

    return json({
      success: true,
      message: "Thank you. Your enquiry has been received.",
    });
  }

  const name = singleLine(body.name);
  const email = singleLine(body.email).toLowerCase();
  const company = singleLine(body.company);

  const rawService = singleLine(body.service);
  const serviceKey = rawService.toLowerCase();

  const SERVICE_ALIASES: Record<string, keyof typeof SERVICE_NAMES> = {
    "menu-development": "menu-development",
    "menu development": "menu-development",

    "consulting": "consulting",
    "f&b-consulting": "consulting",
    "f&b consulting": "consulting",
    "fb-consulting": "consulting",
    "fb consulting": "consulting",
    "culinary-consulting": "consulting",
    "culinary consulting": "consulting",

    "mentoring": "mentoring",
    "culinary-mentoring": "mentoring",
    "culinary mentoring": "mentoring",

    "operations": "operations",
    "kitchen-operations": "operations",
    "kitchen operations": "operations",

    "private-dining": "private-dining",
    "private dining": "private-dining",
    "private-chef": "private-dining",
    "private chef": "private-dining",

    "other": "other",
  };

  const service = rawService
    ? SERVICE_ALIASES[serviceKey] ?? "other"
    : "";

  const message = clean(body.message);

  if (name.length < 2 || name.length > 100) {
    return json(
      {
        success: false,
        message: "Please enter your name.",
      },
      400,
    );
  }

  if (email.length > 254 || !isValidEmail(email)) {
    return json(
      {
        success: false,
        message: "Please enter a valid email address.",
      },
      400,
    );
  }

  if (company.length > 150) {
    return json(
      {
        success: false,
        message: "Company name is too long.",
      },
      400,
    );
  }

  if (!rawService || !service) {
    return json(
      {
        success: false,
        message: "Please select a service.",
      },
      400,
    );
  }

  const serviceLabel =
    SERVICE_NAMES[service] ??
    rawService;

  if (message.length < 10 || message.length > 5000) {
    return json(
      {
        success: false,
        message:
          "Your message must be between 10 and 5000 characters.",
      },
      400,
    );
  }

  const supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SECRET_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  const { data: enquiry, error: insertError } =
    await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        company: company || null,
        service,
        message,
        status: "new",
        email_sent: false,
      })
      .select("id")
      .single();

  if (insertError || !enquiry) {
    console.error("Supabase contact error:", insertError);

    return json(
      {
        success: false,
        code: "DATABASE_ERROR",
        message:
          "Your enquiry could not be sent. Please try again.",
      },
      500,
    );
  }

  console.log("Contact enquiry saved:", enquiry.id);

  let emailSent = false;

  try {
    emailSent = await sendBrevoEmail(env, {
      enquiryId: enquiry.id,
      name,
      email,
      company,
      serviceLabel,
      message,
    });
  } catch (error) {
    console.error("Unexpected Brevo error:", error);
  }

  if (!emailSent) {
    return json(
      {
        success: false,
        code: "EMAIL_SEND_FAILED",
        message:
          "Your enquiry was saved, but the email notification could not be sent. Please try again later.",
      },
      502,
    );
  }

  const { error: updateError } = await supabase
    .from("contact_messages")
    .update({ email_sent: true })
    .eq("id", enquiry.id);

  if (updateError) {
    console.error("Could not update email_sent:", updateError);
  }

  /*
    Send the visitor a confirmation email.

    This is intentionally non-blocking:
    the enquiry is already saved and your notification email
    has already been accepted by Brevo. If the visitor
    confirmation fails, the form still returns success.
  */
  try {
    const acknowledgementSent = await sendVisitorAcknowledgement(env, {
      name,
      email,
      serviceLabel,
    });

    if (!acknowledgementSent) {
      console.error(
        "Visitor acknowledgement failed, but the enquiry was received successfully.",
      );
    }
  } catch (error) {
    console.error("Unexpected visitor acknowledgement error:", error);
  }

  return json({
    success: true,
    message:
      "Your message has been sent successfully. Please check your inbox for confirmation.",
    enquiryId: enquiry.id,
  });
}

export default {
  async fetch(
    request: Request,
    env: Bindings,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return json(
          {
            success: false,
            message: "Method not allowed.",
          },
          405,
        );
      }

      try {
        return await handleContact(request, env);
      } catch (error) {
        console.error("Unexpected contact form error:", error);

        return json(
          {
            success: false,
            message:
              "Something went wrong. Please try again.",
          },
          500,
        );
      }
    }

    if (url.pathname.startsWith("/api/")) {
      return json(
        {
          success: false,
          message: "API route not found.",
        },
        404,
      );
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not Found", {
      status: 404,
    });
  },
} satisfies ExportedHandler<Bindings>;
