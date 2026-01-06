import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise <void> => {
    console.log('Authentication middleware executed');
    if(req.headers.authorization){
        const token: String = req.headers.authorization.split(' ')[1]; // Bearer <token>
        // Here you would typically verify the token
        const user = await User.findOne({ token: token, deleted: false }).select('-password');
        if(user){ // Replace with actual token verification logic
            console.log('User authenticated');
            req["info"]= user;
            
        }
        else{
            res.status(401).json({
                code: 401,
                message: "Unauthorized: Invalid token"
            });
        }
    }else{
        res.status(401).json({
            code: 401,
            message: "Unauthorized: No token provided"
        });
    }

    next();
}