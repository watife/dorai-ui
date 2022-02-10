import '@testing-library/jest-dom'

jest.spyOn(global.console, 'error').mockImplementation(jest.fn())
jest.spyOn(global.console, 'warn').mockImplementation(jest.fn())
