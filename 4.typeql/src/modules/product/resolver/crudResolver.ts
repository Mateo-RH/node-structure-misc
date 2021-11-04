import { createResolver } from '../../shared/createResolver';
import { Product } from '../../../entity/Product';
import { CreateProductInput } from '../inputs/createProduct';

export const ProductResolver = createResolver(
  'Product',
  Product,
  CreateProductInput,
  Product
);
