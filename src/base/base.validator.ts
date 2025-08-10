import { AsyncValidator } from 'fluentvalidation-ts';
import { Base } from './entities/base.entity';

export class ValidatorBase<
  TEntity extends Base,
> extends AsyncValidator<TEntity> {
  constructor() {
    super();
  }
}
