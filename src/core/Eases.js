export default {
	'backIn': x => x * x * ((1.7 + 1) * x - 1.7),
	'backOut': x => ((x = x - 1) * x * ((1.7 + 1) * x + 1.7) + 1),
	'backInOut': x => ((x *= 2) < 1) ? 0.5 * x * x * ((2.6 + 1) * x - 2.6) : 0.5 * ((x -= 2) * x * ((2.6 + 1) * x + 2.6) + 2),
	'linear': x => x
}