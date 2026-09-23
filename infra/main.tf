locals {
  # Built by `npm run build:proxy`; filesha256 makes a rebuilt bundle trigger a redeploy.
  bundle = "${path.module}/../proxy/dist/index.js"
}

resource "cloudflare_workers_script" "proxy" {
  account_id     = var.account_id
  script_name    = var.worker_name
  content_file   = local.bundle
  content_sha256 = filesha256(local.bundle)
  main_module    = "index.js"
  # Must equal proxy/wrangler.jsonc so `wrangler dev` runs the same runtime as the deploy.
  compatibility_date = "2026-09-01"

  # Workers Logs stay off, matching proxy/wrangler.jsonc.
  observability = {
    enabled = false
  }

  bindings = [
    { type = "secret_text", name = "BRAVE_API_KEY", text = var.brave_api_key },
    { type = "secret_text", name = "OPENROUTER_API_KEY", text = var.openrouter_api_key },
    { type = "plain_text", name = "ALLOWED_ORIGIN", text = var.allowed_origin },
    { type = "plain_text", name = "SITE_NAME", text = var.site_name },
    { type = "plain_text", name = "SITE_URL", text = var.site_url },
    {
      type         = "ratelimit"
      name         = "RATE_LIMITER"
      namespace_id = "1001"
      simple       = { limit = var.rate_limit_per_minute, period = 60 }
    },
    {
      type         = "ratelimit"
      name         = "GLOBAL_LIMITER"
      namespace_id = "1002"
      simple       = { limit = var.global_limit_per_minute, period = 60 }
    },
  ]
}

# workers.dev only; a route needs a custom domain, which does not exist yet.
resource "cloudflare_workers_script_subdomain" "proxy" {
  account_id       = var.account_id
  script_name      = cloudflare_workers_script.proxy.script_name
  enabled          = true
  previews_enabled = false
}
