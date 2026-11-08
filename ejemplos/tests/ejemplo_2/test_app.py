from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_suma():
    response = client.get("/suma", params={"a": 1, "b": 2})
    assert response.status_code == 200
    assert response.json() == 3


def test_resta():
    response = client.get("/resta", params={"a": 2, "b": 2})
    assert response.status_code == 200
    assert response.json() == 0
