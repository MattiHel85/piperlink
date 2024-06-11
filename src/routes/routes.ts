import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/home', (req: Request, res: Response) => {
    res.send('Hi!');
});

export default router;