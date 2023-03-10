terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.35"
    }
  }

  cloud {
    organization = "code4romania"

    workspaces {
      name = "teo"
    }
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      app = "teo"
      env = var.env
    }
  }
}
