from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 👉 본인 MySQL 설정에 맞게 USER, PASSWORD, HOST, DB 이름 수정
DATABASE_URL = "mysql+pymysql://root:password@localhost:3306/offerwall"

engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()