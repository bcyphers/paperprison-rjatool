import pandas as pd
import configparser
import sys
from sqlalchemy import create_engine, URL


def clean_csv(path):
    df = pd.read_csv(path)

    df = df.rename(columns={'event': 'decision', 'w_pop': 'pop_white'})
    df = df.drop(['rate_per_100_pop', 'disparity_gap_pop_w'], axis=1)
    df = df.assign(county=df.county.replace('California', 'All Counties'))
    df = df.assign(year=df.year.replace('All', 'All Years'))
    df = df.assign(offense_name=df.offense_name.replace('All', 'All Offenses'))
    df = df.assign(decision=df.decision.replace('Court', 'Court action'))

    return df

if __name__ == '__main__':
    df = clean_csv(sys.argv[1])

    config = configparser.ConfigParser()
    config.read('config.ini')

    engine = create_engine(URL.create(
        "mysql",
        username=config['mysqlDB']['user'],
        password=config['mysqlDB']['pass'],
        host=config['mysqlDB']['host'],
        database=config['mysqlDB']['db'],
    ))

    df.to_sql('data', engine, if_exists='replace')
