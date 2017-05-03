import DialogBuilder from '../base/DialogBuilder';
export const state = {

}
export const mutations = {
	showDialog(state, context) {
		DialogBuilder.of(context).confirm('AAA', 'BBB');
	}
}