resource "aws_dynamodb_table" "market_data" {
  name         = "MARKET_DATA_TF"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "VALOR"
  range_key    = "TIME_ID"

  attribute {
    name = "VALOR"
    type = "S"
  }

  attribute {
    name = "TIME_ID"
    type = "S"
  }
}
