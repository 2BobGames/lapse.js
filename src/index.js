import Polyfills from 'polyfills'

import Core from 'core'
import Tween from 'core/Tween'

global.Lapse = {
	one(params) {
		let tween = new Tween(params)
		tween.play()
		return tween
	},

	groupDestroy(symbol) {
		let group = Core.groups.getGroup(symbol)
		if (group) group.destroy()
	}
}