from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from database import Base
import enum


class RewardStatus(str, enum.Enum):
    paid = "paid"
    pending = "pending"


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), nullable=False)
    type = Column(String(50))
    subtype = Column(String(50))
    keywords = Column(String(255))
    rank_keyword = Column(String(255))
    link = Column(String(255))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    quantity = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())


class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), nullable=False)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    action_time = Column(DateTime, server_default=func.now())
    result = Column(String(50))
    ip = Column(String(45))
    device = Column(String(255))  # 길이 늘림


class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    log_id = Column(Integer, ForeignKey("logs.id"), nullable=False)
    status = Column(Enum(RewardStatus), default=RewardStatus.pending)
    paid_at = Column(DateTime, nullable=True)
