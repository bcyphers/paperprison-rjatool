# Paper Prisons RJA Tool

This is the repository for the Paper Prisons intiative's [Racial Justice Act data
tool](https://rja.paperprisons.org). Learn more about the tool in the Berkeley
Journal of Criminal Law article
[here](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4852606).

## Setup

The site requires [Node.js and
npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and uses
[Next.js](https://nextjs.org/).

This repository has all content necessary to host the site except for database
configuration details. To connect to a database, place a file called
`config.ini` in the base directory with the following content:

```
[mysqlDB]
host=<dbhost>
db=<dbname>
user=<username>
pass=<password>
```

Fill out the hostname, database name, username, and password with the correct
details.

### Setting up Node 

`npm i`

### Populating the database

To populate a MySQL database from the formatted csv file, first make sure MySQL
is installed and running and that `config.ini` contains the correct credentials
for that database. Then run the `to_db.py` script. 

**WARNING**: This will overwrite anything currently in the `data` table in your
database! Make sure `config.ini` is pointing to the right place.

```
$ pip install -r requirements.txt
$ python cli/to_db.py <path_to_file.csv>
```

## Test the site locally

`npm run dev`

## Run the site in production

`npm run start`
