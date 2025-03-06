export class EventBus {
    constructor() {
        this.events = new Map();
    }

    on(event, callback) {
        if (!this.events.has(event)) this.events.set(event, []);
        this.events.get(event).push(callback);
    }

    off(event, callback) {
        if (this.events.has(event)) {
            this.events.set(event, this.events.get(event).filter(cb => cb !== callback));
        }
    }

    emit(event, data = null) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => callback(data));
        }
    }
}
