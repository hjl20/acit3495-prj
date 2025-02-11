terraform {
  backend "s3" {
    bucket = ""
    key    = "acit3495-prj1"
    region = "us-west-2"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
# Configure the AWS Provider
provider "aws" {
  region = "us-west-2"
}

locals {
  project_name = "acit3495prj1"
}

# use data source to get a registered amazon linux 2 ami
data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "owner-alias"
    values = ["amazon"]
  }

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm*"]
  }
}

# launch the ec2 instance
resource "aws_instance" "web" {
  ami                    = data.aws_ami.amazon_linux_2.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.web.id
  vpc_security_group_ids = [aws_security_group.web.id]

  tags = {
    Name = "project_vpc"
    ProjectName = local.project_name
  }
}

# an empty resource block
resource "null_resource" "name" {
  # copy the deploy.sh from computer to the ec2 instance 
  provisioner "file" {
    source      = "files/deploy.sh"
    destination = "/home/ec2-user/deploy.sh"
  }
  
  # copy the docker compose from computer to the ec2 instance 
  provisioner "file" {
    source      = "../../docker-compose.yml"
    destination = "/home/ec2-user/docker-compose.yml"
  }

  # set permissions and run the script
  provisioner "remote-exec" {
    inline = [
      "sudo chmod +x /home/ec2-user/deploy.sh",
      "sh /home/ec2-user/deploy.sh",
    ]
  }

  # wait for ec2 to be created
  depends_on = [aws_instance.web]

}

########## ADAPTED FROM ACIT 4640 LAB WEEK4 #######
# Create a VPC
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc
resource "aws_vpc" "web" {
  cidr_block = "10.0.0.0/16"
  # enable dns enable_dns_hostnames
  enable_dns_hostnames = true

  tags = {
    Name = "project_vpc"
    ProjectName = local.project_name
  }
}

# Create a public subnet
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/subnet
# To use the free tier t2.micro ec2 instance you have to declare an AZ
# Some AZs do not support this instance type
resource "aws_subnet" "web" {
  vpc_id     = aws_vpc.web.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "us-west-2a"
  map_public_ip_on_launch = true

  tags = {
    Name = "Web"
    ProjectName = local.project_name
  }
}

# Create internet gateway for VPC
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/internet_gateway
resource "aws_internet_gateway" "web-gw" {
  vpc_id = aws_vpc.web.id
  tags = {
    Name = "Web"
    ProjectName = local.project_name
  }
}

# create route table for web VPC 
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table
resource "aws_route_table" "web" {
  vpc_id = aws_vpc.web.id
  tags = {
    Name = "web-route"
    ProjectName = local.project_name
  }
}

# add route to to route table
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route
resource "aws_route" "default_route" {
  route_table_id         = aws_route_table.web.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id = aws_internet_gateway.web-gw.id
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table_association
resource "aws_route_table_association" "web" {
  subnet_id      = aws_subnet.web.id
  route_table_id = aws_route_table.web.id
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group
resource "aws_security_group" "web" {
  name        = "allow_http"
  description = "allow http"
  vpc_id = aws_vpc.web.id
  tags = {
    Name = "Web"
    ProjectName = local.project_name
  }
}

# allow http
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_security_group_ingress_rule
resource "aws_vpc_security_group_ingress_rule" "web-http" {
  security_group_id = aws_security_group.web.id

  # allow http anywhere
  ip_protocol = "tcp"
  from_port   = 80
  to_port     = 80
  cidr_ipv4   = "0.0.0.0/0"
}

# allow all out
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_security_group_egress_rule
resource "aws_vpc_security_group_egress_rule" "web-egress" {
  security_group_id = aws_security_group.web.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = -1
}


# print the url of the container
output "container_url" {
  value = join("", ["http://", aws_instance.web.public_dns])
}