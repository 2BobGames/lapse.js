import _ from 'utils/Objects'
import Core from 'core'

/**
 * The tween class for applying animations to objects.
 *
 * ```
 * let sprite = new PIXI.Sprite(texture)
 * let tween = new Lapse.Tween(sprite, { x:100, y: 200, alpha: 0 }, { duration: 1500, onComplete: () => console.log('done') })
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
	 * @param {object} target - An object whose properties a tween will animate
	 * @param {object} vars - Properties that a tween will change (for example { x: 50 }, )
	 * @param {object} options - Special options for a tween for an advanced functionality
	 * @param {number} [options.duration] - Duration of animation in milliseconds
	 * @param {number} [options.onUpdate] - Is called each time when the tween applies changes to the target. The tween will be passed in parameters
	 * @param {number} [options.onComplete] - Is called when the tween is completed his animation from the start to the end The tween will be passed in parameters
	 */
	constructor(target, vars, options) {
		this._reset(... arguments)
		console.log(this)
	}

	/**
	 * Clears and initializes again the tween with a new specified data
	*/
	_reset(target, vars, options) {
		if (!target) throw new Error('LapseJS:Tween: target "' + target + '" is wrong')
		if (!vars) throw new Error('LapseJS:Tween: vars "' + target + '" is wrong. You have to pass at least one property to animate')
		if (!options || !options.duration) throw new Error('LapseJS:Tween: options "' + options + '" is wrong. You have to pass at least { \'duration\': milliseconds } to animate')

		if (!options.ease) options.ease = progress => progress

		this._clear()
		this._target = target
		this._varsTarget = vars
		this._options = options

		//remembers "initial values" and calculates "values difference" of the target's properties
		_.each(this._varsTarget, (value, key) => {
			this._varsInit[key] = this._target[key]
			this._varsDifference[key] = value - this._varsInit[key]
		})
	}

	/** Clears the tween but doesn't remove it fully in order to initialize the tween again with a new data (with _reset() method) */
	_clear() {
		this.stop()

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
		this._ratio = this._options.ease(progress)

		//applying new values to target
		_.each(this._varsDifference, (value, key) => this._target[key] = this._varsInit[key] + value * this._ratio )

		//if the tween is playing and we got ratio = 1 it means that the tween` completed
		if (this._isPlaying === true) {
			if (this._options.onUpdate) this._options.onUpdate(this)
			if (this._progress >= 1) {
				if (this._options.onComplete) this._options.onComplete(this)
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
		this._apply(this._progress + Core.ticker.elapsedMS / this._options.duration)
	}

	/**
	 * Plays the animation for the target from the start or from a specified ratio (from 0 to 1)
	 * @param {number} [ratio=0] - A ratio (number from 0 to 1) from which to start playing the tween
	 */
	play(ratio) {
		if (!ratio) ratio = 0
		if (this._isPlaying === true) return
		this._isPlaying = true
		this._isFinished = false
		this._apply(0)
		Core.ticker.add(this._tick, this)
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