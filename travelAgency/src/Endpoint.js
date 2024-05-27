const userApi = 'api/securewebsite/';
const flightsApi = '/api/flights/';
const busesApi = '/api/bus/';
export const getRole = userApi + 'user-role';
export const registerUser = userApi + 'register';
export const loginUser = userApi + 'login';
export const logoutUser = userApi + 'logout';
export const getUsers = userApi + 'users';
export const createFlights = flightsApi + 'create_flight';
export const getFlights = flightsApi + 'get_flights';
export const filteredFlights = flightsApi + 'filtered_flights';
export const purchaseFlight = flightsApi + 'purchase_flight';
export const createBuses = busesApi + 'create_bus';
export const filteredTrips = busesApi + 'filtered_bus';
export const purchaseBus = busesApi + 'purchase_bus';



