import React from 'react';

const mockWrapper = () => {
	jest.mock('../../../system/wrapper/wrapper', () => {
		return {
			Wrapper: () => {
				return <div />;
			}
		};
	});
};

mockWrapper();

export default mockWrapper;

