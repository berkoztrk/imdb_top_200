# imdbtop200
IMDB top 200 data 

## Installation
``
    npm i @berkozturk/imdb_top_200
``

## Example Usage

```
const top200 = require('@berkozturk/imdb_top_200');
  (async () => {
    const result = await top200.get();
    console.dir(result);
  })();

```