import '@testing-library/jest-dom'

jest.spyOn(global.console, 'error').mockImplementation(jest.fn())
