from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Text
from sqlalchemy.sql import func
from db.mysql import Base
from datetime import datetime, timezone
import enum

class RewardStatus(enum.Enum):
    pending = "pending"
    paid = "paid"

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(64), nullable=False)
    type = Column(String(50), nullable=False)
    subtype = Column(String(50), nullable=False)
    keywords = Column(String(255))
    rank_keyword = Column(String(255))
    link = Column(String(1024), nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(64), nullable=False)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    action_time = Column(DateTime, server_default=func.now())
    result = Column(String(100), nullable=False)
    ip = Column(String(45), nullable=False)
    device = Column(String(100))
    event = Column(String(50))
    referrer = Column(String(1024))
    user_agent = Column(String(512))
    language = Column(String(20))
    screen = Column(String(20))  # ex: "1920x1080"
    keyword = Column(String(255), nullable=True)

class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, autoincrement=True)
    log_id = Column(Integer, ForeignKey("logs.id"), nullable=False)
    status = Column(Enum(RewardStatus), nullable=False, default=RewardStatus.pending)
    paid_at = Column(DateTime, server_default=func.now())
    description = Column(Text, nullable=True, comment="보상 내용")