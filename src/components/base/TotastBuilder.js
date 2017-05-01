import Totast from './Totast.vue';
import Builder from 'base/Builder';

class TotastBuilder extends Builder {

	constructor(ctx) {
		super(ctx, Totast);
	}

	show(msg, duration) {
		this.createComp({msg, duration})
	}

	static of(ctx) {
		return new TotastBuilder(ctx);
	}
}
export default TotastBuilder;