variable "my_ip_cidr" {
  description = "Tu IP pública en formato CIDR, por ejemplo 203.0.113.10/32"
  type        = string
}

variable "key_name" {
  description = "Nombre de un par de claves existente"
  type        = string
}

data "aws_ssm_parameter" "al2023" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

resource "aws_security_group" "ssh_api" {
  name = "miax-ssh-api"

  ingress {
    description = "SSH desde mi IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip_cidr]
  }

  ingress {
    description = "API desde mi IP"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = [var.my_ip_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "miax" {
  ami                    = data.aws_ssm_parameter.al2023.value
  instance_type          = "t3.micro"
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.ssh_api.id]

  tags = {
    Name = "miax-terraform"
  }
}

output "ip_publica" {
  value = aws_instance.miax.public_ip
}
