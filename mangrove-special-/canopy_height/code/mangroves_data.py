from sqlalchemy import Table, Column, Integer, String, DateTime, Float
from sqlalchemy.orm import mapper
from mangroves_database import metadata#Base, metadata, db_session

# def __init__(self, height=None, altitude=None, ground=None, cTemp=None, fTemp=None, time=None):
#     self.height = height
#     self.altitude = altitude
#     self.ground = ground
#     self.cTemp = cTemp
#     self.fTemp = fTemp
#     self.time = time

# def __repr__(self):
#     return "<entry(height='%r', altitude='%r', ground='%r', cTemp='%r', fTemp='%r', time='%s')>" % (self.height, self.altitude, self.ground, self.cTemp, self.fTemp, self.time)

# class Entry(Base):
#     __tablename__ = 'Entry'
#     id = Column(Integer, primary_key=True)
#     height = Column(Integer)
#     altitude = Column(Integer)
#     ground = Column(Integer)
#     cTemp = Column(Integer)
#     fTemp = Column(Integer)
#     time = Column(DateTime)

entries = Table('entries', metadata,
        Column('id', Integer, primary_key=True),
        Column('height', Float),
        Column('altitude', Float),
        Column('ground', Float),
        Column('cTemp', Float),
        Column('fTemp', Float),
        Column('time', String)
)

def as_dict(self):
    return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# mapper(Entry, entries)
