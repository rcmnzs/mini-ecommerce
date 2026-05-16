import { Router } from 'express';
import * as productController from '../controllers/productController';

const productRouter = Router();

productRouter.post('/', productController.create);
productRouter.get('/', productController.getAll);
productRouter.get('/:id', productController.getById);
productRouter.put('/:id', productController.update);
productRouter.delete('/:id', productController.remove);

export default productRouter;
