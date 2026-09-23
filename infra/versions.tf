terraform {
  required_version = ">= 1.8"

  # The provider authenticates from the CLOUDFLARE_API_TOKEN environment variable, so no token enters a variable.
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.25"
    }
  }
}
