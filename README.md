# Twitter Stream Graph
Visualise twitter trends over-time for a set of search terms

## Demo
Coming soon ...

## Usage
- npm install
- Fill-in your twitter api tokens in app.js
- Define a list of comma-separated search terms in the keywords variable
- Set the cors
```
app.use(cors({
        allowedOrigins: [
            'localhost:*'
        ]
    }));
```
- Run it
```
node app.js
```
- Set the adequate number of layers (= number of keywords) in index.html
- Browse to index.html and enjoy

## Licence
MIT Licence