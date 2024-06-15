const userApi = 'api/users/';
export const getRole = userApi + 'user-role';
export const registerUser = userApi + 'register';
export const loginUser = userApi + 'login';
export const logoutUser = userApi + 'logout';
export const getUsers = userApi + 'users';
export const singleUser = userApi + 'get-user';

const flightsApi = '/api/flights/';
export const createFlights = flightsApi + 'create_flight';
export const getFlights = flightsApi + 'get_flights';
export const filteredFlights = flightsApi + 'filtered_flights';
export const purchaseFlight = flightsApi + 'purchase_flight';
export const getPurchasedFlights = flightsApi + 'get_purchased_flights';


const busesApi = '/api/buses/';
export const createBuses = busesApi + 'add-bustrip';
export const filteredTrips = busesApi + 'filtered_buses';
export const purchaseBus = busesApi + 'purchase_bus';

//Endpoint krijohet per arsye te komunikimit te metodave te back-end me elementet e front-end
const busCompanyApi = 'api/buscompany/';
export const addBuses = busCompanyApi + 'add-bus';
export const editBus = busCompanyApi + 'edit-bus/';
export const deleteBus = busCompanyApi + 'delete-bus/';
export const getBuses = busCompanyApi + 'get-buses';
export const addBusCompany = busCompanyApi + 'add-bus-company';
export const editBusCopmany = busCompanyApi + 'edit-bus-company/';
export const deleteBusCompany = busCompanyApi + 'delete-bus-company/';
export const getBusCopmanies = busCompanyApi + 'get-bus-companies';


const planesApi = '/api/plane/';
export const createPlanes = planesApi + 'create_plane';
export const getPlanes = planesApi + 'get_planes';
export const editPlanes = planesApi + 'edit_plane';
export const deletePlane = planesApi + 'deleteplane';
export const createFlightCompany = planesApi + 'createcompany';
export const getFlightCompanies = planesApi + 'get_companies';
export const editCompanies = planesApi + 'edit_company';
export const deleteCompany = planesApi + 'deletecompany';