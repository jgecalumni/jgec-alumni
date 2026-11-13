import express from 'express';
import {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    forgotPassword,
    resetPassword
} from '../controller/users.controller';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
