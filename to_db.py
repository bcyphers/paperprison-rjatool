import pandas as pd
import mysql.connector
from sqlalchemy import create_engine

dtype_map = {
    'O' : 'TEXT',
    'object' : 'TEXT',
    'int64' : 'INT',
    'float64' : 'FLOAT',
    'datetime64' : 'DATETIME',
    'bool' : 'TINYINT',
    'category' : 'TEXT',
    'timedelta[ns]' : 'TEXT'
}


def main():
    df = pd.read_csv('RJA_tool_table_04-01-2024.csv')

    df = df.rename(columns={'event': 'decision', 'w_pop': 'pop_white'})
    df = df.drop(['rate_per_100_pop', 'disparity_gap_pop_w'], axis=1)
    df = df.assign(county=df.county.replace('California', 'All Counties'))
    df = df.assign(year=df.year.replace('All', 'All Years'))
    df = df.assign(offense=df.offense.replace('All', 'All Offenses'))
    df = df.assign(decision=df.decision.replace('Court', 'Court action'))

    return df

if __name__ == '__main__':
    df = main()

    headers = ["{0} {1}".format(h, dtype_map[str(df[h].dtype)]) for h in
               df.dtypes.index]
    sql = "CREATE TABLE data (%s)" % ", ".join(headers)
    print(sql)

    config = configparser.ConfigParser()
    config.read('config.ini')

    cnx = mysql.connector.connect(
        host=config['mysqlDB']['host'],
        user=config['mysqlDB']['user'],
        password=config['mysqlDB']['pass'],
        database=config['mysqlDB']['db'])

    cur = cnx.cursor()
    cur.execute(sql)
    cur.close()
    cnx.commit()

    engine = create_engine("mysql://root:root@localhost:3306/rjatool")
    df.to_sql('data', engine, if_exists='replace')

    #with sqlite3.connect('./rja.db') as db:
        #df.to_sql('data', db)
