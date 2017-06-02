import Address from './Address.vue'
import Builder from 'base/Builder'

class AddressBuilder extends Builder {
  constructor(ctx) {
     super(ctx,Address)
  }
  show(defaultInfo) {
    this.createComp({defaultInfo})
  }
  static of(ctx) {
    return new AddressBuilder(ctx)
  }
}
export default AddressBuilder 