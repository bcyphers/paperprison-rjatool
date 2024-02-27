import pandas as pd
import sqlite3

def main():
    df = pd.read_csv('tool_table_cyo_all_g.csv')
    df = df[df.gender == 'Total']

    pop_df = pd.read_csv('ACS_pop_summary_tool.csv')
    df = pd.merge(df, pop_df, how='left', on=['county', 'race', 'gender'])
    df = df.drop(['previous_event', 'rate_per_100_pop', 'disparity_gap_pop_w',
                  'rate_cond_previous', 'disparity_gap_cond_w', 'county_pop_rank'],
                 axis=1)

    df = df.rename(columns={'event': 'decision', 'pop': 'race_pop'})
    df = df.assign(county=df.county.replace('California', 'All Counties'))
    df = df.assign(year=df.year.replace('All', 'All Years'))

    with sqlite3.connect('./rja.db') as db:
        df.to_sql('data', db)


def check_rate_per_pop(df):
    def per_100(r):
        ratio = int(r['number']) / int(r['pop'])
        if r['year'] == '2021':
            ratio *= 4/3
        elif r['year'] == 'All':
            ratio /= 11.75
        return ratio * 100

    df['new_per_100'] = df.apply(per_100, axis=1)
    df['ratio'] = df.apply(lambda r: r['rate_per_100_pop'] / r['new_per_100'], axis=1)

if __name__ == '__main__':
    main()
