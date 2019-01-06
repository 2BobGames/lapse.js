import _ from 'utils/Objects'
import Core from 'core'
import Eases from './Eases'

/**
 * The tween class for applying animations to objects.
 *
 * ```
 * let sprite = new PIXI.Sprite(texture)
 * let tween = new Lapse.Tween(sprite, { x:100, y: 200, alpha: 0 }, { time: 1500, onComplete: () => console.log('done') })
 * ```
 * @class
 * @memberof Lapse
 */
export default class Tween {
	/** Current tween animation ratio from 0 to 1 (it's not the progress, because ratio is already modified by ease-function number) */
	get ratio() { return this._ratio }
	/** Current tween animation progress from 0 to 1 */
	get progress() { return this._progress }

	/**
	 * @param {object} params - Any kind of properties of a tween. Properties of library have $ char at the beginning, any another ones are properties that will be animated (for example { x: 50, $time: 500 })
	 * @param {number} params.$time - Duration of animation (delay, interval etc.) in milliseconds
	 * @param {number} [params.$target] - The object whose parameters we're going to animate
	 * @param {Function|string} [params.$ease] - Ease function or name of ease function (e.g. "linear" or "power1In" or "backOut")
	 * @param {number} [params.$onUpdate] - Is called each time when the tween applies changes to the target. The tween will be passed in parameters
	 * @param {number} [params.$onComplete] - Is called when the tween is completed his animation from the start to the end The tween will be passed in parameters
	 */
	constructor(params) {
		this._reset(... arguments)
	}

	/**
	 * Clears and initializes again the tween with a new specified data
	*/
	_reset(params) {
		if (!params || params.hasOwnProperty('$time') !== true) throw new Error('LapseJS:Tween: params are wrong. You have to pass at least { \'$time\': milliseconds } as a duration')

		if (typeof params.$ease === 'string') {
			params.$ease = Eases[params.$ease]
			if (!params.$ease) throw new Error('LapseJS:Tween: params are wrong. You have to pass at least { \'$time\': milliseconds } as a duration')
		}
		if (!params.$ease) params.$ease = Eases.linear

		this._clear()
		this._params = params
		this._varsTarget = _.without$(params)

		//remembers "initial values" and calculates "values difference" of the target's properties
		_.each(this._varsTarget, (value, key) => {
			if (!this._params.$target) throw new Error('LapseJS:Tween: property $target is wrong. You passed properties to animate but didn\'t pass any target')
			this._varsInit[key] = this._params.$target[key]
			this._varsDifference[key] = value - this._varsInit[key]
		})
	}

	/** Clears the tween but doesn't remove it fully in order to initialize the tween again with a new data (with _reset() method) */
	_clear() {
		this.stop()

		/** Here we store only those properties (and their target values) that this tween is going to animate */
		this._varsTarget = {}
		/** Initial values of the target's properties */
		this._varsInit = {}
		/** Difference between target values and initial ones */
		this._varsDifference = {}
		/** Current tween animation ratio from 0 to 1 (it's not the progress, because ratio is already modified by ease-function number) */
		this._ratio = 0
		/** Current tween animation progress from 0 to 1 */
		this._progress = 0
		/** Whether the tween is playing right now */
		this._isPlaying = false
		/** Whether the tween is finished its animation */
		this._isFinished = false
	}

	/**
	 * Set calculated properties
	 * @param {number} progress - On which moment of animation we need to set the tween (i.e. progress from 0 to 1)
	*/
	_apply(progress) {
		if (progress > 1) progress = 1
		this._progress = progress
		if (!this._params.$target) return

		let target = this._params.$target
		this._ratio = this._params.$ease(progress)

		//applying new values to target
		_.each(this._varsDifference, (value, key) => target[key] = this._varsInit[key] + value * this._ratio)

		//if the tween is playing and we got ratio = 1 it means that the tween is completed
		if (this._isPlaying === true) {
			if (this._params.$onUpdate) this._params.$onUpdate()
			if (this._progress >= 1) {
				if (this._params.$onComplete) this._params.$onComplete()
				this._isFinished = true
				this.stop()
			}
		}
	}

	/**
	 * Is called every frame if _isPlaying property is true
	*/
	_tick() {
		if (this._isPlaying !== true) return
		this._apply(this._progress + Core.ticker.elapsedMS / this._params.$time)
	}

	/**
	 * Plays the animation for the target from the start or from a specified ratio (from 0 to 1)
	 * @param {number} [ratio=0] - A ratio (number from 0 to 1) from which to start playing the tween
	 */
	play(ratio) {
		if (!ratio) ratio = 0
		if (this._isPlaying === true) return
		this._isFinished = false
		this._apply(0)
		Core.ticker.add(this._tick, this)

		//we set isPlaying true exactly here in order to start animating from the next frame but not immediately
		this._isPlaying = true
	}

	/** Starts playing the tween from that moment when it was stopped by stop() method */
	resume() {
		this.play(this._ratio)
	}

	/** Stops the animation. Can be resumed (played from that moment when we stop it) with resume() method */
	stop() {
		Core.ticker.remove(this._tick)
		this._isPlaying = false
	}

	destroy() {
		this.stop()
	}
}