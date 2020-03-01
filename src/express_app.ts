import express from "express";
let app = express();
let options = {
    index: ['index.html'],
    dotfiles: 'ignore',
};

app.use(express.static('public', options))

export { app };
