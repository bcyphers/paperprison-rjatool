import pandas as pd

def split_excel_by_column(input_file, column_name):
    # Read the Excel file into a pandas DataFrame
    df = pd.read_excel(input_file, sheet_name='tool_table_cyo')
    # Later we can change the code to read from event, so no need to rename the column
    df = df.rename(columns={'event': 'decision'})

    # Group the DataFrame by the specified column
    grouped = df.groupby(column_name)

    # Create a new Excel writer object
    writer = pd.ExcelWriter('output.xlsx', engine='xlsxwriter')

    # Iterate over each group and write to a separate sheet
    for name, group in grouped:
        group.to_excel(writer, sheet_name=name, index=False)

    # Save the Excel file
    writer.close()

# Specify the input file path and the column to split on
input_file = 'raw_data.xlsx'
column_to_split = 'county'

# Call the function to split the Excel file
split_excel_by_column(input_file, column_to_split)
