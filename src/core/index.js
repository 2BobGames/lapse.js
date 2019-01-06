import { Ticker } from '@pixi/ticker'

/** Core of the library */
const Core = {
	/** A ticker handles invoking methods each frame in needed objects. Only one single ticker for all library in accessible place. */
	ticker: new Ticker()
}

Core.ticker.start()

export default Core