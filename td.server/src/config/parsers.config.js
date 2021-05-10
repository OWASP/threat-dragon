import express from 'express';

const config = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
};

export default {
    config
};
