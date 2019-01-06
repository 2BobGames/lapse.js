import Polyfills from 'polyfills'

import Tween from 'core/Tween'

global.Lapse = {
	one(params) {
		let tween = new Tween(params)
		tween.play()
		return tween
	}
}