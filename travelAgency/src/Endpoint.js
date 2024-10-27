const userApi = 'api/users/';
export const getRole = userApi + 'user-role';
export const registerUser = userApi + 'register';
export const loginUser = userApi + 'login';
export const logoutUser = userApi + 'logout';
export const getUsers = userApi + 'users';
export const singleUser = userApi + 'get-user_';
export const cancelFlight = userApi + 'cancel_flight_';
export const cancelBusTrip = userApi + 'cancel_bus_trip_';
export const removeExpiredTrips = userApi + 'trips_cleanup';

const flightsApi = '/api/flights/';
export const createFlights = flightsApi + 'create_flight';
export const getFlights = flightsApi + 'get_flights';
export const filteredFlights = flightsApi + 'filtered_flights';
export const purchaseFlight = flightsApi + 'purchase_flight';
export const getPurchasedFlights = flightsApi + 'get_purchased_flights';

const busesApi = '/api/buses/';
export const createBuses = busesApi + 'add-bustrip';
export const filteredTrips = busesApi + 'filtered_buses';

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
export const editPlanes = planesApi + 'edit_plane_';
export const deletePlane = planesApi + 'delete_plane_';
export const createFlightCompany = planesApi + 'create_company';
export const getFlightCompanies = planesApi + 'get_companies';
export const editCompanies = planesApi + 'edit_company_';
export const deleteCompany = planesApi + 'delete_company_';


const busTicketsApi = 'api/bus_tickets/';
export const purchaseBus = busTicketsApi + 'purchase_bus_trip';
export const getPurchasedTrips = busTicketsApi + 'get_purchased_bus_trips';

const offersApi = '/api/offers/';
export const createOffers = offersApi + 'create_offer';
export const getOffers = offersApi + 'get_offers';