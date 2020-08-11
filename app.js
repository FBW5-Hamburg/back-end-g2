//================== Require area===============================//
const express = require('express')
const app = express()
//======================== end Require area====================================//
//======================== Routs area=====================================//
app.get('/', (req, res) => {
    res.send('hello');
});
//========================end  Routs area=====================================//

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});