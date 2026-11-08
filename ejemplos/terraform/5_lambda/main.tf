# Pasos: terraform apply -target=aws_ecr_repository.lambda, sube la imagen
# con la etiqueta latest y después ejecuta terraform apply.

resource "aws_ecr_repository" "lambda" {
  name         = "miax-lambda-tf"
  force_delete = true
}

resource "aws_iam_role" "lambda" {
  name = "miax-tf-lambda"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "miax" {
  function_name = "miax-terraform"
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.lambda.repository_url}:latest"
  role          = aws_iam_role.lambda.arn
}
