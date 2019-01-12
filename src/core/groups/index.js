import Group from './Group'

/**
 * The group class for storing packs of tweens
 *
 * @class
 * @memberof Lapse
 */
export default class Groups {
	constructor() {
		/** An array of Group objects */
		this._groups = []
	}

	/**
	 * Adds a specified tween to a group with specified symbol
	 * @param {any} groupSymbol A value that will join some tweens into one group. It may be a string, a number, a function, an object - anything. Will be compared with ===
	 * @param {Tween} tween A tween that will be added into a specified 'groupSymbol' group
	*/
	addTo(groupSymbol, tween) {
		let group = this.getGroup(groupSymbol)
		if (!group) {
			group = new Group(groupSymbol, this)
			this._groups.push(group)
			console.log('group created, count now:', this._groups.length)
		}
		group.add(tween)
	}

	/**
	 * Removes a specified tween from a group with specified symbol
	 * @param {any} groupSymbol A value that displays a group which we remove the tween from. It may be a string, a number, a function, an object - anything. Will be compared with ===
	 * @param {Tween} tween A tween that will be removed from a specified 'groupSymbol' group
	*/
	removeFrom(groupSymbol, tween) {
		let group = this.getGroup(groupSymbol)
		if (!group) return console.log('LapseJS:Groups: trying to remove a tween from an undefined group')
		group.remove(tween)
	}

	/**
	 * Returns a group with a specified groupSymbol
	 * @param {any} groupSymbol A value that will join some tweens into one group. It may be a string, a number, a function, an object - anything. Will be compared with ===
	*/
	getGroup(groupSymbol) {
		let i = 0, len = this._groups.length, group
		while (i < len) {
			group = this._groups[i]
			if (groupSymbol === group.symbol) return group
			i++
		}
		return null
	}

	/** Is called when a group has been destroyed */
	onGroupDestroyed(group) {
		let i = this._groups.indexOf(group)
		if (i >= 0) this._groups.splice(group.groupsIndex, 1)
		console.log('group removed, count now:', this._groups.length)
	}
}