from pydantic import BaseModel
from model import DaysOfWeek
from datetime import time

class GymClasses(BaseModel):
    name:str
    trainer_id:int
    day_of_week: DaysOfWeek
    start_time:time
    duration_min:int
    capacity:int
    
class GymClassesResponse(GymClasses):
    id: int
    
    class Config:
        from_attributes = True