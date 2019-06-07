import envConfig from './env-config';

it('has api configuration', () => {
    expect(envConfig.api).not.toBeNull();
    expect(envConfig.api.address).not.toBeNull();
    expect(envConfig.api.key).not.toBeNull();
});