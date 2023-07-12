from fastapi import FastAPI

from typing import List
from pydantic import BaseModel

import time

app = FastAPI()

class Item(BaseModel):
    input: List[List[float]] | None = None
    output: List[List[float]] | None = None

@app.put("/")
def read_json(data: Item):
    data = dict(data)
    response = {
        'w': data['input'],
        'b': data['output']
    }
    return response








# @app.get("/{item_id}")
# def read_item(item_id:int, s:str =None):
#     return {"item_id": item_id, "s": s}