# Secrets and account-identifying values arrive as TF_VAR_* at apply time; nothing is committed in a .tfvars file.

variable "account_id" {
  type      = string
  sensitive = true
}

variable "brave_api_key" {
  type      = string
  sensitive = true
}

variable "openrouter_api_key" {
  type      = string
  sensitive = true
}

# The Pages origin embeds the GitHub account name, so it is kept out of plan output like a secret.
variable "allowed_origin" {
  type      = string
  sensitive = true
}

variable "site_url" {
  type      = string
  sensitive = true
}

variable "site_name" {
  type    = string
  default = "nottheriver"
}

variable "worker_name" {
  type    = string
  default = "nottheriver-proxy"
}

# Keep equal to RATE_LIMIT and GLOBAL_LIMIT in proxy/src/handler.ts so the binding and the in-memory fallback enforce the same ceiling.
variable "rate_limit_per_minute" {
  type    = number
  default = 30
}

variable "global_limit_per_minute" {
  type    = number
  default = 60
}
