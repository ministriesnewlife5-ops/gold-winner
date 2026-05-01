const { supabaseAuth } = require("../config/supabase");
const { env } = require("../config/env");

function extractBearerToken(headerValue) {
  if (!headerValue) return "";
  const [type, token] = headerValue.split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) return "";
  return token;
}

async function requireAdminAuth(req, res, next) {
  const tokenFromHeader = extractBearerToken(req.headers.authorization);
  const tokenFromCookie = req.cookies?.[env.adminCookieName] || "";
  const accessToken = tokenFromHeader || tokenFromCookie;

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data, error } = await supabaseAuth.auth.getUser(accessToken);

  if (error || !data?.user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.adminUser = data.user;
  req.adminAccessToken = accessToken;
  next();
}

module.exports = {
  requireAdminAuth,
};
