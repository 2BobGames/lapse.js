import { Ticker } from '@pixi/ticker'

import Groups from './groups'

/** Core of the library */
const Core = {
	/** A ticker handles invoking methods each frame in needed objects. Only one single ticker for all library in accessible place. */
	ticker: new Ticker(),
	/** Here we store all groups of tweens, timeouts and all sorts. */
	groups: new Groups(),

	/** The list of all tweens that are now exist and not destroyed yet */
	allTweens: [],
	onTweenCreated(tween) {
		Core.allTweens.push(tween)
		console.log('tween added, count now:', Core.allTweens.length)
	},
	onTweenDestroyed(tween) {
		let i = Core.allTweens.indexOf(tween)
		if (i >= 0) Core.allTweens.splice(i, 1)
		console.log('tween destroyed, count now:', Core.allTweens.length)
	}
}

Core.ticker.start()

export default Core