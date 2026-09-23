# The account subdomain is not exposed by this resource, and printing the account would leak it into logs.
output "worker_url" {
  value = "https://${var.worker_name}.<account-subdomain>.workers.dev; read the subdomain from the dashboard"
}
