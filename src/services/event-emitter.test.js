import eventEmitter from './event-emitter';

it('subscribes to event', () => {
    eventEmitter.addListener('test', () => {
    })

    const events = eventEmitter.getSubscribers('test');
    expect(events).not.toBeNull();
    expect(events.length).toEqual(1);
});

it('emits event', () => {
    let called = null;
    eventEmitter.addListener('test', data => {
        called = data.called;
    });

    eventEmitter.emit('test', { called: true });

    expect(called).not.toBeNull();
    expect(called).toEqual(true);
});