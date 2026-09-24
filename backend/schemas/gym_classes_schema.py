from pydantic import BaseModel,Field
from model import DaysOfWeek
from datetime import time

class GymClasses(BaseModel):
    name:str
    trainer_id:int
    day_of_week: DaysOfWeek
    start_time:time
    duration_min:int = Field(gt=0)
    capacity:int = Field(gt=0)
    
class GymClassesResponse(GymClasses):
    id: int
    
    class Config:
        from_attributes = True