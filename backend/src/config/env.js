const REQUIRED_ENV_VARS = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_STORAGE_BUCKET",
];

function assertRequiredEnv() {
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.BACKEND_PORT || 4000),
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  storageBucket: process.env.SUPABASE_STORAGE_BUCKET,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  orderImageSignedUrlTtl: Number(process.env.ORDER_IMAGE_SIGNED_URL_TTL_SECONDS || 3600),
  adminCookieName: process.env.ADMIN_SESSION_COOKIE_NAME || "gw_admin_session",
};

module.exports = {
  env,
  assertRequiredEnv,
};
