import _ from 'utils/Objects'

export default class Group {
	get symbol() { return this._symbol }

	constructor(symbol, groups) {
		this._groups = groups
		this._symbol = symbol
		this._tweens = []
	}

	add(tween) {
		this._tweens.push(tween)
	}

	remove(tween) {
		let index = this._tweens.indexOf(tween)
		if (index < 0) return console.log('LapseJS:Group: trying to remove a tween from an group when the tween is not in it', this.symbol, tween)
		this._tweens.splice(index, 1)
		if (this._tweens.length < 1) this.destroy()
	}

	destroy() {
		if (this.isDestroyed === true) return
		this.isDestroyed = true

		//first of all we remove all tweens that we have (because we also call this destroy function from the root index.js, when a developer asks to destroy a group)
		console.log('before destroy', this._tweens)
		_.each(this._tweens, tween => {
			console.log(1, this._tweens)
			tween.destroy()
			console.log(2, this._tweens)
		})
		console.log('after destroy', this._tweens)

		this._symbol = null
		this._groups.onGroupDestroyed(this)
		this._groups = null
	}
}