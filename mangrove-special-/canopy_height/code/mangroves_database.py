from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('sqlite:///mangroves_database.db', convert_unicode=True)
metadata = MetaData()

# db_session = scoped_session(sessionmaker(autocommit=False, 
    # autoflush=False, bind=engine))

# Base = declarative_base()
# Base.query = db_session.query_property()

def init_db():
    import mangroves_data
    metadata.create_all(bind=engine)
