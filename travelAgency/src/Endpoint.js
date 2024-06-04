const userApi = 'api/securewebsite/';
export const getRole = userApi + 'user-role';
export const registerUser = userApi + 'register';
export const loginUser = userApi + 'login';
export const logoutUser = userApi + 'logout';
export const getUsers = userApi + 'users';


const flightsApi = '/api/flights/';
export const createFlights = flightsApi + 'create_flight';
export const getFlights = flightsApi + 'get_flights';
export const filteredFlights = flightsApi + 'filtered_flights';
export const purchaseFlight = flightsApi + 'purchase_flight';
export const getPurchasedFlights = flightsApi + 'get_purchased_flights';


const busesApi = '/api/bus/';
export const createBuses = busesApi + 'create_bus';
export const filteredTrips = busesApi + 'filtered_bus';
export const purchaseBus = busesApi + 'purchase_bus';


const planesApi = '/api/plane/';
export const createPlanes = planesApi + 'create_plane';
export const getPlanes = planesApi + 'get_planes';
export const editPlanes = planesApi + 'edit_plane_';
export const deletePlane = planesApi + 'delete_plane_';
export const createFlightCompany = planesApi + 'create_company';
export const getFlightCompanies = planesApi + 'get_companies';