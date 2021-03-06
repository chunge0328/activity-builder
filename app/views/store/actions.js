import support from '../../support';
import config from '../../config';
const fs = nodeRequire('fs')
const path = nodeRequire('path')
const componentsDirctory = path.join(config.BASE_DIR, 'app/components/business')

export default {
	fetchComponents({commit, state}) {
		commit('delAllComponents');
		fs.readdirSync(componentsDirctory).forEach(function(compDir) {
			fs.readdirSync(path.join(componentsDirctory, compDir)).forEach(function(file) {
				if(path.extname(file) == '.json') {
					var comp = JSON.parse(fs.readFileSync(path.join(componentsDirctory, compDir, file)));
					comp['src'] = path.join(componentsDirctory, compDir, 'index.vue');
					comp['componentName'] = compDir;
					commit('addComponent', comp);
				}
			});
		});
	},

	fetchTpls({commit, state}) {
		support.getDB().find({type: 'TPL'}).sort({modifiedTime: -1}).exec(function(err, docs) {
			if(err) return;
			commit('delAllTpls');
			docs.forEach(function(doc) {
				commit('addTpl', doc);
				if(!state.activeTpl && state.tpls.length) {
					commit('setActiveTpl', state.tpls[0]);
				}
			});
        });
	},

	delTpl({dispatch, commit, state}, id) {
		support.getDB().remove({_id: id}, function(err) {
			if(err) return;
			if(state.activeTpl._id == id) {
				commit('setActiveTpl', {});
			}
			dispatch('fetchTpls');
		})
	}
}