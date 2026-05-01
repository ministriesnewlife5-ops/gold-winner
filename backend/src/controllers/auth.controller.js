const { supabaseAuth } = require("../config/supabase");
const { env } = require("../config/env");
const { HttpError } = require("../utils/httpError");

async function loginController(req, res) {
  const email = String(req.body.email || "").trim();
  const password = String(req.body.password || "");

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required.");
  }

  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });

  if (error || !data?.session) {
    throw new HttpError(401, `Login failed: ${error?.message || "invalid credentials"}`);
  }

  res.cookie(env.adminCookieName, data.session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    maxAge: data.session.expires_in * 1000,
  });

  if (req.headers.accept?.includes("text/html")) {
    return res.redirect("/admin/dashboard");
  }

  return res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in: data.session.expires_in,
    user: data.user,
  });
}

async function logoutController(req, res) {
  res.clearCookie(env.adminCookieName);

  if (req.headers.accept?.includes("text/html")) {
    return res.redirect("/admin/login");
  }

  return res.status(204).send();
}

function adminLoginPageController(req, res) {
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Admin Login</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 2rem; background: #f5f6fb; }
      .card { max-width: 420px; margin: 2rem auto; background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,.08); }
      input, button { width: 100%; padding: .75rem; margin-top: .75rem; border-radius: 8px; border: 1px solid #ddd; }
      button { background: #0f172a; color: white; border: none; cursor: pointer; }
      h1 { margin: 0 0 0.5rem; }
      p { color: #555; font-size: .9rem; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Admin Login</h1>
      <p>Sign in with your Supabase Auth admin user.</p>
      <form method="post" action="/auth/login">
        <label>Email</label>
        <input type="email" name="email" required />
        <label>Password</label>
        <input type="password" name="password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  </body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
}

module.exports = {
  loginController,
  logoutController,
  adminLoginPageController,
};
