import * as loginHelperFunctions from '../../../src/components/login/helpers';

const mockLoginFunctions = () => {
	jest.spyOn(loginHelperFunctions, 'getAuthenticationTokens')
		.mockImplementation(() => {
			return { token: 'token' };
		});

	jest.spyOn(loginHelperFunctions, 'getCachedCredentials')
		.mockImplementation(() => {
			return {
				user: 'testUser',
				password: 'testPassword',
				rememberMe: true
			};
		});
};

mockLoginFunctions();

export default mockLoginFunctions;
