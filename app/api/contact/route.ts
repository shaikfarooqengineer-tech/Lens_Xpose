export async function POST(request: Request) {
  try {
    const data = (await request.json()) as Record<string, unknown>;
    if (data.website)
      return Response.json(
        { message: "Unable to send this inquiry." },
        { status: 400 },
      );
    const { name, email, message, project } = data;
    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.length > 100 ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 200 ||
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 5000
    )
      return Response.json(
        { message: "Please enter your name, a valid email, and a message." },
        { status: 400 },
      );
    const key = process.env.RESEND_API_KEY,
      to = process.env.CONTACT_TO_EMAIL,
      from = process.env.CONTACT_FROM_EMAIL;
    if (!key || !to || !from)
      return Response.json(
        {
          message:
            "The studio’s inquiry service is not connected yet. Your message has not been sent; your details remain in the form.",
        },
        { status: 503 },
      );
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Lens Expose inquiry from ${name.slice(0, 100)}`,
        text: `Name: ${name}\nEmail: ${email}\nProject: ${String(project || "Not specified").slice(0, 100)}\n\n${message}`,
      }),
    });
    if (!response.ok)
      return Response.json(
        {
          message:
            "Your message could not be sent. Please try again; your details are still here.",
        },
        { status: 502 },
      );
    return Response.json({
      message: "Thank you. Your story is on its way to the studio.",
    });
  } catch {
    return Response.json(
      { message: "Please check your details and try again." },
      { status: 400 },
    );
  }
}
