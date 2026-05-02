import base64
from fastapi import FastAPI, UploadFile
from openai import AsyncOpenAI
from litellm import acompletion
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import date, time

load_dotenv()
app = FastAPI()
client = AsyncOpenAI()


class ReceiptItem(BaseModel):
    name: str
    price: float | None
    quantity: int | None


class ReceiptResult(BaseModel):
    merchant: str | None
    address: str | None
    items: list[ReceiptItem]
    total: float | None
    category: str | None
    date: date | None
    time: time | None


@app.get("/")
def read_root():
    return {"Hello": "World"}


# @app.post("/scan")
# async def scan(files: list[UploadFile]) -> list[ReceiptResult]:
#     print('start to scan')
#     results = []

#     for file in files:
#         image_bytes = await file.read()
#         b64 = base64.b64encode(image_bytes).decode("utf-8")
#         mime = file.content_type or "image/jpeg"

#         response = await client.beta.chat.completions.parse(
#             model="gpt-4o",
#             messages=[
#                 {
#                     "role": "user",
#                     "content": [
#                         {
#                             "type": "image_url",
#                             "image_url": {"url": f"data:{mime};base64,{b64}"},
#                         },
#                         {
#                             "type": "text",
#                             "text": (
#                                 "Extract the receipt details from this image. "
#                                 "For category, make a best guess (e.g. Groceries, Dining, Transport, Healthcare, Shopping). "
#                                 "For date, extract the date of transaction on the receipt. "
#                                 "Date format on the receipt may be MM/DD/YYYY, DD/MM/YYYY or similar — convert to ISO format (YYYY-MM-DD). "
#                                 "For time, extract the time of transaction on the receipt. "
#                                 "For address, combine all address parts (street, city, state, country, postal code) into a single string. "
#                                 "If a value is not visible, return null."
#                             ),
#                         },
#                     ],
#                 }
#             ],
#             response_format=ReceiptResult,
#         )

#         results.append(response.choices[0].message.parsed)

#     print('done', results)
#     return results


@app.post("/scan")
async def scan(files: list[UploadFile]) -> list[ReceiptResult]:
    print('start to scan')
    results = []

    for file in files:
        image_bytes = await file.read()
        b64 = base64.b64encode(image_bytes).decode("utf-8")
        mime = file.content_type or "image/jpeg"

        response = await acompletion(
            model="openai/gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:{mime};base64,{b64}"},
                        },
                        {
                            "type": "text",
                            "text": (
                                "Extract the receipt details from this image. "
                                "For category, make a best guess (e.g. Groceries, Dining, Transport, Healthcare, Shopping). "
                                "For date, extract the date of transaction on the receipt. "
                                "Date format on the receipt may be MM/DD/YYYY, DD/MM/YYYY or similar — convert to ISO format (YYYY-MM-DD). "
                                "For time, extract the time of transaction on the receipt and return it in HH:MM format (24-hour, no seconds, no timezone offset). "
                                "For address, combine all address parts (street, city, state, country, postal code) into a single string. "
                                "If a value is not visible, return null."
                            ),
                        },
                    ],
                }
            ],
            response_format=ReceiptResult,
        )

        results.append(ReceiptResult.model_validate_json(response.choices[0].message.content))

    print('done', results)
    return results
