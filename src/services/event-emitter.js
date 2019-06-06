// this services provides workaround when communicating between child components without introducing unnecessary frameworks, like Redux 
// in other words -- it gets the job done with fewer lines

const events = new Map();

export default {
    addListener(event, callback) {
        if (!events.has(event)) {
            events.set(event, []);
        }
        events.set(event, events.get(event).concat(callback));
    },
    emit(event, data = {}) {
        const callbacks = events.get(event);
        for (const c of callbacks) {
            c(data);
        }
    }
}