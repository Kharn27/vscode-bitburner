export function toJSON(object: Record<string, unknown>): Record<string, unknown> {

	// start with an empty object (see other alternatives below) 
	const jsonObj = Object.assign({}, object);

	// add all properties
	const proto = Object.getPrototypeOf(object);
	for (const key of Object.getOwnPropertyNames(proto)) {
		const desc = Object.getOwnPropertyDescriptor(proto, key);
		//const hasGetter = desc && typeof desc.get === 'function';
		if (desc && typeof desc.get === 'function') {
			jsonObj[key] = desc.get();
		}
	}
	return jsonObj;
}