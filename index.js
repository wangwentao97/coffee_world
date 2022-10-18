let express = require("express");
let app = express();

app.get('/', (req, res) => {
    res.send("root page");
})

app.listen(3000, () => {
    console.log("localhost: 3000");
})

app.use('/coffee', express.static('public'));