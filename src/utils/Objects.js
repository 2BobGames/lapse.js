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
}