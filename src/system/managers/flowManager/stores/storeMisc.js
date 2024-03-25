//These used to be defined in flowManager.js but because emit (which uses eventSubscriptions)
// now lies in its own file, we have to define these outside too

export const eventSubscriptions = [];
export const queuedEvents = [];
