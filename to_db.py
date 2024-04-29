import pandas as pd
import sqlite3

def main():
    df = pd.read_csv('RJA_tool_table_04-01-2024.csv')

    df = df.rename(columns={'event': 'decision', 'w_pop': 'pop_white'})
    df = df.drop(['rate_per_100_pop', 'disparity_gap_pop_w'], axis=1)
    df = df.assign(county=df.county.replace('California', 'All Counties'))
    df = df.assign(year=df.year.replace('All', 'All Years'))
    df = df.assign(decision=df.decision.replace('Court', 'Court action'))

    return df

if __name__ == '__main__':
    df = main()

    with sqlite3.connect('./rja.db') as db:
        df.to_sql('data', db)
