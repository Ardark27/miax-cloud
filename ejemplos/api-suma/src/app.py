from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/suma")
def suma(a: int, b: int) -> int:
    return a + b
