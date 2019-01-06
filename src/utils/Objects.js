/**
 * The class is for working with arrays/objects/functions as the underscorejs does, but here we have super lightweight variant.
 */
export default class Objects {
	static each(obj, predicate) {
		if (!obj) return
		if (typeof predicate !== 'function') throw new Error('Lapse:Utils:Objects:each: predicate is ' + predicate)
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) predicate(obj[key], key)
		}
	}

	static filter(obj, predicate) {
		if (!obj) return
		if (typeof predicate !== 'function') throw new Error('Lapse:Utils:Objects:filter: predicate is ' + predicate)
		let ret = {}
		for (let key in obj) {
			if (obj.hasOwnProperty(key) && predicate(obj[key], key)) ret[key] = obj[key]
		}
		return ret
	}

	static withoutSame(objNeededToBeFiltered, comparingObj) { return Objects.filter(objNeededToBeFiltered, (value, key) => comparingObj[key] !== value) }
	static without$(obj) { return Objects.filter(obj, (value, key) => key.charAt(0) !== '$') }
	static with$(obj) { return Objects.filter(obj, (value, key) => key.charAt(0) === '$') }
}