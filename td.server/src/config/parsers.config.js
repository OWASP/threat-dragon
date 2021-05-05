import cookieParser from 'cookie-parser';
import express from 'express';

const config = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
};

export default {
    config
};
