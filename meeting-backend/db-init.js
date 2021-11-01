const model = require("./model");
(async () => {
    await model.sync();
    console.log('init db ok.');
    process.exit(0);
})()