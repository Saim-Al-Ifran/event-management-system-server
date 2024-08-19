const app = require("./app");
const connectDB = require("./config/db");

app.listen(3000,async()=>{
    console.log('Server is listening on port 3000');
    await connectDB();
});
