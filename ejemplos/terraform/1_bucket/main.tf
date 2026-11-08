# El nombre debe ser único en todo AWS: cámbialo por el tuyo.
resource "aws_s3_bucket" "datos" {
  bucket = "miax-tu-alias-tf"
}
